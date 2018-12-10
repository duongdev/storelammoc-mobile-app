import { Linking } from 'react-native'

import global from 'constants/global'
import * as url from 'url'

/**
 * Checks whether the given URL can be opened in the WebView. If the URL's
 * domain is the same as the main web app, navigates the main web app to the
 * given URL. Otherwise, opens the given URL in system browser.
 */
export const handleOpenURL = ($url: string): string | undefined => {
  try {
    const toCheckURL = url.parse($url)
    const storeWebURL = url.parse(global.STORE_WEB_URL)

    /** The given URL isn't an HTTP URL. It could be a deep link URL. */
    if (toCheckURL.protocol && !toCheckURL.protocol.startsWith('http')) {
      Linking.openURL($url)
      return
    }

    /**
     * If the given URL's host matches the main web app's host, opens it
     * inside the web view.
     * Note: url.host contains domain and port; url.hostname only contains domain.
     * @see https://nodejs.org/api/url.html#url_url_host
     * @see https://nodejs.org/api/url.html#url_url_pathname
     */
    if (toCheckURL.host === storeWebURL.host) {
      return toCheckURL.pathname
    }

    /** Handles AccountKit specific URLs */
    if (toCheckURL.host === 'www.accountkit.com') {
      const acceptedPathnames = ['/v1.1/dialog/sms_login/']

      /** If the pathname is not accepted, open it in browser. */
      if (toCheckURL.pathname && !(toCheckURL.pathname in acceptedPathnames))
        Linking.openURL($url)

      return $url
    }

    /** Other URLs which doesn't match any condition above, open it in browser. */
    Linking.openURL($url)
    return
  } catch (err) {
    console.error(err)
    return
  }
}
