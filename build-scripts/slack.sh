curl --request POST \
  --url $SLACK_WEBHOOK_URL \
  --header 'content-type: application/json' \
  --data "{
	\"channel\": \"#dev-mobile\",
	\"username\": \"[Expo] Store Làm Mộc\",
	\"icon_url\": \"https://avatars2.githubusercontent.com/u/12504344?s=400&v=4\",
	\"attachments\": [
		{
			\"fallback\": \"A new app version was built ($BUILD_NUMBER)\",
			\"title\": \"A new app version was built ($BUILD_NUMBER)\",
			\"fields\": [
				{
					\"title\": \"Release channel\",
					\"value\": \"$BUILD_ENV\",
					\"short\": true
				},
				{
					\"title\": \"Version\",
					\"value\": \"$(cat version.txt) ($BUILD_NUMBER)\",
					\"short\": true
				}
			],
			\"actions\": [
				{
					\"type\": \"button\",
					\"text\": \"Download \",
					\"url\": \"$IPA_URL\"
				},
				{
					\"type\": \"button\",
					\"text\": \"Download :android_black:\",
					\"url\": \"$APK_URL\"
				}
			]
		}
	]
}"