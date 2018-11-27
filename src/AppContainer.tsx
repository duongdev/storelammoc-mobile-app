import * as React from 'react'
import { StatusBar } from 'react-native'

import { Asset, Font, Updates } from 'expo'

import StackNavigator from 'navigations/StackNavigator'

import images from 'assets/images'

interface Props {}

class AppContainer extends React.Component<Props> {
  state = {
    hasNewUpdate: false,
  }

  handleUpdateListener = (event: Updates.UpdateEvent) => {
    if (event.type === Updates.EventType.DOWNLOAD_FINISHED) {
      Updates.reload()
    } else if (event.type === Updates.EventType.ERROR) {
      Updates.reloadFromCache()
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    })
  }

  async componentDidMount() {
    StatusBar.setBarStyle('light-content')
    this.cacheResourceAsync()
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

  cacheResourceAsync = () => {
    const resources = Object.values(images)
    return Promise.all(
      resources.map(res => Asset.fromModule(res).downloadAsync()),
    )
  }

  render() {
    return <StackNavigator />
  }
}

export default AppContainer
