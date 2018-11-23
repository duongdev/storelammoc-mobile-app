import get from 'lodash/get'

import * as React from 'react'

import { Constants } from 'expo'
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import colors from 'constants/colors'

import images from 'assets/images'

const APP_VERSION = Constants.manifest.version
const BUILD_ID =
  Platform.OS === 'ios'
    ? get(Constants.platform.ios, 'buildNumber')
    : get(Constants.platform.android, 'versionCode')

export default () => {
  const BUILD_ID_STR = BUILD_ID ? `(${BUILD_ID})` : ''

  return (
    <View style={styles.container}>
      <Image
        source={images.splash}
        style={styles.splashImage}
        resizeMode="contain"
      />

      <View style={styles.versionTextWrapper}>
        <ActivityIndicator />
        <Text style={styles.versionText}>
          v{APP_VERSION} {BUILD_ID_STR}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  splashImage: {
    flex: 1,
    width: '80%',
  },

  versionTextWrapper: {
    position: 'absolute',
    bottom: 20,
  },
  versionText: {
    marginTop: 20,
    color: colors.white,
  },
})
