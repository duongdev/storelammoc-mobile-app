// import navigationTransitions from 'helpers/navigation/transitions'
// import { Animated, Easing, Platform } from 'react-native'
import {
  createStackNavigator,
  // NavigationTransitionProps,
} from 'react-navigation'
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
    // transitionConfig: () => {
    //   return {
    //     transitionSpec: {
    //       duration: 400,
    //       easing: Easing.bezier(0.19, 1, 0.22, 1),
    //       timing: Animated.timing,
    //       useNativeDriver: true,
    //     },
    //     screenInterpolator: (transitionProps: NavigationTransitionProps) => {
    //       const { scene } = transitionProps
    //       const routeName = scene.route.routeName
    //       const isAndroid = Platform.OS === 'android'

    //       if (routeName === 'BarCodeScanner' && isAndroid) {
    //         return navigationTransitions.fadeInTop(transitionProps)
    //       }

    //       return navigationTransitions.fadeInLeft(transitionProps)
    //     },
    //   }
    // },
  },
)
