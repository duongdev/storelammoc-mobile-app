import isEqual from 'lodash/isEqual'

import { Notifications, Permissions } from 'expo'

import { DeviceUserData } from 'types/notifications'

import global from 'constants/global'

let currentUserData: any = 'initial'

/**
 * If user hasn't granted for NOTIFICATION permission before, ask him to grant.
 */
export const askNotificationPermission = async () => {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS,
  )
  let finalStatus = existingStatus

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
    finalStatus = status
  }

  return finalStatus
}

/**
 * Register current device token with user data to notification server.
 */
export const registerClientToken = async (userData?: DeviceUserData) => {
  if (isEqual(userData, currentUserData)) return

  currentUserData = userData

  // Get the token that uniquely identifies this device
  const pushToken = await Notifications.getExpoPushTokenAsync()

  // POST the token to your backend server from where you can retrieve it to send push notifications.
  await fetch(global.PUSH_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pushToken,
      userData,
    }),
  })

  return pushToken
}
