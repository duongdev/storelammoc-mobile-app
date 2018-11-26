import get from 'lodash/get'

import * as React from 'react'

import keepAwake from 'hocs/keepAwake'
import withNavigatorFocused from 'hocs/withNavigatorFocused'
import withPermission from 'hocs/withPermission'
import withStatusBar from 'hocs/withStatusBar'
import { compose } from 'recompose'

import { MaterialIcons } from '@expo/vector-icons'
import {
  BarCodeReadCallback,
  BarCodeScanner,
  ImagePicker,
  Permissions,
} from 'expo'
import { Button, Icon, Text } from 'native-base'
import { Platform, StyleSheet, View } from 'react-native'
import { NavigationComponent } from 'react-navigation'

import LoadingOpacity from 'components/LoadingOpacity'

import colors from 'constants/colors'

import { getProductBySKU, getProductNavData } from 'services/product-services'
import { Variant } from 'types/products'

import BarCodeScannerOverlay from './components/BarCodeScannerOverlay'
import NoProductError from './components/NoProductError'

export interface BarCodeScannerProps extends NavigationComponent {
  granted?: boolean
  isReady?: boolean
}
interface BarCodeScannerStates {
  lastScanAt: number
  loading: boolean
  isFetchTimeout: boolean
  isShowNoProduct: boolean
}

class BarcodeScannerScreen extends React.Component<
  BarCodeScannerProps,
  BarCodeScannerStates
> {
  didFocusSubscription: any
  timeout: any
  isAndroid = Platform.OS === 'android'

  state = {
    lastScanAt: 0,
    loading: false,
    isFetchTimeout: false,
    isShowNoProduct: false,
  }

  componentDidMount() {
    if (typeof this.props.onSetHidden === 'function') {
      this.props.onSetHidden(true)
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout)
  }
  getProductNavData = async (sku: Variant['sku']) => {
    this.timeout = setTimeout(() => {
      this.setState({
        isFetchTimeout: true,
      })
    }, 3000)

    this.setState({
      loading: true,
    })

    try {
      const product = await getProductBySKU(sku)

      clearTimeout(this.timeout)

      this.setState({
        loading: false,
      })

      if (this.state.isFetchTimeout || !product) {
        this.setState({
          isShowNoProduct: true,
        })
        return false
      }

      const productNavData = getProductNavData(product, sku)

      return productNavData
    } catch (err) {
      console.warn(err)
      return false
    }
  }
  postMessageToWeb = get(this.props.navigation, 'state.params.postMessageToWeb')

  handleBarCodeRead: BarCodeReadCallback = async params => {
    const { loading } = this.state

    if (loading) return

    const productNavData = await this.getProductNavData(params.data)

    if (productNavData) {
      const { id, slug, variantId } = productNavData

      this.postMessageToWeb(`product-view-nav:${id}:${slug}:${variantId}`)
      return this.handleGoTop()
    }

    this.setState({
      isShowNoProduct: !productNavData,
    })
  }

  handleGoBack = () => {
    this.props.navigation.pop()
  }

  handleGoTop = () => {
    this.props.navigation.popToTop()
  }

  handleRetry = () => {
    this.setState({
      loading: false,
      isFetchTimeout: false,
      isShowNoProduct: false,
    })
  }

  handleLaunchImageLibrary = async () => {
    if (this.props.cameraRollGranted)
      ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
        allowsEditing: true,
      })
    else this.props.cameraRollAskPermission()
  }

  render() {
    return (
      <View style={styles.root}>
        {this.props.cameraGranted && this.props.navigatorFocused ? (
          <BarCodeScanner
            onBarCodeRead={this.handleBarCodeRead}
            style={{ flex: 1 }}
          >
            <BarCodeScannerOverlay />
          </BarCodeScanner>
        ) : (
          <BarCodeScannerOverlay />
        )}

        {this.state.loading && !this.state.isShowNoProduct && (
          <LoadingOpacity
            showRetry={this.state.isFetchTimeout}
            onRetry={this.handleRetry}
          />
        )}

        {this.state.isShowNoProduct && (
          <NoProductError
            onRetry={this.handleRetry}
            onGoBack={this.handleGoBack}
          />
        )}

        <Button
          onPress={this.handleGoBack}
          style={{ ...StyleSheet.flatten(styles.goBackButton) }}
          iconLeft
          transparent
        >
          <MaterialIcons name="arrow-back" size={25} color={colors.white} />
        </Button>

        <Button
          iconLeft
          transparent
          bordered
          light
          onPress={this.handleLaunchImageLibrary}
          style={{ ...StyleSheet.flatten(styles.launchLibraryButton) }}
        >
          <Icon name="image" type="Entypo" />
          <Text>Mở thư viện</Text>
        </Button>
      </View>
    )
  }
}

export default compose(
  withStatusBar({
    hidden: true,
  }),
  keepAwake(),
  withPermission<BarCodeScannerProps>({
    permission: Permissions.CAMERA,
    onDeny: props => props.navigation.pop(),
    alert: {
      title: 'Cho phép sử dụng camera',
      message:
        Platform.OS === 'android'
          ? 'Để sử dụng tính năng quét mã QR, hãy vào Cài đặt -> Ứng dụng -> Store Làm Mộc -> Quyền và chọn kích hoạt cho phép sử dụng camera.'
          : 'Để sử dụng tính năng quét mã QR, hãy vào Cài đặt -> Quyền riêng tư và chọn kích hoạt cho phép sử dụng camera.',
    },
  }),
  withPermission<BarCodeScannerProps>({
    askOnMounted: false,
    permission: Permissions.CAMERA_ROLL,
    alert: {
      title: 'Cho phép sử dụng hình ảnh',
      message:
        Platform.OS === 'android'
          ? 'Để sử dụng tính năng quét mã QR, hãy vào Cài đặt -> Ứng dụng -> Store Làm Mộc -> Quyền và chọn kích hoạt cho phép sử dụng camera.'
          : 'Để sử dụng tính năng quét mã QR, hãy vào Cài đặt -> Quyền riêng tư và chọn kích hoạt cho phép sử dụng camera.',
    },
  }),
  withNavigatorFocused,
)(BarcodeScannerScreen)

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.black,
  },
  goBackButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingRight: 20,
  },
  launchLibraryButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
})
