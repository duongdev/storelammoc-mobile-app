import { Constants } from 'expo'

const env = Constants.manifest.extra || {
  STORE_WEB_URL: 'https://store.mock.love',
}

export default env
