import { createStackNavigator } from 'react-navigation'

import BarCodeScannerScreen from 'screens/BarCodeScannerScreen'
import MainScreen from 'screens/MainScreen'

import { screenWidth } from 'constants/metrics'

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
    navigationOptions: {
      gesturesEnabled: true,
      gestureResponseDistance: {
        horizontal: screenWidth,
      },
    },
  },
)

export default StackNavigator
