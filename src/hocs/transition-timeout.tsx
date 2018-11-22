import { lifecycle } from 'recompose'

const transitionTimeout = lifecycle({
  componentDidMount() {
    const that = this
    setTimeout(() => {
      that.setState({
        isReady: true,
      })
    }, 300)
  },
})

export default transitionTimeout
