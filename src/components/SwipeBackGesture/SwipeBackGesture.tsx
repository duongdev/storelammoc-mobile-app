import React, { Component } from 'react'

import { Constants, Svg } from 'expo'
import { Animated, Easing, PanResponder, StyleSheet, View } from 'react-native'

import colors from 'constants/colors'
import { screenHeight } from 'constants/metrics'

interface Props {
  maxWidth?: number
  maxHeight?: number
  onRelease: Function
  isMainScreen: boolean
}

interface State {
  gantY: number
  top: number
  pathWidth: number
  pathHeight: number
  pathOpacity: Animated.Value
  moveY: number
  distanceX: number
  velocityX: number
}

const MAXHEIGHT = 130
const MAXWIDTH = 30

const INIT_TOP = -MAXHEIGHT - Constants.statusBarHeight
const SWIPE_BACK_HEIGHT = screenHeight / 3
const SWIPE_BACK_WIDTH = 30
const DRAWER_WIDTH = 20

export default class SwipeBackGesture extends Component<Props, State> {
  state = {
    gantY: INIT_TOP,
    top: INIT_TOP,
    pathWidth: 0,
    pathHeight: MAXHEIGHT,
    pathOpacity: new Animated.Value(0),
    moveY: 0,
    distanceX: 0,
    velocityX: 0,
  }

  initTop = INIT_TOP
  maxWidth = MAXWIDTH
  maxHeight = MAXHEIGHT

  componentDidMount() {
    const { maxHeight, maxWidth } = this.props
    if (maxHeight) {
      this.maxHeight = maxHeight
      this.initTop = -maxHeight - Constants.statusBarHeight
    }

    if (maxWidth) {
      this.maxWidth = maxWidth
    }

    this.state.pathOpacity.addListener(opacityAnim => {
      const opacity = opacityAnim.value

      this.path.setNativeProps({
        opacity,
      })
    })
  }

  panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      if (this.props.isMainScreen) {
        return false
      }

      if (
        evt.nativeEvent.pageX < SWIPE_BACK_WIDTH &&
        evt.nativeEvent.pageY > SWIPE_BACK_HEIGHT
      ) {
        return true
      }

      return false
    },
    // onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,

    onPanResponderGrant: (evt, gestureState) => {
      // The gesture has started. Show visual feedback so the user knows
      // what is happening!

      // gestureState.d{x,y} will be set to zero now
      const positionY = gestureState.y0
      const numberActiveTouches = gestureState.numberActiveTouches

      if (numberActiveTouches > 1) {
        return
      }

      this.setState({
        gantY: positionY,
        top: positionY - this.maxHeight / 2,
      })
    },
    onPanResponderMove: (evt, gestureState) => {
      // The most recent move distance is gestureState.move{X,Y}
      // The accumulated gesture distance since becoming responder is
      // gestureState.d{x,y}

      const moveY = gestureState.moveY
      const distanceX = gestureState.dx
      const velocityX = gestureState.vx

      let width = distanceX
      let height = this.maxHeight
      let top = this.state.top

      if (distanceX > this.maxWidth) {
        width = this.maxWidth // it can be not zoom in more than max widht (40pt)
        height = this.maxHeight * 1.1 // if it cannot zoom more, increase the height by 10%
        top = this.state.gantY - (this.maxHeight * 1.1) / 2 // if the height was be increase by 10%, change the top to be center point
      } else {
        width = distanceX
        height = this.maxHeight
        top = this.state.gantY - this.maxHeight / 2
      }

      Animated.timing(this.state.pathOpacity, {
        toValue: width / this.maxWidth,
        duration: 300 * velocityX,
        easing: Easing.bezier(0.075, 0.82, 0.165, 1),
      }).start()

      this.setState({
        pathHeight: height,
        pathWidth: width,
        top,
        moveY,
        distanceX,
        velocityX,
      })
    },
    onPanResponderTerminationRequest: (evt, gestureState) => false,
    onPanResponderRelease: (evt, gestureState) => {
      // The user has released all touches while this view is the
      // responder. This typically means a gesture has succeeded
      const distanceX = gestureState.dx
      const velocityX = gestureState.vx

      Animated.timing(this.state.pathOpacity, {
        toValue: 0,
        duration: 300 * velocityX,
        easing: Easing.bezier(0.075, 0.82, 0.165, 1),
      }).start()

      this.setState(
        {
          pathHeight: this.maxHeight,
          pathWidth: 0,
          top: this.initTop,
        },
        () => {
          if (typeof this.props.onRelease === 'function') {
            if (distanceX < this.maxWidth) {
              return
            }

            return this.props.onRelease()
          }
        },
      )
    },
    onPanResponderTerminate: (evt, gestureState) => {
      // Another component has become the responder, so this gesture
      // should be cancelled
      return false
    },
    onShouldBlockNativeResponder: () => true,
    onPanResponderReject: e => {
      return true
    },
  })

  path: any

  render() {
    const { top, pathWidth, pathHeight } = this.state
    const haftHeight = Math.round(pathHeight / 2)

    return (
      <View style={styles.container} {...this.panResponder.panHandlers}>
        {this.props.children}
        <View style={[styles.svgContainer, { top }]}>
          <Svg width={this.maxWidth} height={this.maxHeight * 1.1}>
            <Svg.Path
              ref={inst => (this.path = inst)}
              d={`
                M0,0
                C${pathWidth},${haftHeight} ${pathWidth},${haftHeight} 0,${pathHeight}
                Z
              `}
              fill={colors.black}
            />
          </Svg>
        </View>

        <View
          style={[
            styles.drawerNav,
            {
              width: this.props.isMainScreen ? 0 : DRAWER_WIDTH,
            },
          ]}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerNav: {
    position: 'absolute',
    top: SWIPE_BACK_HEIGHT,
    left: 0,
    bottom: 0,
  },
})
