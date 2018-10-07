import StatusBar from 'components/StatusBar'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'

import { BarCodeReadCallback, BarCodeScanner, Permissions } from 'expo'
import { NavigationComponent } from 'react-navigation'

export interface BarCodeScannerProps {}
interface BarCodeScannerStates {
  lastScanAt: number
  hasCameraPermission: boolean
}

export default class BarcodeScannerScreen extends React.Component<
  BarCodeScannerProps & NavigationComponent,
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
      <View style={styles.barCodeScanner}>
        <StatusBar hidden />
        <BarCodeScanner
          onBarCodeRead={this.handleBarCodeRead}
          style={[StyleSheet.absoluteFill]}
        >
          {/* {this.renderScannerOverlay()}
          {this.renderTopMenu()} */}
        </BarCodeScanner>
      </View>
    )
  }
}

const styles = {
  barCodeScanner: {
    flex: 1,
  },
}
