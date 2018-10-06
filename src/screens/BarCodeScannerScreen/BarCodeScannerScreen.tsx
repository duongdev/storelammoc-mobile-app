import StatusBar from 'components/StatusBar'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'

import { BarCodeReadCallback, BarCodeScanner } from 'expo'
import { NavigationComponent } from 'react-navigation'

export interface BarCodeScannerProps {
  onBarCodeRead: BarCodeReadCallback
}
interface BarCodeScannerStates {
  lastScanAt: number
}

export default class BarcodeScannerScreen extends React.Component<
  BarCodeScannerProps & NavigationComponent,
  BarCodeScannerStates
> {
  state = {
    lastScanAt: 0,
  }

  handleBarCodeRead: BarCodeReadCallback = params => {
    const { lastScanAt } = this.state
    const now = Date.now()

    const onBarCodeRead = this.props.navigation.getParam(
      'onBarCodeRead',
      () => {},
    )

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
