import NotificationsController from '#controllers/notifications_controller'
import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'

test.group('Notifications create', (group) => {
  group.each.setup(async () => {
    await db.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })
  // create notification
  test('it should create a notification', async ({ assert }) => {
    const notificationController = new NotificationsController()
    const notificationData = {
      userId: 1,
      targetId: 2,
      targetType: 'friendships',
      trx: null,
    }
    const response = await notificationController.store(
      notificationData.userId,
      notificationData.targetId,
      notificationData.targetType as any,
      notificationData.trx as any
    )
    response.status = 200
    assert.exists(response)
    assert.equal(response.message, 'Notification created')
  })

  // create notification with invalid data
  test('it should not create a notification with invalid data', async ({ assert }) => {
    const notificationController = new NotificationsController()
    const notificationData = {
      userId: 10000,
      targetId: 2,
      targetType: 'invalid_type',
      trx: null,
    }
    const response = await notificationController.store(
      notificationData.userId,
      notificationData.targetId,
      notificationData.targetType as any,
      notificationData.trx as any
    )
    response.status = 400
    assert.exists(response)
    assert.equal(response.message, 'Fail to create notification')
  })
})
