import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'

test.group('Posts destroy', (group) => {
  let user: User
  let userNotAdmin: User
  group.each.setup(async () => {
    await db.beginGlobalTransaction()
    const findUser = await User.find(1)
    const findUserNotAdmin = await User.find(2)
    findUser && (user = findUser)
    findUserNotAdmin && (userNotAdmin = findUserNotAdmin)
  })
  group.each.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  test('it should destroy a post', async ({ assert, client }) => {
    const response = await client.delete('/api/v1/posts/1').loginAs(user)
    response.assertStatus(200)
    assert.exists(response.body())
    assert.equal(response.body().message, 'Post deleted')
  })

  test('it should not destroy a post if the user is not the owner', async ({ client, assert }) => {
    const response = await client.delete('/api/v1/posts/1').loginAs(userNotAdmin)
    response.assertStatus(400)
    assert.equal(response.body().message, "You don't have the rights to perform this action")
  })

  // destroy a post with invalid id
  test('it should not destroy a post with invalid id', async ({ assert, client }) => {
    const response = await client.delete('/api/v1/posts/1000').loginAs(user)
    response.assertStatus(400)
    assert.equal(response.body().message, 'Row not found')
  })
})
