# Make app.json
yarn make:$BUILD_ENV
cat app.json

# Create release channel
yarn publish:$BUILD_ENV

# Build native code
if [ $BUILD_NATIVE ]; then
  yarn build:$BUILD_ENV:ios
  yarn build:$BUILD_ENV:android
fi