import * as React from 'react'

import { Dimensions, StyleSheet, Text, View } from 'react-native'

import colors from 'constants/colors'

const { width, height } = Dimensions.get('window')

// Scanner box edge length
const EDGE_LENGTH = width * 0.8

const CORNER_LENGTH = 35
const CORNER_SPACING = 10
const CORNER_WIDTH = 3
const CORNER_COLOR = colors.white

const TOP = (height - EDGE_LENGTH) / 2
const BOTTOM = TOP + EDGE_LENGTH
const LEFT = (width - EDGE_LENGTH) / 2
const RIGHT = LEFT + EDGE_LENGTH

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    backgroundColor: colors.black,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.5,
  },
  corner: {
    position: 'absolute',
    width: CORNER_LENGTH,
    height: CORNER_LENGTH,
    borderColor: CORNER_COLOR,
    borderWidth: CORNER_WIDTH,
  },
  bottomText: {
    position: 'absolute',
    top: BOTTOM + 16,
    left: LEFT,
    width: EDGE_LENGTH,
    color: colors.white,
    textAlign: 'center',
  },
})

interface BarCodeScannerOverlayProps {}

const BarCodeScannerOverlay: React.SFC<BarCodeScannerOverlayProps> = props => {
  return (
    <React.Fragment>
      {[TopOverlay, RightOverlay, BottomOverlay, LeftOverlay]}
      {[TopLeftCorner, TopRightCorner, BottomRightCorner, BottomLeftCorner]}

      <Text style={styles.bottomText}>Di chuyển camera để thấy rõ mã QR</Text>
    </React.Fragment>
  )
}

//#region overlay
const TopOverlay = (
  <View
    key="top"
    style={[
      styles.overlay,
      {
        height: TOP,
        width: RIGHT,
      },
    ]}
  />
)

const RightOverlay = (
  <View
    key="right"
    style={[
      styles.overlay,
      {
        left: RIGHT,
        height: BOTTOM,
      },
    ]}
  />
)

const BottomOverlay = (
  <View
    key="bottom"
    style={[
      styles.overlay,
      {
        top: BOTTOM,
        left: LEFT,
        width: RIGHT,
      },
    ]}
  />
)

const LeftOverlay = (
  <View
    key="left"
    style={[
      styles.overlay,
      {
        top: TOP,
        width: LEFT,
        height: BOTTOM,
      },
    ]}
  />
)
//#endregion

//#region corner
const TopLeftCorner = (
  <View
    key="top-left"
    style={[
      styles.corner,
      {
        top: TOP + CORNER_SPACING,
        left: LEFT + CORNER_SPACING,
        borderRightWidth: 0,
        borderBottomWidth: 0,
      },
    ]}
  />
)

const TopRightCorner = (
  <View
    key="top-right"
    style={[
      styles.corner,
      {
        top: TOP + CORNER_SPACING,
        left: RIGHT - CORNER_SPACING - CORNER_LENGTH,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
      },
    ]}
  />
)

const BottomRightCorner = (
  <View
    key="bottom-right"
    style={[
      styles.corner,
      {
        top: BOTTOM - CORNER_SPACING - CORNER_LENGTH,
        left: RIGHT - CORNER_SPACING - CORNER_LENGTH,
        borderLeftWidth: 0,
        borderTopWidth: 0,
      },
    ]}
  />
)

const BottomLeftCorner = (
  <View
    key="bottom-left"
    style={[
      styles.corner,
      {
        top: BOTTOM - CORNER_SPACING - CORNER_LENGTH,
        left: LEFT + CORNER_SPACING,
        borderRightWidth: 0,
        borderTopWidth: 0,
      },
    ]}
  />
)
//#endregion

export default BarCodeScannerOverlay
