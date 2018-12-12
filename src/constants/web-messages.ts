export const RECEIVED_ACTIONS = {
  /** Event message when webapp was loaded and post a message to mobile app via webview */
  WEB_APP_LOADED: 'WEB_APP_LOADED',
  /** Event message when webapp post a message to open QR scanner */
  OPEN_QR_SCANNER: 'OPEN_QR_SCANNER',
  /** Event message when webapp post enter to home screen message - webapp was stay at home screen */
  ENTER_HOME_SCREEN: 'ENTER_HOME_SCREEN',
  /** Event message when webapp post leave out home screen message - webapp was stay at home screen */
  LEAVE_HOME_SCREEN: 'LEAVE_HOME_SCREEN',
  /** Event message when webapp post enter to product screen message - webapp was stay at product screen */
  ENTER_PRODUCT_SCREEN: 'ENTER_PRODUCT_SCREEN',
  /** Event message when webapp post a message to open search box */
  OPEN_SEARCH_BOX: 'OPEN_SEARCH_BOX',
  /** Event message fires when redux state on webapp changes */
  REDUX_STATE_UPDATE: 'REDUX_STATE_UPDATE',
}

export const SEND_ACTIONS = {
  /** Send a message to webapp when mobile app received WEB_APP_LOADED event */
  PING_BACK: 'Hello from webview',
  /** Register push token on webapp */
  REGISTER_PUSH_TOKEN: 'REGISTER_PUSH_TOKEN',
  /** Request WebView to navigate to a URL */
  NAVIGATE: 'navigate',
}
