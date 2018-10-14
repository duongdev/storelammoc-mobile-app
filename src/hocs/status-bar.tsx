import * as React from 'react'

import { Constants } from 'expo'
import { StatusBarProps, StyleSheet, View } from 'react-native'

import StatusBar from 'components/StatusBar'

import colors from 'constants/colors'

interface WrappedComponentProps {}

const withStatusBar = (statusBarProps: Partial<StatusBarProps> = {}) => <
  P extends object
>(
  WrappedComponent: React.ComponentType<P & WrappedComponentProps>,
) => (props: P) => {
  return (
    <React.Fragment>
      <StatusBar animated showHideTransition="slide" {...statusBarProps} />
      {!statusBarProps.hidden && <View style={styles.topSpacing} />}

      <WrappedComponent {...props} />
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  topSpacing: {
    height: Constants.statusBarHeight,
    backgroundColor: colors.primary,
  },
})

export default withStatusBar
