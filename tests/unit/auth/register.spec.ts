import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { test } from '@japa/runner'

test.group('Register', () => {
  test('Register a user successfully', async ({ assert }) => {
    const request = {
      id: 40,
      email: 'amir.3999@hotmail.fr',
      password: 'password',
      firstname: 'amir',
      lastname: 'Meb',
      birthDate: new Date('1999-12-12'),
      profilImage: 'image.jpg',
    }

    await User.create(request)
    const user = await User.findBy('email', request.email)
    assert.exists(user)
    assert.isTrue(hash.isValidHash(user!.password))
    assert.isTrue(hash.verify(user!.password, request.password))
    assert.equal(user!.email, request.email)
    assert.equal(user!.firstname, request.firstname)
    assert.equal(user!.lastname, request.lastname)
    assert.equal(user!.profilImage, request.profilImage)
  })
})
