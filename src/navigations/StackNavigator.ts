import * as ReactNavigation from 'react-navigation'

import {
  createStackNavigator,
  NavigationTransitionProps,
} from 'react-navigation'

import { Animated, Easing } from 'react-native'

import BarCodeScannerScreen from 'screens/BarCodeScannerScreen'
import MainScreen from 'screens/MainScreen'
import SearchScreen from 'screens/SearchScreen'

import navigationTransitions from 'helpers/navigation/transitions'

import global from 'constants/global'
import { screenWidth } from 'constants/metrics'

// FIXME: Fix import when @types/react-navigation updated with new APIs.
const createAppContainer = (ReactNavigation as any).createAppContainer

const navigationOptions: ReactNavigation.NavigationScreenOptions = {
  gesturesEnabled: true,
  gestureResponseDistance: {
    horizontal: screenWidth,
  },
}

const StackNavigator = createStackNavigator(
  {
    Main: MainScreen,
    BarCodeScanner: {
      screen: BarCodeScannerScreen,
      navigationOptions,
    },
    SearchScreen: {
      screen: SearchScreen,
      navigationOptions,
    },
  },
  {
    initialRouteName: 'Main',
    headerMode: 'none',
    transitionConfig: () => {
      return {
        transitionSpec: {
          duration: global.NAV_TRANSITION_DURATION,
          easing: Easing.out(Easing.cubic),
          timing: Animated.timing,
          useNativeDriver: true,
        },
        screenInterpolator: (transitionProps: NavigationTransitionProps) => {
          return navigationTransitions.fadeInLeft(transitionProps)
        },
      }
    },
  },
)

export default createAppContainer(StackNavigator)
