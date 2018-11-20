import React, { PureComponent } from 'react'

import { NetInfo } from 'react-native'

import colors from 'constants/colors'

import TopToast from './TopToast'

class OfflineNotice extends PureComponent {
  state = {
    isConnected: true,
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectivityChange,
    )
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleConnectivityChange,
    )
  }

  handleConnectivityChange = (isConnected: boolean) => {
    if (isConnected) {
      this.setState({ isConnected })
    } else {
      this.setState({ isConnected })
    }
  }

  render() {
    return (
      <TopToast
        isVisible={!this.state.isConnected}
        message={
          this.state.isConnected
            ? 'Kết nối với máy chủ thành công'
            : 'Không thể kết nối với máy chủ'
        }
        backgroundColor={
          this.state.isConnected ? colors.green : colors.secondary
        }
        icon={{
          name: this.state.isConnected ? 'ios-checkmark' : 'ios-warning',
          color: this.state.isConnected ? colors.white : colors.yellow,
        }}
      />
    )
  }
}

export default OfflineNotice
