import StatusBar from 'components/StatusBar'
import * as React from 'react'

import keepAwake, { KeepAwakeProps } from 'hocs/keep-awake'

import { BarCodeReadCallback, BarCodeScanner, Permissions } from 'expo'
import { StyleSheet, View } from 'react-native'
import { NavigationComponent } from 'react-navigation'

import BarCodeScannerOverlay from './components/BarCodeScannerOverlay'

export interface BarCodeScannerProps {}
interface BarCodeScannerStates {
  lastScanAt: number
  hasCameraPermission: boolean
}

class BarcodeScannerScreen extends React.Component<
  BarCodeScannerProps & NavigationComponent & KeepAwakeProps,
  BarCodeScannerStates
> {
  state = {
    lastScanAt: 0,
    hasCameraPermission: false,
  }

  async componentWillMount() {
    this.grantCameraPermission()
  }

  grantCameraPermission = async () => {
    const { status: currentStatus } = await Permissions.getAsync(
      Permissions.CAMERA,
    )

    if (currentStatus === 'granted')
      return this.setState({ hasCameraPermission: currentStatus === 'granted' })

    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({ hasCameraPermission: status === 'granted' })
  }

  handleBarCodeRead: BarCodeReadCallback = params => {
    const { lastScanAt } = this.state
    const now = Date.now()

    const onBarCodeRead = this.props.navigation.getParam(
      'onBarCodeRead',
      () => {},
    )

    // Wait 2s before next scan
    if (now - lastScanAt > 2000) {
      this.setState({ lastScanAt: Date.now() })
      onBarCodeRead(params)
      this.props.navigation.pop()
    }
  }

  public render() {
    return (
      <View style={styles.root}>
        <StatusBar hidden />
        <BarCodeScanner
          onBarCodeRead={this.handleBarCodeRead}
          style={[StyleSheet.absoluteFill]}
        >
          {/* {this.renderScannerOverlay()}
          {this.renderTopMenu()} */}
          <BarCodeScannerOverlay />
        </BarCodeScanner>
      </View>
    )
  }
}
export default keepAwake(BarcodeScannerScreen)

const styles = {
  root: {
    flex: 1,
  },
}
