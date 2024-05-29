import Notification from '#models/notification'
import ws from '#services/ws'

export default class NotificationListener {
  async handle(notification: Notification) {
    console.log('Received notification from the function passed by the emmiter:', notification)
    try {
      ws.io?.to(`user:${userId}`).emit('ping', { message: notification })
    } catch (error) {
      console.log('Error:', error)
    }
  }
}
