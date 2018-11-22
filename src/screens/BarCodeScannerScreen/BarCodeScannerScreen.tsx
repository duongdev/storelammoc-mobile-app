import find from 'lodash/find'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import * as React from 'react'

import withGrantCamera from 'hocs/grant-camera'
import keepAwake from 'hocs/keep-awake'
import withStatusBar from 'hocs/status-bar'
import transitionTimeout from 'hocs/transition-timeout'
import { compose } from 'recompose'

import { MaterialIcons } from '@expo/vector-icons'
import { BarCodeReadCallback, BarCodeScanner } from 'expo'
import { Button } from 'native-base'
import { AsyncStorage, Platform, StyleSheet, View } from 'react-native'
import { NavigationComponent } from 'react-navigation'

import colors from 'constants/colors'
import env from 'constants/env'

import LoadingOpacity from 'components/LoadingOpacity'
import NoProductError from 'screens/BarCodeScannerScreen/components/NoProductError'

import BarCodeScannerOverlay from './components/BarCodeScannerOverlay'

export interface BarCodeScannerProps extends NavigationComponent {
  granted?: boolean
  isReady?: boolean
}
interface BarCodeScannerStates {
  lastScanAt: number
  isFetching: boolean
  isFetchTimeout: boolean
  isShowNoProduct: boolean
}

class BarcodeScannerScreen extends React.Component<
  BarCodeScannerProps,
  BarCodeScannerStates
> {
  didFocusSubscription: any
  isAndroid = Platform.OS === 'android'

  state = {
    lastScanAt: 0,
    isFetching: false,
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

  mapProductData = (sku: string, product: any) => {
    const variants = get(product, 'variants', [])
    const data: {
      _id: string
      slug: string
      variantId?: string
    } = {
      _id: product._id,
      slug: product.slug,
    }

    if (!isEmpty(variants)) {
      const variant = find(variants, variant => {
        return variant.sku === sku
      })
      data.variantId = variant._id
    }

    return data
  }

  storageProduct = async (sku: string, mapedProduct: any) => {
    try {
      await AsyncStorage.setItem(`@sku:${sku}`, JSON.stringify(mapedProduct))
    } catch (err) {
      console.warn(err)
    }
  }

  getProductFromStorage = async (sku: string) => {
    try {
      const productString = await AsyncStorage.getItem(`@sku:${sku}`)
      if (!productString) {
        return null
      }

      const product = JSON.parse(productString)
      return product
    } catch (err) {
      console.warn(err)
    }
  }

  timeout = 0
  requestSKU = async (sku: string) => {
    try {
      this.setState(
        {
          isFetching: true,
        },
        () => {
          this.timeout = setTimeout(() => {
            this.setState({
              isFetchTimeout: true,
            })
          }, 3000) as any
        },
      )

      let product = await this.getProductFromStorage(sku)
      if (product) {
        return product
      }

      const url = `${env.API_URL}/v2/products/${sku}?sku=true`
      const res = await fetch(url)
      if (this.state.isFetchTimeout) {
        return false
      }

      clearTimeout(this.timeout)

      if (res.status === 404) {
        return false
      }

      this.setState({
        isFetching: false,
      })

      product = await res.json()
      const mapedProduct = this.mapProductData(sku, product)

      this.storageProduct(sku, mapedProduct)

      return mapedProduct
    } catch (err) {
      console.warn(err)
      return false
    }
  }
  postMessageToWeb = get(this.props.navigation, 'state.params.postMessageToWeb')

  onBarCodeRead = ({
    _id,
    slug,
    variantId,
  }: {
    _id: string
    slug: string
    variantId?: string
  }) => {
    this.postMessageToWeb(`product-view-nav:${_id}:${slug}:${variantId}`)
  }

  handleBarCodeRead: BarCodeReadCallback = async params => {
    const { isFetching } = this.state

    if (isFetching) {
      return
    }

    const product = await this.requestSKU(params.data)

    if (product) {
      this.onBarCodeRead(product)
      return this.handleGoTop()
    }

    this.setState({
      isShowNoProduct: !product,
    })
  }

  handleGoBack = () => {
    this.props.navigation.pop()
  }

  handleGoTop = () => {
    this.props.navigation.popToTop()
  }

  onCancelScan = () => {
    this.setState({
      isFetching: false,
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

        {this.state.isFetching &&
          !this.state.isShowNoProduct && (
            <LoadingOpacity
              isRetry={this.state.isFetchTimeout}
              onRetry={this.onCancelScan}
            />
          )}

        {this.state.isShowNoProduct && (
          <NoProductError
            onRetry={this.onCancelScan}
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
