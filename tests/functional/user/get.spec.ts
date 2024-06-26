import User from '#models/user'
import { test } from '@japa/runner'

test.group('User Get', () => {
  // test if user is logged in
  test('it should get user Data', async ({ assert, client }) => {
    const user = await User.find(1)
    const response = user && (await client.get('/api/v1/user/getData').loginAs(user))
    response && response.assertStatus(200)
    response && assert.exists(response.body())
  })

  // test if user is not logged in
  test('it should not get user Data because user is not logged in', async ({ client }) => {
    const response = await client.get('/api/v1/user/getData')
    response.assertStatus(401)
  })

  // test if user is not found
  test("it should not get user Data because user doesn't exist", async ({ client }) => {
    const user = await User.find(1000)
    const response = user && (await client.get('/api/v1/user/getData').loginAs(user))
    response && response.assertStatus(401)
  })

  // get user by id
  test('it should get user Data by id', async ({ assert, client }) => {
    const userConnected = await User.find(1)
    const userToFind = 15
    const response =
      userConnected &&
      (await client.get(`/api/v1/user/profil/${userToFind}`).loginAs(userConnected))
    response && response.assertStatus(200)
    response && assert.exists(response.body())
  })

  // test if user is not found
  test("it should not get user Data because user doesn't exist", async ({ client }) => {
    const userConnected = await User.find(1)
    const userToFind = 1000
    const response =
      userConnected &&
      (await client.get(`/api/v1/user/profil/${userToFind}`).loginAs(userConnected))
    response && response.assertStatus(400)
  })

  // test search user
  test('it should search user', async ({ assert, client }) => {
    const userConnected = await User.find(1)
    const query = 'lea'
    const response =
      userConnected &&
      (await client.post('/api/v1/user/search').json({ query }).loginAs(userConnected))
    response && response.assertStatus(200)
    response && assert.exists(response.body())
  })
})
