import User from '#models/user'
import { test } from '@japa/runner'
import { join } from 'node:path'
test.group('User delete', () => {
  test('it should register a user successfully', async ({ assert, client }) => {
    const requestData = {
      email: 'amir.123@hotmail.fr',
      password: 'password',
      firstname: 'amir',
      lastname: 'Meb',
      birthDate: '1999-12-12',
    }
    const response = await client
      .post('/api/v1/auth/register')
      .file('profilImage', join('./', './tests/assets', 'image.webp'))
      .fields(requestData)

    response.assertStatus(201)
    assert.exists(response.body().token)
    assert.exists(response.body().streamToken)
  })

  test('it should delete user', async ({ assert, client }) => {
    const user = await User.findBy('email', 'amir.123@hotmail.fr')
    const response = user && (await client.delete('/api/v1/user/delete').loginAs(user))
    response && response.assertStatus(200)
    const userDeleted = user && (await User.find(user.id))
    assert.isNull(userDeleted)
  })
})
