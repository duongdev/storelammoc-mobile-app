import React, { PureComponent } from 'react'

import { Constants } from 'expo'
import { Animated, StyleSheet, Text, View } from 'react-native'

import { Ionicons } from '@expo/vector-icons'
import colors from 'constants/colors'

interface Props {
  isVisible: boolean
  message: string
  top: number
  icon?: { name: string; size?: number; color: string }
  backgroundColor: string
  toastTextColor: string
}

const DEFAULT_HEIGHT = 30
const DEFAULT_TOP = -DEFAULT_HEIGHT

class TopToast extends PureComponent<Props> {
  static defaultProps = {
    top: DEFAULT_TOP,
    backgroundColor: colors.green,
    toastTextColor: colors.white,
    isVisible: false,
  }

  state = {
    opacityValue: new Animated.Value(0),
    translateYValue: new Animated.Value(DEFAULT_TOP),
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
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(this.state.opacityValue, {
          toValue: 0,
        }),
        Animated.timing(this.state.translateYValue, {
          toValue: DEFAULT_TOP,
        }),
      ]).start()
    }, 1000)
  }

  render() {
    const { icon } = this.props

    const hasIcon = icon && icon.name ? true : false

    return (
      <React.Fragment>
        <Animated.View
          style={[
            styles.statusBar,
            {
              backgroundColor: this.props.backgroundColor,
              opacity: this.state.opacityValue,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.container,
            {
              top: this.props.top,
              backgroundColor: this.props.backgroundColor,
              transform: [{ translateY: this.state.translateYValue }],
            },
          ]}
        >
          {hasIcon &&
            icon && (
              <View style={styles.iconContainer}>
                <Ionicons
                  name={icon.name}
                  size={icon.size}
                  color={icon.color}
                />
              </View>
            )}
          <Text
            style={[styles.toastText, { color: this.props.toastTextColor }]}
          >
            {this.props.message}
          </Text>
        </Animated.View>
      </React.Fragment>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: DEFAULT_HEIGHT,
    left: 0,
    right: 0,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 100,
    zIndex: 100,
  },
  statusBar: {
    position: 'absolute',
    top: -Constants.statusBarHeight,
    left: 0,
    right: 0,
    height: Constants.statusBarHeight,
    elevation: 101,
    zIndex: 101,
  },
  iconContainer: {
    padding: 5,
  },
  toastText: { color: colors.white },
})

export default TopToast
