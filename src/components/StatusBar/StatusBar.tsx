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
        backgroundColor={colors.transparent}
        translucent
        barStyle="light-content"
        hidden={hidden}
        animated
        {...props}
      />
      {!hidden && <View style={styles.topSpacing} />}
    </View>
  )
}

const styles = StyleSheet.create({
  topSpacing: {
    height: Constants.statusBarHeight,
    backgroundColor: colors.primary,
  },
})
