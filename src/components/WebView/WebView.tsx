import * as React from 'react'

import { Container } from 'native-base'
import {
  ActivityIndicator,
  Button,
  Image,
  Linking,
  NavState,
  Platform,
  StyleSheet,
  Text,
  View,
  ViewProps,
  WebView as RNWebView,
  WebViewProps as RNWebViewProps,
} from 'react-native'

import SplashScreen from 'components/SplashScreen'
import SwipeBackGesture from 'components/SwipeBackGesture'
import env from 'constants/env'

import images from 'assets/images'
import colors from 'constants/colors'
import { patchPostMessageJsCode } from './utils'

const TIME_OUT = 15000 // set timeout to 15s

export interface WebViewProps extends RNWebViewProps {
  gestureLeft?: number
  gestureTop?: number
  isMainScreen: boolean
}

interface WebViewStates {
  navState?: NavState
  error?: NavState
  isTimeout: boolean
  isError: boolean
  isReady: boolean
}

export default class WebView extends React.Component<
  WebViewProps,
  WebViewStates
> {
  static defaultProps: Partial<WebViewProps> = {}

  webView: RNWebView | null = null

  state = {
    error: {},
    isTimeout: false,
    isError: false,
    isReady: false,
  }

  componentDidMount() {
    this.setTimeoutWebView()
  }

  setTimeoutWebView = () => {
    setTimeout(() => {
      if (!this.state.isError) {
        this.setState({ isTimeout: !this.state.isReady })
      }
    }, TIME_OUT)
  }

  handleError = (error: NavState) => {
    this.setState({ error, isError: true })
    // Send error to Sentry.
    try {
      throw error
    } catch (err) {
      /* ignore */
    }
  }

  handleGestureRelease = () => {
    if (this.webView) {
      this.webView.goBack()
    }
  }

  handleNavigationStateChange = (event: NavState) => {
    const isContinue = this.handleExternalLink(event.url)
    if (!isContinue && this.webView) {
      this.webView.stopLoading()
    }
  }

  handleExternalLink = (url?: string) => {
    try {
      if (!url) {
        return
      }
      const isHttpLink = /^http.*/.test(url)

      const storeLink = env.STORE_WEB_URL
      const accountKitLink = 'accountkit'
      const accountKitFAQ = 'accountkit.com/faq'

      const isStoreLink = url.search(storeLink) !== -1
      const isAccountKitLink = url.search(accountKitLink) !== -1
      const isAccountKitFAQ = url.search(accountKitFAQ) !== -1

      if (
        isAccountKitFAQ ||
        (!isStoreLink && !isAccountKitLink && isHttpLink)
      ) {
        Linking.openURL(url)
        return false
      }

      return true
    } catch (err) {
      return false
    }
  }

  handleLoadEnd = (event: NavState) => {
    const { onLoadEnd } = this.props
    if (typeof onLoadEnd === 'function') {
      onLoadEnd(event)
    }

    this.setState({
      isReady: true,
      isTimeout: false,
    })
  }

  handleReload = () => {
    this.setState({
      isReady: false,
      isTimeout: false,
      isError: false,
    })

    this.setTimeoutWebView()
    return this.webView && this.webView.reload()
  }

  renderError = (): React.ReactElement<ViewProps> => {
    if (!this.state.isTimeout && !this.state.isError) {
      return <View />
    }

    const { isTimeout } = this.state

    return (
      <Container style={{ ...StyleSheet.flatten(styles.errorContainer) }}>
        <View style={styles.contentWrapper}>
          <View style={styles.errorWrapper}>
            <Image
              source={images.emoji_sorry}
              resizeMode="contain"
              style={styles.errorEmoji as any}
            />
            {isTimeout && <ActivityIndicator />}
            <Text style={styles.errorText}>
              {isTimeout
                ? `Chờ lâu quá!\nBạn có muốn tải lại không?`
                : `Có lỗi xảy ra!\nVui lòng thử lại!`}
            </Text>
            <View style={{ marginTop: 10 }}>
              <Button title="Thử lại" onPress={this.handleReload} />
            </View>
          </View>
        </View>
      </Container>
    )
  }

  render() {
    return (
      <SwipeBackGesture
        left={this.props.gestureLeft}
        top={this.props.gestureTop}
        onRelease={this.handleGestureRelease}
      >
        <RNWebView
          /*** common ***/
          startInLoadingState
          onLoad={this.handleLoadEnd}
          onError={this.handleError}
          renderError={this.renderError}
          injectedJavaScript={
            Platform.OS === 'ios' ? patchPostMessageJsCode : ''
          }
          onNavigationStateChange={this.handleNavigationStateChange}
          dataDetectorTypes="none"
          ref={ref => (this.webView = ref)}
          /*** ios ***/
          useWebKit
          allowsInlineMediaPlayback
          bounces={false}
          decelerationRate={4}
          /*** android ***/
          domStorageEnabled
          javaScriptEnabled
          {...this.props}
        />

        {!this.state.isReady && <SplashScreen />}
        {this.renderError()}
      </SwipeBackGesture>
    )
  }
}

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
  },
  errorHeader: {
    backgroundColor: colors.primary,
  },
  logoHeader: {
    height: '100%',
    resizeMode: 'contain',
  },
  errorEmoji: {
    height: 200,
    backgroundColor: colors.white,
  },
  errorWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 15,
    textAlign: 'center',
    alignSelf: 'center',
    color: colors.black,
  },
})
