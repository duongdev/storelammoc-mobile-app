import React, { PureComponent } from 'react'

import { Constants } from 'expo'
import { Animated, StyleSheet, Text, View } from 'react-native'

import colors from 'constants/colors'

interface Props {
  isVisible: boolean
  message: string
  top: number
  backgroundColor: string
  toastTextColor: string
}

class TopToast extends PureComponent<Props> {
  static defaultProps = {
    top: 0,
    backgroundColor: colors.green,
    toastTextColor: colors.white,
    isVisible: false,
  }

  state = {
    opacityValue: new Animated.Value(0),
    translateYValue: new Animated.Value(0),
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.isVisible && !this.props.isVisible) {
      this.show()
    } else {
      this.hide()
    }
  }

  show() {
    Animated.parallel([
      Animated.timing(this.state.opacityValue, {
        toValue: 1,
      }),
      Animated.timing(this.state.translateYValue, {
        toValue: Constants.statusBarHeight,
      }),
    ]).start()
  }

  hide() {
    Animated.parallel([
      Animated.timing(this.state.opacityValue, {
        toValue: 0,
      }),
      Animated.timing(this.state.translateYValue, {
        toValue: 0,
      }),
    ]).start()
  }

  render() {
    return (
      <Animated.View
        style={[
          styles.container,
          {
            top: this.props.top,
            backgroundColor: this.props.backgroundColor,
            opacity: this.state.opacityValue,
            transform: [{ translateY: this.state.translateYValue }],
          },
        ]}
      >
        <Text style={[styles.toastText, { color: this.props.toastTextColor }]}>
          {this.props.message}
        </Text>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    left: 0,
    right: 0,
    position: 'absolute',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  toastText: { color: colors.white },
})

export default TopToast
