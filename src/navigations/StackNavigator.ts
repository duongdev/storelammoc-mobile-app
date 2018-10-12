import { createStackNavigator } from 'react-navigation'

import { screenWidth } from 'constants/metrics'
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
    navigationOptions: {
      gesturesEnabled: true,
      gestureResponseDistance: {
        horizontal: screenWidth,
      },
    },
  },
)

export default StackNavigator
