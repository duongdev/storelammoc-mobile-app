import * as React from 'react'
import { StatusBar } from 'react-native'

import * as Expo from 'expo'
import { AppLoading, Asset, Updates } from 'expo'

import StackNavigator from 'navigations/StackNavigator'

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
    if (!__DEV__) {
      Updates.addListener(this.handleUpdateListener)

      try {
        const update = await Updates.checkForUpdateAsync()

        if (update.isAvailable) {
          this.setState({
            hasNewUpdate: true,
          })

          await Updates.fetchUpdateAsync()
        }
      } catch (e) {
        // ignore
        throw e
      }
    }
  }

  cacheResourceAsync = async () => {
    const resources = Object.values(images)
    Promise.all(resources.map(res => Asset.fromModule(res).downloadAsync()))
    return
  }

  handleAppLoadingFinish = () => {
    this.setState({
      isSplashReady: true,
    })
  }

  handleAppLoadingError = () => {
    this.setState({
      isSplashReady: true,
      isSplashError: true,
    })

    throw new Error('App loading failure')
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
        <AppLoading
          startAsync={this.cacheResourceAsync}
          onFinish={this.handleAppLoadingFinish}
          onError={this.handleAppLoadingError}
        />
      )
    }

    return <StackNavigator />
  }
}

export default AppContainer
