import NotificationType from '#enums/notification_type'
import Notification from '#models/notification'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

export default class NotificationsController {
  async store(
    userId: number,
    targetId: number,
    targetType: NotificationType,
    trx: TransactionClientContract
  ) {
    try {
      const data = { userId, targetId, targetType }
      await Notification.create(data, { client: trx })
      return { message: 'Notification created', status: 201 }
    } catch (error) {
      return { message: error, status: 400 }
    }
  }
}
