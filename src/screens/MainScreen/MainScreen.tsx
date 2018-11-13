import * as React from 'react'

import { compose } from 'recompose'

import keepAwake from 'hocs/keep-awake'
import withStatusBar from 'hocs/status-bar'

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
    isMainScreen: true,
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
      this.props.navigation.navigate('SearchBox', {
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
          isMainScreen: true,
        })
        return

      case RECEIVED_MESSAGES.LEAVE_HOME_SCREEN:
        this.setState({
          isMainScreen: false,
        })
        return

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
          isMainScreen={this.state.isMainScreen}
          source={{ uri: env.STORE_WEB_URL }}
          style={styles.mainWebView}
          ref={webView => (this.mainWebView = webView)}
          onMessage={this.handleWebViewMessage}
          showDevTools={false}
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
