import * as React from 'react'

import withStatusBar from 'hocs/status-bar'

import {
  BackHandler,
  Image,
  NativeSyntheticEvent,
  StyleSheet,
  View,
  WebViewMessageEventData,
} from 'react-native'
import { NavigationComponent } from 'react-navigation'

import WebView from 'components/WebView'

import colors from 'constants/colors'
import env from 'constants/env'
import { RECEIVED_MESSAGES, SEND_MESSAGES } from 'constants/web-messages'

import images from '../../../assets/images'

export interface MainScreenProps {}

class MainScreen extends React.Component<
  MainScreenProps & NavigationComponent,
  any
> {
  mainWebView: WebView | null = null
  backHandler: any
  state = {
    isLoading: true,
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
          isLoading: false,
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

  renderWebViewLoading = () => {
    return (
      <View style={styles.loadingContainer}>
        <Image
          source={images.splash}
          style={{
            width: '100%',
            height: '100%',
          }}
          resizeMode="contain"
        />
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <WebView
          source={{ uri: env.STORE_WEB_URL }}
          style={styles.mainWebView}
          ref={webView => (this.mainWebView = webView)}
          onMessage={this.handleWebViewMessage}
        />
        {this.state.isLoading && this.renderWebViewLoading()}
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
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
})
