# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.0.6"></a>
## [1.0.6](https://bitbucket.org/targeek/mobile-store/compare/v1.0.5...v1.0.6) (2018-11-20)


### Features

* **config:** remove sentry token from config, use env instead ([40e5fe0](https://bitbucket.org/targeek/mobile-store/commits/40e5fe0))



<a name="1.0.5"></a>
## [1.0.5](https://bitbucket.org/targeek/mobile-store/compare/v1.0.4...v1.0.5) (2018-11-20)


### Features

* **config:** move sentry hook to production.json ([ff25720](https://bitbucket.org/targeek/mobile-store/commits/ff25720))
* **config:** turn on `supportsTablet`; remove dynamic values ([8fe7565](https://bitbucket.org/targeek/mobile-store/commits/8fe7565))



<a name="1.0.4"></a>
## [1.0.4](https://bitbucket.org/targeek/mobile-store/compare/v1.0.3...v1.0.4) (2018-11-20)


### Bug Fixes

* **fastlane:** add `--force --skip_screenshots` due interaction required ([240e352](https://bitbucket.org/targeek/mobile-store/commits/240e352))



<a name="1.0.3"></a>
## [1.0.3](https://bitbucket.org/targeek/mobile-store/compare/v1.0.2...v1.0.3) (2018-11-20)


### Bug Fixes

* **ci:** fix $BUILD_NATIVE conditional script ([2d80b9d](https://bitbucket.org/targeek/mobile-store/commits/2d80b9d))
* **grant-camera:** BarCodeScanner don't reload when granted ([3234f12](https://bitbucket.org/targeek/mobile-store/commits/3234f12))
* **ota:** fix bug when ota update won't reload the app ([22e1db1](https://bitbucket.org/targeek/mobile-store/commits/22e1db1)), closes [#16](https://bitbucket.org/targeek/mobile-store/issue/16)


### Features

* **jenkins:** production build should accept master branch only ([21a1e8b](https://bitbucket.org/targeek/mobile-store/commits/21a1e8b))



<a name="1.0.2"></a>
## [1.0.2](https://bitbucket.org/targeek/mobile-store/compare/v1.0.1...v1.0.2) (2018-11-16)


### Bug Fixes

* **app-loading:** fix bug causes app crashes on start-up ([bbc99c6](https://bitbucket.org/targeek/mobile-store/commits/bbc99c6))


### Features

* **fastlane:** add screenshots & upload screenshots on deliver ([ec64300](https://bitbucket.org/targeek/mobile-store/commits/ec64300))



<a name="1.0.1"></a>
## [1.0.1](https://bitbucket.org/targeek/mobile-store/compare/v1.0.0...v1.0.1) (2018-11-16)


### Bug Fixes

* **jenkins:** fix params defaultValue syntax ([b0ca0e0](https://bitbucket.org/targeek/mobile-store/commits/b0ca0e0))



<a name="1.0.0"></a>
# 1.0.0 (2018-11-16)


### Bug Fixes

* **BarCodeScanner:** Request camera cannot go back and memory leak in set state ([e9c11c4](https://bitbucket.org/targeek/mobile-store/commits/e9c11c4))
* **components/StatusBar:** Fix color on Android ([24bb33a](https://bitbucket.org/targeek/mobile-store/commits/24bb33a))
* **configs:** Fix configs folder path incorrect ([358eb69](https://bitbucket.org/targeek/mobile-store/commits/358eb69))
* **jenkins-ci:** prevent using BUILD_ID on tag names ([30ee9c2](https://bitbucket.org/targeek/mobile-store/commits/30ee9c2))
* **MainScreen:** Fix android back button handler ([ea08a14](https://bitbucket.org/targeek/mobile-store/commits/ea08a14))
* **navigation:** Fix back handler when MainScreen is not focused ([fd113d8](https://bitbucket.org/targeek/mobile-store/commits/fd113d8))
* **SearchBox:** Recheck if the response result match the last requested search text ([a11273b](https://bitbucket.org/targeek/mobile-store/commits/a11273b))


### Features

* **app.json:** Remove hooks ([a43f6a8](https://bitbucket.org/targeek/mobile-store/commits/a43f6a8))
* **app.json:** Update app.json ([786d826](https://bitbucket.org/targeek/mobile-store/commits/786d826))
* **assets:** Refactor assets folder and add exporter ([986e006](https://bitbucket.org/targeek/mobile-store/commits/986e006))
* **assets:** Update app icon and logo ([86f8a1b](https://bitbucket.org/targeek/mobile-store/commits/86f8a1b))
* **BarCodeScanner:** Add ask for camera permission ([c74f30d](https://bitbucket.org/targeek/mobile-store/commits/c74f30d))
* **BarCodeScanner:** Add async storage to save scanned product and update navigate message to webview ([ca3eb96](https://bitbucket.org/targeek/mobile-store/commits/ca3eb96))
* **BarCodeScanner:** Add awesome scanner overlay ([4230c10](https://bitbucket.org/targeek/mobile-store/commits/4230c10))
* **BarCodeScanner:** Add camera permission request ([3533582](https://bitbucket.org/targeek/mobile-store/commits/3533582))
* **BarCodeScanner:** Add go back button ([3854886](https://bitbucket.org/targeek/mobile-store/commits/3854886))
* **BarCodeScanner:** Add loading when verifying the code and not found screen ([4a84e45](https://bitbucket.org/targeek/mobile-store/commits/4a84e45))
* **BarCodeScanner:** Keep screen awakes while scanner is being mounted ([5ac7b1e](https://bitbucket.org/targeek/mobile-store/commits/5ac7b1e))
* **ci:** add Jenkinsfile pipeline to build & dist iOS ([0c1b4b7](https://bitbucket.org/targeek/mobile-store/commits/0c1b4b7))
* **CI/CD:** Update script and add deploy script STORE- ([104f7c5](https://bitbucket.org/targeek/mobile-store/commits/104f7c5))
* **configs:** Add environments config ([374e0fe](https://bitbucket.org/targeek/mobile-store/commits/374e0fe))
* **constants:** Add metrics data ([f0f0632](https://bitbucket.org/targeek/mobile-store/commits/f0f0632))
* **expo-sdk:** Upgrade Expo SDK 31 ([472a8b6](https://bitbucket.org/targeek/mobile-store/commits/472a8b6)), closes [#9](https://bitbucket.org/targeek/mobile-store/issue/9)
* **hoc:** Add keep-awake hoc in order you want to keep a screen awakes ([c0a86d9](https://bitbucket.org/targeek/mobile-store/commits/c0a86d9))
* **hocs:** Add request camera permission HOC ([8ab7bf8](https://bitbucket.org/targeek/mobile-store/commits/8ab7bf8))
* **hocs/keepAwake:** Keep awake in development and specific status ([b08ca55](https://bitbucket.org/targeek/mobile-store/commits/b08ca55))
* **hocs/status-bar:** Support `statusBarProps` passing into hoc ([ab54b0b](https://bitbucket.org/targeek/mobile-store/commits/ab54b0b))
* **hocs/status-bar:** Support StatusBar custom component ([1e8ccf4](https://bitbucket.org/targeek/mobile-store/commits/1e8ccf4))
* **jenkins:** BUILD_NATIVE now defaults to true ([960ecd7](https://bitbucket.org/targeek/mobile-store/commits/960ecd7))
* **MainScreen:** Add BackHandler for Android ([4c67786](https://bitbucket.org/targeek/mobile-store/commits/4c67786))
* **navigation:** Improve transitions ([cca855b](https://bitbucket.org/targeek/mobile-store/commits/cca855b))
* **navigations:** Add navigations and AppContainer ([ac216bb](https://bitbucket.org/targeek/mobile-store/commits/ac216bb))
* **navigations:** Increase gestures response distance from 25 to full device screen width ([ff367f4](https://bitbucket.org/targeek/mobile-store/commits/ff367f4))
* **Sentry:** Add sentry.io bug reporter. ([08af78e](https://bitbucket.org/targeek/mobile-store/commits/08af78e)), closes [#11](https://bitbucket.org/targeek/mobile-store/issue/11)
* **Sentry:** Add sentry.io bug reporter. ([cabd360](https://bitbucket.org/targeek/mobile-store/commits/cabd360)), closes [#11](https://bitbucket.org/targeek/mobile-store/issue/11)
* **StackNavigator:** Keep app awakes on development ([3cb4271](https://bitbucket.org/targeek/mobile-store/commits/3cb4271))
* **StatusBar:** Add withStatusBar HOC ([5708dbf](https://bitbucket.org/targeek/mobile-store/commits/5708dbf))
* **StatusBar:** Fix status bar animation not working and fix hidden status work incorrect ([0fbd937](https://bitbucket.org/targeek/mobile-store/commits/0fbd937))
* **StatusBar:** Fix status bar animation not working and fix hidden status work incorrect ([be9d6eb](https://bitbucket.org/targeek/mobile-store/commits/be9d6eb))
* **SwipeBackGesture:** Add opacity animation ([8a2ef2a](https://bitbucket.org/targeek/mobile-store/commits/8a2ef2a))
* **SwipeBackGesture:** Modify swipe back area. Use 2/3 screen height instead off 100% ([83319ae](https://bitbucket.org/targeek/mobile-store/commits/83319ae))
* **travis-ci:** add Slack notification ([6efd1c1](https://bitbucket.org/targeek/mobile-store/commits/6efd1c1))
* Add native search box. ([87aed61](https://bitbucket.org/targeek/mobile-store/commits/87aed61)), closes [#8](https://bitbucket.org/targeek/mobile-store/issue/8)
* **travis-ci:** use TRAVIS_BUILD_NUMBER for versionCode & buildNumber ([0f60e7d](https://bitbucket.org/targeek/mobile-store/commits/0f60e7d))
* **typescript:** Add typescript support ([6e9c013](https://bitbucket.org/targeek/mobile-store/commits/6e9c013))
* **WebView:** Add loading screen ([805ff26](https://bitbucket.org/targeek/mobile-store/commits/805ff26))
* **WebView:** Add reminder  to enable `useWebKit` on next React Native release ([82720af](https://bitbucket.org/targeek/mobile-store/commits/82720af))
* **WebView:** Add renderError in WebView STORE-90 ([58e54df](https://bitbucket.org/targeek/mobile-store/commits/58e54df))
* **WebView:** Add renderError in WebView STORE-90 ([7c7f395](https://bitbucket.org/targeek/mobile-store/commits/7c7f395))
* **WebView:** Add swipe back gesture to go back in webview ([7335d62](https://bitbucket.org/targeek/mobile-store/commits/7335d62))
* **WebView:** Disable WebView data detector ([b959fd7](https://bitbucket.org/targeek/mobile-store/commits/b959fd7))
* **WebView:** Inject `rn-webview` on web URL to improve app detection. ([390d9cd](https://bitbucket.org/targeek/mobile-store/commits/390d9cd)), closes [#7](https://bitbucket.org/targeek/mobile-store/issue/7)
* **WebView:** Open external URLs in browser instead of in-app WebView. ([d63e17f](https://bitbucket.org/targeek/mobile-store/commits/d63e17f)), closes [#10](https://bitbucket.org/targeek/mobile-store/issue/10)
* **WebView:** Open external URLs in browser instead of in-app WebView. ([a471ecb](https://bitbucket.org/targeek/mobile-store/commits/a471ecb)), closes [#10](https://bitbucket.org/targeek/mobile-store/issue/10)
* Add lint-staged & prettier ([552c475](https://bitbucket.org/targeek/mobile-store/commits/552c475))
* Add OTA updating STORE-39 ([27cca3a](https://bitbucket.org/targeek/mobile-store/commits/27cca3a)), closes [#5](https://bitbucket.org/targeek/mobile-store/issue/5)
* Add react-native-dotenv ([cff321b](https://bitbucket.org/targeek/mobile-store/commits/cff321b))
* Add WebView and Scanner with react navigation ([2b961e1](https://bitbucket.org/targeek/mobile-store/commits/2b961e1))
* Show a message when user goes offline. ([d0afc84](https://bitbucket.org/targeek/mobile-store/commits/d0afc84)), closes [#6](https://bitbucket.org/targeek/mobile-store/issue/6)
