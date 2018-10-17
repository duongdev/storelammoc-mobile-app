import * as React from 'react'

import { Constants, IntentLauncherAndroid, Linking, Permissions } from 'expo'
import { Alert, PermissionsAndroid, Platform } from 'react-native'
import { NavigationComponent } from 'react-navigation'

interface Props {}

class CameraPermission extends React.Component<Props & NavigationComponent> {
  isAndroid = Platform.OS === 'android'

  async componentDidMount() {
    await this.grantCameraPermission()
  }

  openAppSetting = async () => {
    try {
      if (this.isAndroid) {
        await IntentLauncherAndroid.startActivityAsync(
          IntentLauncherAndroid.ACTION_APPLICATION_DETAILS_SETTINGS,
        ).catch(() => {
          return IntentLauncherAndroid.startActivityAsync(
            IntentLauncherAndroid.ACTION_APPLICATION_SETTINGS,
          )
        })
      } else {
        const bundleIdentifier =
          Constants.manifest.ios && Constants.manifest.ios.bundleIdentifier
        await Linking.openURL(`app-settings://camera/${bundleIdentifier}`)
      }
    } catch (err) {
      console.warn(err)
    }
  }

  grantCameraPermission = async () => {
    try {
      const { status: currentStatus } = await Permissions.getAsync(
        Permissions.CAMERA,
      )

      if (currentStatus === 'granted') {
        return
      }

      if (currentStatus === 'denied') {
        return Alert.alert(
          'Cho phép sử dụng camera',
          this.isAndroid
            ? 'Để sử dụng tính năng quét mã QR, hãy vào Cài đặt -> Ứng dụng -> Store Làm Mộc -> Quyền và chọn kích hoạt cho phép sử dụng camera.'
            : 'Để sử dụng tính năng quét mã QR, hãy vào Cài đặt -> Quyền riêng tư và chọn kích hoạt cho phép sử dụng camera.',
          [
            {
              text: 'Để sau',
              style: 'cancel',
              onPress: this.handleGoBack,
            },
            {
              text: 'Mở cài đặt',
              onPress: this.openAppSetting,
            },
          ],
        )
      }

      if (this.isAndroid) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Cho phép Store Làm Mộc sử dụng máy ảnh',
            message: 'Store Làm Mộc sử dụng máy ảnh để quét mã QR',
          },
        )

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          this.handleGoBack()
        }
      } else {
        const { status } = await Permissions.askAsync(Permissions.CAMERA)

        if (status !== 'granted') {
          this.handleGoBack()
        }
      }
    } catch (err) {
      console.warn(err)
    }
  }

  handleGoBack = () => {
    this.props.navigation.pop()
  }

  render() {
    return <React.Fragment>{this.props.children}</React.Fragment>
  }
}

const withGrantCamera = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
): React.SFC<P> => (props: P) => (
  <CameraPermission>
    <WrappedComponent {...props} />
  </CameraPermission>
)

export default withGrantCamera
