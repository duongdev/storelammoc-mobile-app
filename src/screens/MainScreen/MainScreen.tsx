import * as React from 'react'

import keepAwake from 'hocs/keep-awake'
import withStatusBar from 'hocs/status-bar'
import { compose } from 'recompose'

import {
  BackHandler,
  NativeSyntheticEvent,
  StyleSheet,
  View,
  WebViewMessageEventData,
} from 'react-native'
import { NavigationComponent } from 'react-navigation'

import SplashScreen from 'components/SplashScreen'
import WebView from 'components/WebView'

import colors from 'constants/colors'
import env from 'constants/env'
import { RECEIVED_MESSAGES, SEND_MESSAGES } from 'constants/web-messages'

export interface MainScreenProps {}

class MainScreen extends React.Component<
  MainScreenProps & NavigationComponent,
  any
> {
  mainWebView: WebView | null = null
  backHandler: any
  state = {
    isReady: false,
  }

  // FIXME: Press back on android will exit app
  componentDidMount = () => {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      const { navigation } = this.props
      const isMainScreenFocused = navigation.isFocused()

      if (isMainScreenFocused) {
        if (this.mainWebView && this.mainWebView.webView) {
          this.mainWebView.webView.goBack()
          return true
        }
        return false
      }

      navigation.pop()
      return true
    })
  }

  componentWillUnmount = () => {
    this.backHandler.remove()
  }

  postMessageToWeb = (message: string) => {
    if (!(this.mainWebView && this.mainWebView.webView)) return
    return this.mainWebView.webView.postMessage(message)
  }

  handleWebViewMessage = async (
    event: NativeSyntheticEvent<WebViewMessageEventData>,
  ) => {
    const message = event.nativeEvent.data

    switch (message) {
      case RECEIVED_MESSAGES.WEB_APP_LOADED:
        this.postMessageToWeb(SEND_MESSAGES.PING_BACK)
        this.setState({
          isReady: true,
        })
        return

      case RECEIVED_MESSAGES.OPEN_QR_SCANNER:
        this.handleOpenBarcodeScanner()
        return

      default:
        return
    }
  }

  handleOpenBarcodeScanner = () => {
    this.props.navigation.navigate('BarCodeScanner', {
      onBarCodeRead: ({
        _id,
        slug,
        variantId,
      }: {
        _id: string
        slug: string
        variantId?: string
      }) => {
        this.postMessageToWeb(`product-view-nav:${_id}:${slug}:${variantId}`)
      },
    })
  }

  render() {
    return (
      <View style={styles.container}>
        {!this.state.isReady && <SplashScreen />}
        <WebView
          source={{ uri: env.STORE_WEB_URL }}
          style={styles.mainWebView}
          ref={webView => (this.mainWebView = webView)}
          onMessage={this.handleWebViewMessage}
          renderLoading={SplashScreen}
        />
      </View>
    )
  }
}

export default compose(
  withStatusBar({ hidden: false }),
  keepAwake(false),
)(MainScreen)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: colors.white,
  },
  mainWebView: {
    flex: 1,
    backgroundColor: colors.primary,
  },
})
