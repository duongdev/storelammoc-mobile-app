import * as React from 'react'

import withGrantCamera from 'hocs/grant-camera'
import keepAwake from 'hocs/keep-awake'
import withStatusBar from 'hocs/status-bar'
import { compose } from 'recompose'

import { MaterialIcons } from '@expo/vector-icons'
import { BarCodeReadCallback, BarCodeScanner } from 'expo'
import { Button } from 'native-base'
import { Platform, StyleSheet, View } from 'react-native'
import { NavigationComponent } from 'react-navigation'

import colors from 'constants/colors'
import env from 'constants/env'

import LoadingOpacity from 'components/LoadingOpacity'
import NoProductError from 'screens/BarCodeScannerScreen/components/NoProductError'
import BarCodeScannerOverlay from './components/BarCodeScannerOverlay'

export interface BarCodeScannerProps {}
interface BarCodeScannerStates {
  lastScanAt: number
  isReady: boolean
  isFetching: boolean
  isFetchTimeout: boolean
  isShowNoProduct: boolean
}

class BarcodeScannerScreen extends React.Component<
  BarCodeScannerProps & NavigationComponent,
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
    this.didFocusSubscription =
      this.isAndroid &&
      this.props.navigation.addListener('didFocus', () => {
        this.setState({
          isReady: true,
        })
      })

    if (typeof this.props.onSetHidden === 'function') {
      this.props.onSetHidden(true)
    }
  }

  componentWillUnmount() {
    if (this.didFocusSubscription) {
      this.didFocusSubscription.remove()
    }
  }

  requestSKU = async (sku: string) => {
    try {
      let timeout = null

      this.setState(
        {
          isFetching: true,
        },
        () => {
          timeout = setTimeout(() => {
            this.setState({
              isFetchTimeout: true,
            })
          }, 3000)
        },
      )
      const url = `${env.API_URL}/v2/products/${sku}?sku=true`
      const res = await fetch(url)
      if (this.state.isFetchTimeout) {
        return false
      }

      timeout && clearTimeout(timeout)

      if (res.status === 404) {
        return false
      }

      this.setState({
        isFetching: false,
      })

      return await res.json()
    } catch (err) {
      console.warn(err)
      return false
    }
  }

  handleBarCodeRead: BarCodeReadCallback = async params => {
    const { isFetching } = this.state
    const now = Date.now()

    const onBarCodeRead = this.props.navigation.getParam(
      'onBarCodeRead',
      () => {},
    )

    if (isFetching) {
      return
    }

    const product = await this.requestSKU(params.data)

    if (product) {
      onBarCodeRead(params)
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
        {this.state.isReady ? (
          <BarCodeScanner
            torchMode="on"
            onBarCodeRead={this.handleBarCodeRead}
            style={[StyleSheet.absoluteFill]}
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
