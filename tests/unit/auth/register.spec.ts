import { test } from '@japa/runner'
import sinon from 'sinon'
import User from '#models/user'
import AssetsController from '#controllers/assets_controller'
import ProfileController from '#controllers/profile_controller'
import AuthController from '#controllers/auth_controller'
import db from '@adonisjs/lucid/services/db'

test.group('AuthController - Unit', (group) => {
  group.each.teardown(() => {
    sinon.restore()
  })

  test('register method should register a user successfully', async ({ assert }) => {
    // Arrange
    const trx = await db.transaction()
    const userPayload = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      password: 'password',
      birthDate: '1990-01-01',
      profilImage: {
        clientName: 'profile.jpg',
        size: 1024,
        subtype: 'jpeg',
        tmpPath: '/tmp/uploads/profile.jpg',
        type: 'image',
      },
    }

    const request = {
      validateUsing: async () => userPayload,
    }

    const response = {
      created: sinon.stub(),
      badRequest: sinon.stub(),
    }

    const authController = new AuthController()

    sinon.stub(AssetsController.prototype, 'store').resolves()
    sinon.stub(ProfileController.prototype, 'store').resolves()
    sinon.stub(User, 'create').resolves({ id: 1 })
    sinon.stub(User, 'findOrFail').resolves({ id: 1 })
    sinon.stub(User.accessTokens, 'create').resolves('token123')

    // Act
    const result = await authController.register({ request, response, trx })

    // Assert
    assert.isTrue(response.created.calledOnce)
    assert.equal(result.message, 'User created successfully')
    assert.equal(result.token, 'token123')
  })
})
