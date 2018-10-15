import * as React from 'react'

import withStatusBar from 'hocs/status-bar'

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

  componentDidMount = () => {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      const { navigation } = this.props
      const isMainScreenFocused = navigation.isFocused()

      if (isMainScreenFocused && this.mainWebView && this.mainWebView.webView) {
        return this.mainWebView.webView.goBack()
      }

      return navigation.pop()
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
      onBarCodeRead: ({ data }: { data: string }) => {
        this.postMessageToWeb(`scanner-${data}`)
      },
    })
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.isReady && <SplashScreen />}
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

export default withStatusBar({ hidden: false })(MainScreen)

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
