import keepAwake from 'hocs/keep-awake'
import { branch } from 'recompose'

import BarCodeScannerScreen from 'screens/BarCodeScannerScreen'
import MainScreen from 'screens/MainScreen'
import { createStackNavigator } from 'react-navigation'

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

export default StackNavigator
