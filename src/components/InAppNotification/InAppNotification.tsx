import { get } from 'lodash'

import * as React from 'react'

import { Notifications } from 'expo'
import { EventSubscription } from 'fbemitter'
import { StyleSheet, View } from 'react-native'
import { Snackbar, SnackbarProps } from 'react-native-paper'

import { handleOpenURL } from 'utils/external-link'

import NOTIFICATION_TYPES from 'constants/notification-types'
import { SEND_ACTIONS } from 'constants/web-messages'

export interface InAppNotificationProps {
  postMessageToWeb: any
}
interface State {
  visible: boolean
  notification?: Notifications.Notification
  notificationProps: {
    children: React.ReactNode
    action?: SnackbarProps['action']
  } | null
}

class InAppNotification extends React.Component<InAppNotificationProps, State> {
  notificationSubscription: EventSubscription

  state = {
    visible: false,
    notification: undefined,
    notificationProps: {
      action: {
        onPress: () => {},
        label: '',
      },
      children: '',
    },
  }

  componentDidMount = async () => {
    this.notificationSubscription = Notifications.addListener(
      this.handleNotification,
    )
  }

  handleNotification = (notification: Notifications.Notification) => {
    const notificationOrigin = get(notification, 'origin', '')

    const notificationProps = this.getNotificationProps(notification)

    // Shows in-app notification if this app is foreground.
    this.setState({
      visible: notificationOrigin === 'received',
      notification,
      notificationProps,
    })

    // Handles when user select notification from native notification center.
    if (notificationOrigin === 'selected' && notificationProps) {
      notificationProps.action.onPress()
    }
  }

  handleDismiss = () => this.setState({ visible: false })
  public render() {
    const { visible, notification } = this.state

    if (!notification) return <View />

    const props = this.getNotificationProps(notification)

    return props ? (
      <Snackbar
        visible={visible}
        onDismiss={this.handleDismiss}
        style={styles.snackBar}
        duration={Snackbar.DURATION_MEDIUM}
        action={{
          label: 'Đóng',
          onPress: this.handleDismiss,
        }}
        {...props}
      />
    ) : (
      <View />
    )
  }

  getNotificationProps = (notification: Notifications.Notification) => {
    const defaultNotificationProps = null

    const data = get(notification, 'data', {})
    const type = get(data, 'type')
    /** Combined notification title & body into one single text message. */
    const inAppMessage =
      (get(data, 'title') ? `${get(data, 'title')}. ` : '').toUpperCase() +
      get(data, 'body', '')

    switch (type) {
      case NOTIFICATION_TYPES.ORDER_STATUS_UPDATE:
        return {
          children: `[CO${get(data, 'order')}] ${get(data, 'body')}`,
          action: {
            label: 'Xem',
            onPress: () => {
              this.props.postMessageToWeb(
                SEND_ACTIONS.NAVIGATE,
                `/account/orders/${get(data, 'order')}`,
              )
            },
          },
        }
      case NOTIFICATION_TYPES.NAVIGATE:
        // URL is required, so if url is undefined, shouldn't show anything.
        if (!get(data, 'url')) return defaultNotificationProps

        return {
          children: inAppMessage,
          action: {
            label: 'Xem',
            onPress: () => {
              const storeUrl = handleOpenURL(get(data, 'url'))

              return this.props.postMessageToWeb(
                SEND_ACTIONS.NAVIGATE,
                storeUrl,
              )
            },
          },
        }

      case NOTIFICATION_TYPES.TEXT:
        return {
          children: inAppMessage,
          action: {
            label: 'Đóng',
            onPress: this.handleDismiss,
          },
        }

      default:
        return defaultNotificationProps
    }
  }
}

const styles = StyleSheet.create({
  snackBar: {},
})

export default InAppNotification
