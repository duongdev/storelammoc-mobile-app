import * as React from 'react'

import { Constants } from 'expo'
import {
  StatusBar as RNStatusBar,
  StatusBarProps as RNStatusBarProps,
  StyleSheet,
  View,
} from 'react-native'

import colors from 'constants/colors'

export interface StatusBarProps extends RNStatusBarProps {}

export function StatusBar({ hidden, ...props }: StatusBarProps) {
  return (
    <View>
      <RNStatusBar
        showHideTransition="slide"
        backgroundColor={colors.primary}
        barStyle="light-content"
        hidden={hidden}
        {...props}
      />
      <View style={styles.iosSpacing} />
    </View>
  )
}

const styles = StyleSheet.create({
  iosSpacing: {
    height: Constants.statusBarHeight,
    backgroundColor: colors.primary,
  },
})
