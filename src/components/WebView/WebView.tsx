import * as React from 'react'
import {
  Button,
  NavState,
  Platform,
  StyleSheet,
  Text,
  View,
  WebView as RNWebView,
  WebViewProps as RNWebViewProps,
} from 'react-native'

import { patchPostMessageJsCode } from './utils'

export interface WebViewProps extends RNWebViewProps {
  showDevTools?: boolean
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

  // FIXME: On iOS, WebView can't detect React web app navigation.
  // Haven't tested on Android.
  handleNavigationStateChange = (navState: NavState) => {
    this.setState({ navState })
  }
  handleError = (error: NavState) => {
    this.setState({ error })
  }

  public render() {
    return (
      <React.Fragment>
        <RNWebView
          /*** common ***/
          startInLoadingState
          onNavigationStateChange={this.handleNavigationStateChange}
          onError={this.handleError}
          injectedJavaScript={
            Platform.OS === 'ios' ? patchPostMessageJsCode : ''
          }
          /*** ios ***/
          // useWebKit
          bounces={false}
          onShouldStartLoadWithRequest={() => true}
          /*** android ***/
          domStorageEnabled
          ref={ref => (this.webView = ref)}
          {...this.props}
        />

        {this.props.showDevTools && (
          <View style={styles.devTools}>
            <Text>{this.state.navState && this.state.navState.url}</Text>
            <Button
              title="reload"
              onPress={() => this.webView && this.webView.reload()}
            />
          </View>
        )}
      </React.Fragment>
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
