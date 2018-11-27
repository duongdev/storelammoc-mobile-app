import * as React from 'react'
import { NavigationComponent } from 'react-navigation'

export interface WithNavigatorFocused {
  navigatorFocused: boolean
}

const withNavigatorFocused = <P extends object>(
  WrappedComponent: React.ComponentType<P & { navigatorFocused: boolean }>,
) => (props: P) => {
  class WithNavigatorFocused extends React.PureComponent<
    P & NavigationComponent
  > {
    state = {
      focused: false,
    }
    componentDidMount = () => {
      this.didFocusSubscription = this.props.navigation.addListener(
        'didFocus',
        this.handleFocus,
      )
    }

    handleFocus = () => this.setState({ focused: true })

    componentWillUnmount = () => {
      this.didFocusSubscription.remove()
    }

    didFocusSubscription: any
    render() {
      return (
        <WrappedComponent {...props} navigatorFocused={this.state.focused} />
      )
    }
  }

  return <WithNavigatorFocused {...props} />
}

export default withNavigatorFocused
