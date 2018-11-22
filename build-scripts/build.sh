# Make app.json
yarn make:$BUILD_ENV
cat app.json

# Login expo
npx expo login -u $EXPO_USER -p $EXPO_PASS --non-interactive

# Create release channel
yarn publish:$BUILD_ENV

# Build native code
if [ $BUILD_NATIVE = true ]; then
  yarn build:$BUILD_ENV:ios & \
  yarn build:$BUILD_ENV:\android

  curl -o app-$BUILD_ENV-$BUILD_NUMBER.ipa "$(npx expo url:ipa --non-interactive)" &\
  curl -o app-$BUILD_ENV-$BUILD_NUMBER.apk "$(npx expo url:apk --non-interactive)"
  
  sudo gem install fastlane

  if [ $BUILD_ENV = "production" ]; then
    # Upload apk to Play Store
    fastlane supply \
      --track "$BUILD_ENV" \
      --json_key api-android-playstore.json \
      --package_name "com.lammoc.store" \
      --apk "app-$BUILD_ENV-$BUILD_NUMBER.apk" \
      --skip_upload_metadata --skip_upload_images --skip_upload_screenshots
  fi

  # Upload app ipa to App Store Connect
  fastlane deliver \
    --verbose \
    --ipa "app-$BUILD_ENV-$BUILD_NUMBER.ipa" \
    --skip_metadata --skip_screenshots \
    --force
fi