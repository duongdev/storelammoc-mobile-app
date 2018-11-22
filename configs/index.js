const fs = require('fs')
const path = require('path')
const lodash = require('lodash')

const args = process.argv.slice(2)

// --configPath=./config
const cliOptions = {}
args.forEach(function(arg) {
  const splitArr = arg.split('=')
  if (splitArr.length) {
    let k = splitArr[0].split('--')
    let v = splitArr.pop()
    if (k.length) {
      k = k.pop()
      cliOptions[k] = v
    }
  }
})

const passedEnv = cliOptions.env || 'development'
buildConfig(passedEnv)

function buildConfig(env) {
  const version = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../package.json')),
  ).version

  fs.writeFileSync(path.join(process.cwd(), 'version.txt'), version)

  const defaultPath = '/configs/default.json'
  const fpath = `configs/${env}.json`
  const fpathLocal = `configs/${env}.local.json`
  const defaultConfig = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), defaultPath), 'utf8'),
  )
  const hasLocalFile = fs.existsSync(fpathLocal)
  const localConfig = hasLocalFile
    ? JSON.parse(fs.readFileSync(path.join(process.cwd(), fpathLocal), 'utf8'))
    : {}

  let mergedConfig = defaultConfig

  if (fs.existsSync(fpath)) {
    const config =
      JSON.parse(fs.readFileSync(path.join(process.cwd(), fpath)), 'utf8') || {}
    mergedConfig = lodash.merge(defaultConfig, config, localConfig)
  }

  mergedConfig.expo.version = version

  if (process.env.BUILD_NUMBER) {
    const buildNumber = process.env.BUILD_NUMBER
    mergedConfig.expo.android.versionCode = +buildNumber
    mergedConfig.expo.ios.buildNumber = buildNumber
  }

  // Setup sentry config
  let sentryConfig = lodash.get(
    mergedConfig,
    'expo.hooks.postPublish[0].config',
  )
  try {
    if (sentryConfig && process.env.SENTRY_TOKEN) {
      sentryConfig.authToken = process.env.SENTRY_TOKEN
    }
  } catch (error) {
    sentryConfig = {}
  }

  fs.writeFileSync(
    path.join(process.cwd(), 'app.json'),
    JSON.stringify(mergedConfig, null, 2),
    'utf8',
    err => {
      if (err) {
        console.error(err)
      }
    },
  )
  console.info('Created app.json file successfully')
}
