import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import env from 'env'

export default class App extends React.Component<any, any> {
  render() {
    return (
      <View style={styles.container}>
        <Text>
          {env.FOO} {env.FOO2} {env.FOO3}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
