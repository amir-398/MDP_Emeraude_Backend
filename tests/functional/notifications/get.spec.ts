import User from '#models/user'
import { test } from '@japa/runner'

test.group('Notifications get', () => {
  // get notifications
  test('it should get user notifications', async ({ client }) => {
    const user = await User.find(1)
    const response = user && (await client.get('/api/v1/notifications').loginAs(user))
    response && response.assertStatus(200)
  })

  // get notifications without user
  test('it should not get user notifications without user', async ({ client }) => {
    const response = await client.get('/api/v1/notifications')
    response.assertStatus(401)
  })
})
