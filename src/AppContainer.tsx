import * as React from 'react'
import { Image, StatusBar, View } from 'react-native'

import * as Expo from 'expo'
import { AppLoading, Asset, Updates } from 'expo'

import StackNavigator from 'navigations/StackNavigator'

import { TopToast } from 'components/TopToast'

import colors from 'constants/colors'

import images from 'assets/images'

interface Props {}

class AppContainer extends React.Component<Props> {
  state = {
    isReady: false,
    isSplashReady: false,
    isSplashError: false,
    hasNewUpdate: false,
  }

  handleUpdateListener = (event: Updates.UpdateEvent) => {
    if (event.type === Updates.EventType.DOWNLOAD_FINISHED) {
      Updates.reload()
    } else if (event.type === Updates.EventType.ERROR) {
      Updates.reloadFromCache()
    }
  }

  async componentDidMount() {
    StatusBar.setBarStyle('light-content')

    try {
      const update = await Updates.checkForUpdateAsync()

      setTimeout(() => {
        this.setState({
          hasNewUpdate: update.isAvailable,
        })
      }, 100)

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync()
      }
    } catch (e) {
      // ignore
    }

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
    // FIXME: Update this when @types/expo exports SplashScreen
    ;(Expo as any).SplashScreen.hide()

    this.setState({
      isReady: true,
    })
  }

  render() {
    if (!this.state.isSplashReady) {
      return (
        <React.Fragment>
          <AppLoading
            startAsync={this.cacheSplashResourceAsync}
            onFinish={this.handleAppLoadingFinish}
            onError={this.handleAppLoadingError}
          />

          <TopToast
            isVisible={this.state.hasNewUpdate}
            message="Có bản cập nhật mới, ứng dụng sẽ được mở lại"
          />
        </React.Fragment>
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
          <TopToast
            isVisible={this.state.hasNewUpdate}
            message="Có bản cập nhật mới, ứng dụng sẽ được mở lại"
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
