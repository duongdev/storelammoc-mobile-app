import get from 'lodash/get'

import * as React from 'react'

import { compose } from 'recompose'

import keepAwake from 'hocs/keepAwake'
import withStatusBar from 'hocs/withStatusBar'

import {
  BackHandler,
  NativeSyntheticEvent,
  StatusBar,
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
interface State {
  /** Whether the WebView is loaded */
  isReady: boolean
  gestureLeft: number
  gestureTop: number

  /** Pending WebView message when the WebView isn't ready or is not focused. */
  pendingWVMessage: [string, any] | null
}

class MainScreen extends React.Component<
  MainScreenProps & NavigationComponent,
  State
> {
  mainWebView: WebView | null = null
  backHandler: any
  state: State = {
    isReady: false,
    gestureLeft: 0,
    gestureTop: 0,
    pendingWVMessage: null,
  }

  setStatusBarInterval = null
  componentDidMount = () => {
    const { navigation } = this.props

    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
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

    // TODO: FIXME: Tắt nó đi khi sửa được lỗi xem video fullscreen.
    navigation.addListener('didFocus', () => {
      this.setStatusBarInterval = setInterval(() => {
        StatusBar.setHidden(false)
      }, 3000) as any
    })
    navigation.addListener('didBlur', () => {
      if (this.setStatusBarInterval)
        clearInterval(this.setStatusBarInterval as any)
    })
  }

  componentDidUpdate = (prevProps: MainScreenProps, prevState: State) => {
    // * Handles on WebView is ready.
    if (!prevState.isReady && this.state.isReady) {
      // * Handles pendingMessage is waiting to be sent.
      if (this.state.pendingWVMessage) {
        this.postPendingMessageToWeb()
      }
    }
  }

  componentWillUnmount = () => {
    this.backHandler.remove()
  }

  postMessageToWeb = (action: string, data: any = '') => {
    const isWebViewReady =
      this.mainWebView && this.mainWebView.webView && this.state.isReady

    if (action === SEND_ACTIONS.NAVIGATE && !isWebViewReady) {
      return this.setState({
        pendingWVMessage: [action, data],
      })
    }

    const message = `${action}$__${JSON.stringify(data)}`
    return this.mainWebView!.webView.postMessage(message)
  }

  handleWebViewMessage = async (
    event: NativeSyntheticEvent<WebViewMessageEventData>,
  ) => {
    const message = event.nativeEvent.data
    const [action, $data] = message.split('$__')
    let data = null
    try {
      data = JSON.parse($data)
    } catch (err) {
      // ignore
    }

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
            get(data, 'auth.currentUser', 'unauth'),
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

  postPendingMessageToWeb = () => {
    if (!this.state.pendingWVMessage) return

    this.postMessageToWeb(...this.state.pendingWVMessage)
    this.setState({ pendingWVMessage: null })
  }

  render() {
    return (
      <View style={styles.container}>
        <WebView
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
