import NotificationType from '#enums/notification_type'
import Notification from '#models/notification'
import { HttpContext } from '@adonisjs/core/http'
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
      return { message: 'Notification created', status: 200 }
    } catch (error) {
      return { message: 'Fail to create notification', status: 400 }
    }
  }

  async index({ response, auth }: HttpContext) {
    try {
      const userId = auth.user?.id

      if (!userId) {
        return response.badRequest({ message: 'Unauthorized' })
      }

      const notifications = await Notification.query().where('userId', userId).preload('friendship')

      return response.ok(notifications)
    } catch (error) {
      return response.badRequest({ message: error.message || 'Unauthorized' })
    }
  }
}
