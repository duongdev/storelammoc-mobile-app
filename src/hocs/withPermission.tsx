import get from 'lodash/get'

import { Constants, IntentLauncherAndroid, Linking, Permissions } from 'expo'
import * as React from 'react'
import { Alert, AlertOptions, AlertType, Platform } from 'react-native'

export interface WithPermissionConfig<P> {
  askOnMounted?: boolean
  permission: Permissions.PermissionType
  onGrant?: (props: P) => void
  onDeny?: (props: P) => void
  alert: {
    title: string
    message?: string
    buttonTexts?: {
      skip?: string
      openSettings?: string
    }
    options?: AlertOptions
    type?: AlertType
  }
}

interface WithPermissionState {
  granted: boolean
}

const withPermission = <P extends object>(config: WithPermissionConfig<P>) => (
  WrappedComponent: React.ComponentType<P & { granted?: boolean }>,
) => (props: P) => {
  class WithPermission extends React.Component<P, WithPermissionState> {
    state = {
      granted: false,
    }

    onGrant = () => {
      if (typeof config.onGrant === 'function') config.onGrant(props)
    }
    onDeny =
      typeof config.onDeny === 'function'
        ? () => {
            config.onDeny!(props)
          }
        : () => {}

    componentDidMount = async () => {
      if (config.askOnMounted !== false) this.askForPermission()
      else {
        const { status: currentStatus } = await Permissions.getAsync(
          config.permission,
        )
        this.setState({ granted: currentStatus === 'granted' })
      }
    }

    /**
     * Checks the current status of permission. Displays an alert to ask for
     * permission if is isn't granted.
     */
    askForPermission = async () => {
      // Get current permission status
      const { status: currentStatus } = await Permissions.getAsync(
        config.permission,
      )

      switch (currentStatus) {
        // The permission has been granted before
        case 'granted':
          return this.setState({ granted: true })

        // The permission has not been granted nor denied before
        case 'undetermined':
          // Display an alert, ask for permission
          const { status } = await Permissions.askAsync(config.permission)

          if (status === 'granted') {
            return this.setState(
              {
                granted: true,
              },
              () => {
                this.onGrant()
              },
            )
          }

          // When status === 'denied'
          return this.onDeny()

        // User has denied permission before, we should ask him to enable on Settings
        default:
          return Alert.alert(
            config.alert.title,
            config.alert.message,
            [
              {
                text: get(config, 'alert.buttonTexts.skip', 'Để sau'),
                style: 'cancel',
                onPress: () => this.onDeny(),
              },
              {
                text: get(
                  config,
                  'alert.buttonTexts.openSettings',
                  'Mở cài đặt',
                ),
                onPress: openSettings,
              },
            ],
            {
              cancelable: false,
            },
          )
      }
    }
    render() {
      const _props = {
        ...(props as any),
        [`${config.permission}Granted`]: this.state.granted,
        [`${config.permission}AskPermission`]: this.askForPermission,
      }
      return <WrappedComponent {..._props} />
    }
  }

  return <WithPermission {...props} />
}

/** Opens device app settings */
const openSettings = async () => {
  try {
    if (Platform.OS === 'android') {
      await IntentLauncherAndroid.startActivityAsync(
        IntentLauncherAndroid.ACTION_APPLICATION_DETAILS_SETTINGS,
        {
          'android.provider.extra.APP_PACKAGE': get(
            Constants,
            'manifest.android.package',
            '',
          ),
        },
      ).catch(err => {
        return IntentLauncherAndroid.startActivityAsync(
          IntentLauncherAndroid.ACTION_APPLICATION_SETTINGS,
        )
      })
    } else {
      const bundleIdentifier = get(
        Constants,
        'manifest.ios.bundleIdentifier',
        '',
      )
      await Linking.openURL(`app-settings://camera/${bundleIdentifier}`)
    }
  } catch (err) {
    console.warn(err)
  }
}

export default withPermission
