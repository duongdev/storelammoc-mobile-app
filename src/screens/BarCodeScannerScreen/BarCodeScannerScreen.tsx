import first from 'lodash/first'
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
  CameraConstants,
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
interface BarCodeScannerState {
  lastScanAt: number
  loading: boolean
  isFetchTimeout: boolean
  isShowNoProduct: boolean
}

class BarcodeScannerScreen extends React.Component<
  BarCodeScannerProps,
  BarCodeScannerState
> {
  didFocusSubscription: any
  timeout: any
  isAndroid = Platform.OS === 'android'

  state = {
    lastScanAt: 0,
    /** Determines whether fetching product by SKU from server. */
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

      if (
        this.state.isFetchTimeout ||
        !product ||
        (product as any).code === 404
      ) {
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
    await this.props.cameraRollAskPermission()

    if (!this.props.cameraRollGranted) return

    // Open image picker
    const image: {
      cancelled: boolean
    } & ImagePicker.ImageInfo = (await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'Images',
      allowsEditing: true,
      aspect: [1, 1],
    })) as any

    if (image.cancelled && !image.uri) return

    /**
     * Send the picked image to BarCodeScanner to read bar code
     * TODO: FIXME: Remove type defs when @types/expo adds scanFromURLAsync
     */
    const scanFromURLAsync: (
      url: string,
      barCodeTypes?: CameraConstants['BarCodeType'][],
    ) => Promise<
      {
        type: string
        data: string
      }[]
    > = (BarCodeScanner as any).scanFromURLAsync

    // Select the first bar code in the image
    const qrCode = first(await scanFromURLAsync(image.uri))

    // Fetch product info and navigate to product view page
    if (qrCode && qrCode.type && qrCode.data)
      return this.handleBarCodeRead(qrCode)
  }

  render() {
    return (
      <View style={styles.root}>
        {this.props.cameraGranted && this.props.navigatorFocused ? (
          this.renderBarCodeScanner
        ) : (
          <BarCodeScannerOverlay />
        )}

        {this.state.loading && !this.state.isShowNoProduct && (
          <LoadingOpacity
            showRetry={this.state.isFetchTimeout}
            onRetry={this.handleRetry}
          />
        )}

        {this.state.isShowNoProduct && this.renderProductNotFound}

        {this.renderGoBackButton}
        {this.renderOpenLibraryButton}
      </View>
    )
  }

  /** Renders a full-screen bar code scanner. */
  renderBarCodeScanner = (
    <BarCodeScanner onBarCodeRead={this.handleBarCodeRead} style={{ flex: 1 }}>
      <BarCodeScannerOverlay />
    </BarCodeScanner>
  )

  /** Renders the overlay message when no product found with scanned bar code. */
  renderProductNotFound = (
    <NoProductError onRetry={this.handleRetry} onGoBack={this.handleGoBack} />
  )

  /** Renders "Back" button with press to go back to the previous screen. */
  renderGoBackButton = (
    <Button
      onPress={this.handleGoBack}
      style={{ ...StyleSheet.flatten(styles.goBackButton) }}
      iconLeft
      transparent
    >
      <MaterialIcons name="arrow-back" size={25} color={colors.white} />
    </Button>
  )

  /** Renders "Open library" button, press to open library. */
  renderOpenLibraryButton = (
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
  )
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
        'Vui lòng cho phép Store Làm Mộc sử dụng camera để quét mã sản phẩm.',
    },
  }),
  withNavigatorFocused,
  withPermission<BarCodeScannerProps>({
    askOnMounted: false,
    permission: Permissions.CAMERA_ROLL,
    alert: {
      title: 'Cho phép sử dụng hình ảnh',
      message:
        'Vui lòng cho phép Store Làm Mộc sử dụng hình ảnh từ thư viện để quét mã sản phẩm.',
    },
  }),
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
