import * as React from 'react'
import { StatusBar } from 'react-native'

import * as Expo from 'expo'
import { AppLoading, Asset, Updates } from 'expo'

import StackNavigator from 'navigations/StackNavigator'

import { TopToast } from 'components/TopToast'

import images from 'assets/images'

interface Props {}

const NEW_UPDATE_TEXT = 'Có bản cập nhật mới, ứng dụng sẽ được mở lại'

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
        <React.Fragment>
          <AppLoading
            startAsync={this.cacheResourceAsync}
            onFinish={this.handleAppLoadingFinish}
            onError={this.handleAppLoadingError}
          />

          <TopToast
            isVisible={this.state.hasNewUpdate}
            message={NEW_UPDATE_TEXT}
          />
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <StackNavigator />
        <TopToast
          isVisible={this.state.hasNewUpdate}
          message={NEW_UPDATE_TEXT}
        />
      </React.Fragment>
    )
  }
}

export default AppContainer
