import * as React from 'react'
import {
  Platform,
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
      {Platform.OS === 'ios' && !hidden && <View style={styles.iosSpacing} />}
    </View>
  )
}

const styles = StyleSheet.create({
  iosSpacing: {
    height: 20,
    backgroundColor: colors.primary,
  },
})
