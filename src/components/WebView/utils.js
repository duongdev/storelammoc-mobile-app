const patchPostMessageFunction = function() {
  const originalPostMessage = window.postMessage

  const patchedPostMessage = function(message, targetOrigin, transfer) {
    originalPostMessage(message, targetOrigin, transfer)
  }

  patchedPostMessage.toString = function() {
    return String(Object.hasOwnProperty).replace(
      'hasOwnProperty',
      'postMessage',
    )
  }

  window.postMessage = patchedPostMessage
}

export const patchPostMessageJsCode =
  '(' + String(patchPostMessageFunction) + ')();'
