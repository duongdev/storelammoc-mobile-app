import { lifecycle } from 'recompose'

import global from 'constants/global'

const transitionTimeout = lifecycle({
  componentDidMount() {
    const that = this
    setTimeout(() => {
      that.setState({
        isReady: true,
      })
    }, global.NAV_TRANSITION_DURATION + 100)
  },
})

export default transitionTimeout
