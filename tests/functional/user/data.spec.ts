import User from '#models/user'
import { test } from '@japa/runner'

test.group('User data', () => {
  test('it should get user Data', async ({ assert, client }) => {
    const user = await User.find(1)
    const response = user && (await client.get('/api/v1/user/getData').loginAs(user))
    response && response.assertStatus(200)
    response && assert.exists(response.body())
    // verify that it returns the user data
  })
})
