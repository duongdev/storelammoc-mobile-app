import * as React from 'react'

import withGrantCamera from 'hocs/grant-camera'
import keepAwake from 'hocs/keep-awake'
import withStatusBar from 'hocs/status-bar'
import { compose } from 'recompose'

import { MaterialIcons } from '@expo/vector-icons'
import { BarCodeReadCallback, BarCodeScanner } from 'expo'
import { Button } from 'native-base'
import { Platform, StyleSheet, View } from 'react-native'
import { NavigationComponent } from 'react-navigation'

import colors from 'constants/colors'

import BarCodeScannerOverlay from './components/BarCodeScannerOverlay'

export interface BarCodeScannerProps {}
interface BarCodeScannerStates {
  lastScanAt: number
  isReady: boolean
}

class BarcodeScannerScreen extends React.Component<
  BarCodeScannerProps & NavigationComponent,
  BarCodeScannerStates
> {
  didFocusSubscription: any
  isAndroid = Platform.OS === 'android'

  state = {
    isReady: !this.isAndroid,
    lastScanAt: 0,
  }

  componentDidMount() {
    this.didFocusSubscription =
      this.isAndroid &&
      this.props.navigation.addListener('didFocus', () => {
        this.setState({
          isReady: true,
        })
      })

    if (typeof this.props.onSetHidden === 'function') {
      this.props.onSetHidden(true)
    }
  }

  componentWillUnmount() {
    if (this.didFocusSubscription) {
      this.didFocusSubscription.remove()
    }
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
      this.handleGoBack()
    }
  }

  handleGoBack = () => {
    this.props.navigation.pop()
  }

  render() {
    return (
      <View style={styles.root}>
        {this.state.isReady ? (
          <BarCodeScanner
            torchMode="on"
            onBarCodeRead={this.handleBarCodeRead}
            style={[StyleSheet.absoluteFill]}
          >
            <BarCodeScannerOverlay />
          </BarCodeScanner>
        ) : (
          <BarCodeScannerOverlay />
        )}

        <Button
          onPress={this.handleGoBack}
          style={styles.goBackButton}
          iconLeft
          transparent
        >
          <MaterialIcons
            name={this.isAndroid ? 'close' : 'arrow-back'}
            size={32}
            color={colors.white}
          />
        </Button>
      </View>
    )
  }
}

export default compose(
  withStatusBar({
    hidden: true,
  }),
  keepAwake,
  withGrantCamera,
)(BarcodeScannerScreen)

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.black,
  },
  goBackButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingRight: 20,
  },
})
