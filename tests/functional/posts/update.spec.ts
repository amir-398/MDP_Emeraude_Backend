import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'

test.group('Posts update', (group) => {
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
  test('it should update a post', async ({ assert, client }) => {
    const postData = {
      title: 'modified title post',
      categoryId: 1,
      price: 120,
    }
    const response = await client.put('/api/v1/posts/1').json(postData).loginAs(user)
    response.assertStatus(200)
    assert.exists(response.body())
    assert.equal(response.body().message, 'Post updated')
  })

  // update a post with invalid id
  test('it should not update a post with invalid id', async ({ assert, client }) => {
    const response = await client.put('/api/v1/posts/1000').loginAs(user)
    response.assertStatus(400)
    assert.equal(response.body().message, 'Row not found')
  })

  // update a post without being an admin
  test('it should not update a post without being an admin', async ({ assert, client }) => {
    const response = await client.put('/api/v1/posts/1').loginAs(userNotAdmin)
    response.assertStatus(400)
    assert.equal(response.body().message, "You don't have the rights to perform this action")
  })

  // update a post with invalid data
  test('it should not update a post with invalid data', async ({ assert, client }) => {
    const postData = {
      title: 'modified title post',
      categoryId: 1,
      price: 'invalid price',
    }
    const response = await client.put('/api/v1/posts/1').json(postData).loginAs(user)
    response.assertStatus(400)
    assert.equal(response.body().message, 'Validation failure')
  })
})
