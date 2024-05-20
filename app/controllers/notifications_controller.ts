import NotificationType from '#enums/notification_type'
import Notification from '#models/notification'

export default class NotificationsController {
  async store(userId: number, notifiableId: number, type: NotificationType, trx: any) {
    try {
      const data = { userId, notifiableId, type }
      await Notification.create(data, { client: trx })
      return { message: 'Notification created', status: 201 }
    } catch (error) {
      return { message: error, status: 400 }
    }
  }
}
