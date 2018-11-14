# Make app.json
yarn make:$BUILD_ENV
cat app.json

# Login expo
npx expo login -u $EXPO_USER -p $EXPO_PASS --non-interactive

# Create release channel
yarn publish:$BUILD_ENV

# Build native code
if [ $BUILD_NATIVE ]; then
  yarn build:$BUILD_ENV:ios
  curl -o app.ipa "$(expo url:ipa --non-interactive)"
  fastlane deliver --verbose --ipa "app.ipa" --skip_screenshots --skip_metadata
fi