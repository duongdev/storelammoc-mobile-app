import * as React from 'react'
import {
  NativeSyntheticEvent,
  StyleSheet,
  View,
  WebViewMessageEventData,
} from 'react-native'
import { NavigationComponent } from 'react-navigation'

import StatusBar from 'components/StatusBar'
import WebView from 'components/WebView'

import colors from 'constants/colors'
import env from 'constants/env'
import { RECEIVED_MESSAGES, SEND_MESSAGES } from 'constants/web-messages'

export interface MainScreenProps {}

export default class MainScreen extends React.Component<
  MainScreenProps & NavigationComponent,
  any
> {
  mainWebView: WebView | null = null

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

  public render() {
    console.log(this.props.navigation)
    return (
      <View style={styles.container}>
        <StatusBar />
        <WebView
          source={{ uri: env.STORE_WEB_URL }}
          style={styles.mainWebView}
          ref={webView => (this.mainWebView = webView)}
          onMessage={this.handleWebViewMessage}
          showDevTools={false}
        />
      </View>
    )
  }
}

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
