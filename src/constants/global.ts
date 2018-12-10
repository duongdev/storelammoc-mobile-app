import { Constants } from 'expo'

const env: {
  STORE_WEB_URL: string
  API_URL: string
  PUSH_ENDPOINT: string
} = Constants.manifest.extra as any

const global = {
  NAV_TRANSITION_DURATION: 300,
  ...env,
}

export default global
