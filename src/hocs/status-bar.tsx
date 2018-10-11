import * as React from 'react'

import StatusBar from 'components/StatusBar'
import { StatusBarProps } from 'react-native'

interface WrappedComponentProps {}

const withStatusBar = (statusBarProps: Partial<StatusBarProps> = {}) => <
  P extends object
>(
  WrappedComponent: React.ComponentType<P & WrappedComponentProps>,
) => (props: P) => {
  return (
    <React.Fragment>
      <StatusBar animated showHideTransition="slide" {...statusBarProps} />

      <WrappedComponent {...props} />
    </React.Fragment>
  )
}

export default withStatusBar
