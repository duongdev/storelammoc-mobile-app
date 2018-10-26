export const RECEIVED_MESSAGES = {
  /** Event message when webapp was loaded and post a message to mobile app via webview */
  WEB_APP_LOADED: 'WEB_APP_LOADED',
  /** Event message when webapp post a message to open QR scanner */
  OPEN_QR_SCANNER: 'OPEN_QR_SCANNER',
  /** Event message when webapp post enter to home screen message - webapp was stay at home screen */
  ENTER_HOME_SCREEN: 'ENTER_HOME_SCREEN',
}

export const SEND_MESSAGES = {
  /** Send a message to webapp when mobile app received WEB_APP_LOADED event */
  PING_BACK: 'Hello from webview',
}
