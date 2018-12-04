import * as React from 'react'

import {
  StatusBar as RNStatusBar,
  StatusBarProps as RNStatusBarProps,
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
    </View>
  )
}
