import * as React from 'react'

import keepAwake from 'hocs/keep-awake'
import withStatusBar from 'hocs/status-bar'
import { compose } from 'recompose'

import { MaterialIcons } from '@expo/vector-icons'
import { BarCodeReadCallback, BarCodeScanner, Permissions } from 'expo'
import { Button } from 'native-base'
import { Platform, StyleSheet, View } from 'react-native'
import { NavigationComponent } from 'react-navigation'

import colors from 'constants/colors'

import BarCodeScannerOverlay from './components/BarCodeScannerOverlay'

export interface BarCodeScannerProps {}
interface BarCodeScannerStates {
  lastScanAt: number
  hasCameraPermission: boolean
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
    hasCameraPermission: false,
  }

  async componentDidMount() {
    this.grantCameraPermission()
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
