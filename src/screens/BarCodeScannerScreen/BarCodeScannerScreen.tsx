import get from 'lodash/get'

import * as React from 'react'

import withGrantCamera from 'hocs/grant-camera'
import keepAwake from 'hocs/keep-awake'
import withStatusBar from 'hocs/status-bar'
import transitionTimeout from 'hocs/transition-timeout'
import { compose } from 'recompose'

import { MaterialIcons } from '@expo/vector-icons'
import { BarCodeReadCallback, BarCodeScanner } from 'expo'
import { Button } from 'native-base'
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

  componentWillReceiveProps(nextProps: BarCodeScannerProps) {
    if (this.props.granted !== nextProps.granted) {
      this.forceUpdate()
    }
  }

  componentWillUnmount() {
    if (this.didFocusSubscription) {
      this.didFocusSubscription.remove()
    }

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

    if (loading) {
      return
    }

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

  render() {
    return (
      <View style={styles.root}>
        {this.props.granted && this.props.isReady ? (
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
      </View>
    )
  }
}

export default compose(
  withStatusBar({
    hidden: true,
  }),
  keepAwake(),
  withGrantCamera,
  transitionTimeout,
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
})
