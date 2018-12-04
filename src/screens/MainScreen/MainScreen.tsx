import * as React from 'react'

import { compose } from 'recompose'

import keepAwake from 'hocs/keepAwake'
import withStatusBar from 'hocs/withStatusBar'

import {
  BackHandler,
  NativeSyntheticEvent,
  StyleSheet,
  View,
  WebViewMessageEventData,
} from 'react-native'
import { NavigationComponent } from 'react-navigation'

import { OfflineNotice } from 'components/TopToast'
import WebView from 'components/WebView'

import colors from 'constants/colors'
import env from 'constants/env'
import { screenHeight } from 'constants/metrics'
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
    gestureLeft: 0,
    gestureTop: 0,
  }

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

    if (message.match(new RegExp(`${RECEIVED_MESSAGES.OPEN_SEARCH_BOX}.*?$`))) {
      const searchText = message.replace(
        `${RECEIVED_MESSAGES.OPEN_SEARCH_BOX}:`,
        '',
      )
      this.props.navigation.navigate('SearchScreen', {
        barStyle: 'light-content',
        searchText,
        postMessageToWeb: this.postMessageToWeb,
      })
    }

    switch (message) {
      case RECEIVED_MESSAGES.WEB_APP_LOADED:
        this.setState({
          isReady: true,
        })
        this.postMessageToWeb(SEND_MESSAGES.PING_BACK)
        return

      case RECEIVED_MESSAGES.OPEN_QR_SCANNER:
        this.handleOpenBarcodeScanner()
        return

      case RECEIVED_MESSAGES.ENTER_HOME_SCREEN:
        this.setState({
          gestureLeft: 0,
          gestureTop: screenHeight,
        })
        return

      case RECEIVED_MESSAGES.LEAVE_HOME_SCREEN:
        this.setState({
          gestureLeft: 20,
          gestureTop: screenHeight / 3,
        })
        return

      case RECEIVED_MESSAGES.ENTER_PRODUCT_SCREEN: {
        this.setState({
          gestureLeft: 20,
          gestureTop: 0,
        })
      }
      default:
        return
    }
  }

  handleOpenBarcodeScanner = () => {
    this.props.navigation.navigate('BarCodeScanner', {
      postMessageToWeb: this.postMessageToWeb,
    })
  }

  handleWebViewLoadEnd = () => {
    this.setState({
      isReady: true,
    })

    this.postMessageToWeb(SEND_MESSAGES.PING_BACK)
  }

  render() {
    return (
      <View style={styles.container}>
        <WebView
          onLoadEnd={this.handleWebViewLoadEnd}
          gestureLeft={this.state.gestureLeft}
          gestureTop={this.state.gestureTop}
          source={{ uri: `${env.STORE_WEB_URL}?rn-webview=true` }}
          style={styles.mainWebView}
          ref={webView => (this.mainWebView = webView)}
          onMessage={this.handleWebViewMessage}
        />

        <OfflineNotice />
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
