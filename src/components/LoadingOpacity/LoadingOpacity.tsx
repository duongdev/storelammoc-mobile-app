import React, { Component } from 'react'

import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'

import colors from 'constants/colors'
import { AuthSession } from 'expo'
import { Button } from 'native-base'

interface Props {
  backgroundColor?: string
  size?: number
  color?: string
  isRetry?: boolean
  onRetry?: () => void
}

export default class LoadingOpacity extends Component<Props> {
  render() {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: this.props.backgroundColor || colors.blackOpacity,
          },
        ]}
      >
        <ActivityIndicator
          // size={this.props.size || 12} // FIXME: cannot set loading indicator size
          color={this.props.color || colors.white}
        />
        {this.props.isRetry && (
          <Button
            bordered
            light
            small
            onPress={this.props.onRetry}
            style={styles.button}
          >
            <Text style={styles.text}>Thử lại</Text>
          </Button>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.blackOpacity,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 10,
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  text: {
    color: colors.white,
  },
})
