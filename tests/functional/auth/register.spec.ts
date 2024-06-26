import AssetsController from '#controllers/assets_controller'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'
import { join } from 'node:path'

test.group('Auth Register', (group) => {
  group.each.setup(async () => {
    await db.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  // register a user
  test('it should register a user successfully', async ({ assert, client }) => {
    const requestData = {
      email: 'amir.39123@hotmail.fr',
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
    const user = await User.findBy('email', requestData.email)
    const assetsControllerInstance = new AssetsController()
    user && (await assetsControllerInstance.destroy(`profileImages/${user?.profilImage}`))
  })

  // register a user with an existing email
  test('it should not register a user with an existing email', async ({ assert, client }) => {
    const requestData = {
      email: 'amir.398@hotmail.fr',
      password: 'password',
      firstname: 'amir',
      lastname: 'Meb',
      birthDate: '1999-12-12',
    }
    const response = await client
      .post('/api/v1/auth/register')
      .file('profilImage', join('./', './tests/assets', 'image.webp'))
      .fields(requestData)
    response.assertStatus(401)
    assert.equal(response.body().message, 'Email already exists')
  })

  // register a user with an invalid data
  test('it should not register a user with an invalid data ', async ({ assert, client }) => {
    const requestData = {
      email: 'amir.398hotmail.fr',
      password: 'password',
      firstname: 'amir',
      lastname: 'Meb',
      birthDate: '1999-12-12',
    }
    const response = await client
      .post('/api/v1/auth/register')
      .file('profilImage', join('./', './tests/assets', 'image.webp'))
      .fields(requestData)
    response.assertStatus(401)
    assert.equal(response.body().message, 'Validation failure')
  })
})
