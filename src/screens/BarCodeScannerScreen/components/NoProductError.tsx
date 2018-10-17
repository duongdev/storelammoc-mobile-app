import React, { Component } from 'react'

import { StyleSheet, Text, View } from 'react-native'

import colors from 'constants/colors'
import { Button } from 'native-base'

interface Props {
  onRetry: () => void
  onGoBack: () => void
}

export default class NoProductError extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {'Rất tiếc không tìm thấy kết quả phù hợp.'}
        </Text>

        <View style={styles.btnWrapper}>
          <Button
            bordered
            light
            small
            onPress={this.props.onRetry}
            style={styles.button}
          >
            <Text style={styles.text}>{'Thử lại'}</Text>
          </Button>
          <Button
            bordered
            light
            small
            onPress={this.props.onGoBack}
            style={[styles.button, { marginLeft: 10 }]}
          >
            <Text style={styles.text}>{'Thoát'}</Text>
          </Button>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.blackOpacity,
  },
  btnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
