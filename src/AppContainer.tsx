import * as React from 'react'
import { StatusBar } from 'react-native'

import { Asset, Font, Updates } from 'expo'
import {
  DefaultTheme,
  Provider as PaperProvider,
  Theme,
} from 'react-native-paper'

import StackNavigator from 'navigations/StackNavigator'

import { askNotificationPermission } from 'services/notification-services'

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

    await askNotificationPermission()

    if (__DEV__) return

    this.cacheResourceAsync()

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
      throw e
    }
  }

  cacheResourceAsync = () => {
    const resources = Object.values(images)
    return Promise.all(
      resources.map(res => Asset.fromModule(res).downloadAsync()),
    )
  }

  render() {
    return (
      <PaperProvider theme={theme}>
        <StackNavigator />
      </PaperProvider>
    )
  }
}

const theme: Theme = {
  ...DefaultTheme,
}

export default AppContainer
