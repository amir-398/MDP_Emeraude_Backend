import Notification from '#models/notification'
import ws from '#services/ws'

export default class NotificationListener {
  async handle(notification: Notification) {
    if (!ws.io) return console.error('Websocket server not available')
    if (!notification) return console.error('Notification not found')
    const notificationParsed = JSON.parse(notification)
    console.log('Notification:', notificationParsed)

    const getNotification = await Notification.query()
      .where('id', notificationParsed.id)
      .preload('friendship')
      .first()
    if (!getNotification) {
      console.error('Notification not found in the database')
      return
    }
    const notificationData = getNotification.toJSON()
    try {
      ws.io?.to(`user:${notificationData.userId}`).emit('notifications', { ...notificationData })
    } catch (error) {
      console.log('Error:', error)
    }
  }
}
