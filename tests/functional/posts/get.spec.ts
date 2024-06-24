import User from '#models/user'
import { test } from '@japa/runner'

test.group('Posts get', (group) => {
  let user: User
  group.each.setup(async () => {
    const findUser = await User.find(1)

    findUser && (user = findUser)
  })

  // get all posts
  test('it should get all posts', async ({ assert, client }) => {
    const response = await client.get('/api/v1/posts').loginAs(user)
    response.assertStatus(200)
    assert.exists(response.body())
    assert.isArray(response.body())
  })

  // get all post with params
  test('it should get all posts with params', async ({ assert, client }) => {
    const response = await client.get('/api/v1/posts?nb=2').loginAs(user)
    response.assertStatus(200)
    assert.exists(response.body())
    assert.isArray(response.body())
  })

  // get a post
  test('it should get a post', async ({ assert, client }) => {
    const response = await client.get('/api/v1/posts/1').loginAs(user)
    response.assertStatus(200)
    assert.exists(response.body())
  })

  // get a post with invalid id
  test('it should not get a post with invalid id', async ({ assert, client }) => {
    const response = await client.get('/api/v1/posts/1000').loginAs(user)
    response.assertStatus(400)
    assert.equal(response.body().message, 'Row not found')
  })
})
