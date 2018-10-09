import keepAwake from 'hocs/keep-awake'
import { branch } from 'recompose'

import { createStackNavigator } from 'react-navigation'

import BarCodeScannerScreen from 'screens/BarCodeScannerScreen'
import MainScreen from 'screens/MainScreen'

const StackNavigator = createStackNavigator(
  {
    Main: MainScreen,
    BarCodeScanner: {
      screen: BarCodeScannerScreen,
    },
  },
  {
    initialRouteName: 'Main',
    headerMode: 'none',
  },
)

export default branch(() => __DEV__, keepAwake as any)(StackNavigator)
