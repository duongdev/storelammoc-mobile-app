import get from 'lodash/get'

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

import InAppNotification from 'components/InAppNotification'
import { OfflineNotice } from 'components/TopToast'
import WebView from 'components/WebView'

import { registerClientToken } from 'services/notification-services'

import colors from 'constants/colors'
import global from 'constants/global'
import { screenHeight } from 'constants/metrics'
import { RECEIVED_ACTIONS, SEND_ACTIONS } from 'constants/web-messages'

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

  postMessageToWeb = (action: string, data: any = '') => {
    if (!(this.mainWebView && this.mainWebView.webView)) {
      return
    }
    const message = `${action}$__${JSON.stringify(data)}`
    return this.mainWebView.webView.postMessage(message)
  }

  handleWebViewMessage = async (
    event: NativeSyntheticEvent<WebViewMessageEventData>,
  ) => {
    const message = event.nativeEvent.data
    const [action, data = ''] = message.split('$__')

    switch (action) {
      case RECEIVED_ACTIONS.WEB_APP_LOADED:
        this.setState({
          isReady: true,
        })
        this.postMessageToWeb(SEND_ACTIONS.PING_BACK)
        return

      case RECEIVED_ACTIONS.OPEN_QR_SCANNER:
        this.handleOpenBarcodeScanner()
        return

      case RECEIVED_ACTIONS.ENTER_HOME_SCREEN:
        this.setState({
          gestureLeft: 0,
          gestureTop: screenHeight,
        })
        return

      case RECEIVED_ACTIONS.LEAVE_HOME_SCREEN:
        this.setState({
          gestureLeft: 20,
          gestureTop: screenHeight / 3,
        })
        return

      case RECEIVED_ACTIONS.ENTER_PRODUCT_SCREEN:
        this.setState({
          gestureLeft: 20,
          gestureTop: 0,
        })
        return

      case RECEIVED_ACTIONS.OPEN_SEARCH_BOX:
        this.props.navigation.navigate('SearchScreen', {
          barStyle: 'light-content',
          searchText: data,
          postMessageToWeb: this.postMessageToWeb,
        })
        return

      case RECEIVED_ACTIONS.REDUX_STATE_UPDATE: {
        try {
          const pushToken = await registerClientToken(
            get(JSON.parse(data), 'auth.currentUser', 'unauth'),
          )

          this.postMessageToWeb(SEND_ACTIONS.REGISTER_PUSH_TOKEN, pushToken)
        } catch (error) {
          console.warn(error)
          return
          // TODO: Handle this error. We are ignoring at this moment.
        }
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

    this.postMessageToWeb(SEND_ACTIONS.PING_BACK)
  }

  render() {
    return (
      <View style={styles.container}>
        <WebView
          onLoadEnd={this.handleWebViewLoadEnd}
          gestureLeft={this.state.gestureLeft}
          gestureTop={this.state.gestureTop}
          source={{ uri: `${global.STORE_WEB_URL}?rn-webview=true` }}
          style={styles.mainWebView}
          ref={webView => (this.mainWebView = webView)}
          onMessage={this.handleWebViewMessage}
        />

        <OfflineNotice />
        <InAppNotification postMessageToWeb={this.postMessageToWeb} />
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
