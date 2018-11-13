import * as React from 'react'
import {
  Button,
  Linking,
  NavState,
  Platform,
  StyleSheet,
  View,
  WebView as RNWebView,
  WebViewProps as RNWebViewProps,
} from 'react-native'

import SwipeBackGesture from 'components/SwipeBackGesture'
import env from 'constants/env'

import { patchPostMessageJsCode } from './utils'

export interface WebViewProps extends RNWebViewProps {
  showDevTools?: boolean
  isMainScreen: boolean
}

interface WebViewStates {
  navState?: NavState
  error?: NavState
}

export default class WebView extends React.Component<
  WebViewProps,
  WebViewStates
> {
  static defaultProps: Partial<WebViewProps> = {
    showDevTools: __DEV__,
  }

  webView: RNWebView | null = null

  state: WebViewStates = {}

  handleError = (error: NavState) => {
    this.setState({ error })
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

      const storeLink = env.STORE_WEB_URL.replace('?rn-webview=true', '')
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

  public render() {
    return (
      <SwipeBackGesture
        isMainScreen={this.props.isMainScreen}
        onRelease={this.handleGestureRelease}
      >
        <RNWebView
          /*** common ***/
          startInLoadingState
          onError={this.handleError}
          injectedJavaScript={
            Platform.OS === 'ios' ? patchPostMessageJsCode : ''
          }
          /*** ios ***/
          // FIXME: Enable on React Native >= 0.57.0
          useWebKit
          bounces={false}
          /*** android ***/
          domStorageEnabled
          javaScriptEnabled
          ref={ref => (this.webView = ref)}
          dataDetectorTypes="none"
          onNavigationStateChange={this.handleNavigationStateChange}
          {...this.props}
        />

        {this.props.showDevTools && (
          <View style={styles.devTools}>
            <Button
              title="Back"
              onPress={() => this.webView && this.webView.goBack()}
            />
            <Button
              title="reload"
              onPress={() => this.webView && this.webView.reload()}
            />
          </View>
        )}
      </SwipeBackGesture>
    )
  }
}

const styles = StyleSheet.create({
  devTools: {
    borderTopWidth: 1,
    borderTopColor: '#CCC',
    padding: 3,
  },
})
