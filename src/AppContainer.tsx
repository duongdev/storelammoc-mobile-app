import * as React from 'react'

import { AppLoading, Asset, SplashScreen, Updates } from 'expo'
import { Image, StatusBar, View } from 'react-native'

import colors from 'constants/colors'
import StackNavigator from 'navigations/StackNavigator'

import images from 'assets/images'

interface Props {}

class AppContainer extends React.Component<Props> {
  state = {
    isReady: false,
    isSplashReady: false,
    isSplashError: false,
  }

  handleUpdateListener = (event: Updates.UpdateEvent) => {
    if (event.type === Updates.EventType.DOWNLOAD_FINISHED) {
      Updates.reload()
    } else if (event.type === Updates.EventType.ERROR) {
      Updates.reloadFromCache()
    }
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content')
    Updates.addListener(this.handleUpdateListener)
  }

  cacheSplashResourceAsync = () => {
    const gif = images.splash
    return Asset.fromModule(gif).downloadAsync()
  }

  handleAppLoadingFinish = () => {
    this.setState({
      isSplashReady: true,
    })
  }

  handleAppLoadingError = () => {
    this.setState({
      isSplashError: true,
    })
  }

  cacheAppResourceAsync = () => {
    SplashScreen.hide()
    this.setState({
      isReady: true,
    })
  }

  render() {
    if (!this.state.isSplashReady) {
      return (
        <AppLoading
          startAsync={this.cacheSplashResourceAsync}
          onFinish={this.handleAppLoadingFinish}
          onError={this.handleAppLoadingError}
        />
      )
    }

    if (!this.state.isReady) {
      return (
        <View style={{ flex: 1, backgroundColor: colors.primary }}>
          <Image
            source={images.splash}
            style={{
              width: '100%',
              height: '100%',
            }}
            resizeMode="contain"
            onLoad={this.cacheAppResourceAsync}
          />
        </View>
      )
    }

    return (
      <React.Fragment>
        <StackNavigator />
      </React.Fragment>
    )
  }
}

export default AppContainer
