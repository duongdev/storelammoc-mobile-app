import Sentry from 'sentry-expo'
import AppContainer from './src/AppContainer'

// Remove this once Sentry is correctly setup.
Sentry.enableInExpoDevelopment = true

Sentry.config(
  'https://6bbe0f5a222e4b4f8aacc0513484d276@sentry.io/1320892',
).install()

export default AppContainer
