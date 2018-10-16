import React, { Component } from 'react'

import colors from 'constants/colors'
import { screenWidth } from 'constants/metrics'
import { Constants, Svg } from 'expo'
import { Animated, Easing, PanResponder, StyleSheet, View } from 'react-native'

interface Props {
  maxWidth?: number
  maxHeight?: number
  onRelease: Function
}

interface State {
  gantY: number
  top: number
  width: number
  height: number
  moveY: number
  distanceX: number
  velocityX: number
}

const MAXHEIGHT = 150
const MAXWIDTH = 40

const INIT_TOP = -MAXHEIGHT - Constants.statusBarHeight

export default class SwipeBackGesture extends Component<Props, State> {
  state = {
    gantY: INIT_TOP,
    top: INIT_TOP,
    width: 1,
    pathWidth: new Animated.Value(0),
    height: MAXHEIGHT,
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
  }

  panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      if (evt.nativeEvent.pageX < 200) {
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

      Animated.timing(this.state.pathWidth, {
        toValue: width,
        duration: 1000 * velocityX,
        easing: Easing.bezier(0.075, 0.82, 0.165, 1),
      })

      this.setState({
        height,
        top,
        width,
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

      Animated.timing(this.state.pathWidth, {
        toValue: 0,
        duration: 1000 * velocityX,
        easing: Easing.bezier(0.075, 0.82, 0.165, 1),
      })

      this.setState(
        {
          top: this.initTop,
          height: this.maxHeight,
          width: 1,
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
      console.log(gestureState)
    },
    onShouldBlockNativeResponder: () => false,
    onPanResponderReject: e => {
      console.log(e)
    },
  })

  path: any

  render() {
    const { top, width, height, pathWidth } = this.state
    const haftHeight = Math.round(height / 2)

    return (
      <View style={styles.container} {...this.panResponder.panHandlers}>
        {this.props.children}
        <View style={[styles.svgContainer, { top }]}>
          <Svg width={this.maxWidth} height={height || this.maxHeight}>
            <Svg.Path
              ref={inst => (this.path = inst)}
              d={`
                  M0,0
                  C${width},${haftHeight} ${width},${haftHeight} 0,${height}
                  Z
                `}
              fill={colors.black}
            />
          </Svg>
        </View>
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
})
