import * as React from 'react'

import withGrantCamera from 'hocs/grant-camera'
import keepAwake from 'hocs/keep-awake'
import withStatusBar from 'hocs/status-bar'
import { compose } from 'recompose'

import { MaterialIcons } from '@expo/vector-icons'
import { BarCodeReadCallback, BarCodeScanner } from 'expo'
import find from 'lodash/find'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { Button } from 'native-base'
import { AsyncStorage, Platform, StyleSheet, View } from 'react-native'
import { NavigationComponent } from 'react-navigation'

import colors from 'constants/colors'
import env from 'constants/env'

import LoadingOpacity from 'components/LoadingOpacity'
import NoProductError from 'screens/BarCodeScannerScreen/components/NoProductError'
import BarCodeScannerOverlay from './components/BarCodeScannerOverlay'

export interface BarCodeScannerProps extends NavigationComponent {}
interface BarCodeScannerStates {
  lastScanAt: number
  isReady: boolean
  isFetching: boolean
  isFetchTimeout: boolean
  isShowNoProduct: boolean
  granted: boolean
}

class BarcodeScannerScreen extends React.Component<
  BarCodeScannerProps,
  BarCodeScannerStates
> {
  didFocusSubscription: any
  isAndroid = Platform.OS === 'android'

  state = {
    isReady: !this.isAndroid,
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

  timeout: number = 0
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
          }, 3000)
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

  handleBarCodeRead: BarCodeReadCallback = async params => {
    const { isFetching } = this.state

    const onBarCodeRead = this.props.navigation.getParam(
      'onBarCodeRead',
      () => {},
    )

    if (isFetching) {
      return
    }

    const product = await this.requestSKU(params.data)

    if (product) {
      onBarCodeRead(product)
      return this.handleGoBack()
    }

    this.setState({
      isShowNoProduct: !product,
    })
  }

  handleGoBack = () => {
    this.props.navigation.pop()
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
        <BarCodeScanner
          torchMode="on"
          onBarCodeRead={this.handleBarCodeRead}
          style={[StyleSheet.absoluteFill]}
        >
          <BarCodeScannerOverlay />
        </BarCodeScanner>

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
          style={styles.goBackButton}
          iconLeft
          transparent
        >
          <MaterialIcons
            name={this.isAndroid ? 'close' : 'arrow-back'}
            size={32}
            color={colors.white}
          />
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
