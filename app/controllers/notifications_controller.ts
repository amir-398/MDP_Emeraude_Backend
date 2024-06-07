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
      return { message: 'Notification created', status: 201 }
    } catch (error) {
      return { message: error, status: 400 }
    }
  }

  async index({ response, auth }: HttpContext) {
    try {
      const userId = auth.user?.id
      console.log('userId', userId)

      const notifications = await Notification.query().where('userId', userId).preload('friendship')

      return response.ok(notifications)
    } catch (error) {
      return response.badRequest({ message: error.message || 'Unauthorized' })
    }
  }
}
