import * as React from 'react'

import { StatusBar } from 'react-native'

export interface StatusBarProps {
  hidden: boolean
}

interface WrappedComponentProps {
  onSetHidden: (hidden: boolean) => void
}

/**
 * Set status bar when `WrappedComponent` being mounted
 * @param WrappedComponent
 * @example StatusBar(SomeComponent)
 */
const withStatusBar = <P extends object>(
  WrappedComponent: React.ComponentType<P & WrappedComponentProps>,
) => {
  return class extends React.Component {
    state = {
      hidden: false,
    }

    handleSetHidden = (hidden: boolean) => {
      this.setState({
        hidden,
      })
    }

    render() {
      return (
        <React.Fragment>
          <StatusBar
            hidden={this.state.hidden}
            animated
            showHideTransition="slide"
          />

          <WrappedComponent
            {...this.props}
            onSetHidden={this.handleSetHidden}
          />
        </React.Fragment>
      )
    }
  }
}

export default withStatusBar
