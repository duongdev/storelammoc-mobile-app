import * as React from 'react'

import { Constants } from 'expo'
import { Image, StyleSheet, View } from 'react-native'

import colors from 'constants/colors'
import { screenHeight } from 'constants/metrics'

import images from 'assets/images'

export default () => (
  <View style={styles.container}>
    <Image
      source={images.splash}
      style={{
        width: '100%',
        height: screenHeight - Constants.statusBarHeight,
      }}
      resizeMode="contain"
    />
  </View>
)

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
})
