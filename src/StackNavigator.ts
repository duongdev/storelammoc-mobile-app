import { createStackNavigator } from 'react-navigation'

import BarCodeScannerScreen from 'screens/BarCodeScannerScreen'
import MainScreen from 'screens/MainScreen'

export default createStackNavigator(
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
