import {
  createStackNavigator,
  NavigationTransitionProps,
} from 'react-navigation'

import { Animated, Easing } from 'react-native'

import { screenWidth } from 'constants/metrics'
import BarCodeScannerScreen from 'screens/BarCodeScannerScreen'
import MainScreen from 'screens/MainScreen'
import SearchBox from 'screens/SearchBox'

import navigationTransitions from 'helpers/navigation/transitions'

const StackNavigator = createStackNavigator(
  {
    Main: MainScreen,
    BarCodeScanner: {
      screen: BarCodeScannerScreen,
    },
    SearchBox: {
      screen: SearchBox,
    },
  },
  {
    initialRouteName: 'Main',
    headerMode: 'none',
    transitionConfig: () => {
      return {
        transitionSpec: {
          duration: 300,
          easing: Easing.out(Easing.cubic),
          timing: Animated.timing,
          useNativeDriver: true,
        },
        screenInterpolator: (transitionProps: NavigationTransitionProps) => {
          return navigationTransitions.fadeInLeft(transitionProps)
        },
      }
    },
    navigationOptions: {
      gesturesEnabled: true,
      gestureResponseDistance: {
        horizontal: screenWidth,
      },
    },
  },
)

export default StackNavigator
