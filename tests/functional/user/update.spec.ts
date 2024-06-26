import AssetsController from '#controllers/assets_controller'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'
import { join } from 'node:path'
test.group('User update', (group) => {
  let user: User
  // setup
  group.each.setup(async () => {
    await db.beginGlobalTransaction()
    const userData = {
      id: 1000,
      email: 'amir.145@hotmail.fr',
      password: 'password',
      firstname: 'amir',
      lastname: 'Meb',
      birthDate: new Date('1999-12-12'),
      profilImage: 'image.webp',
    }
    user = await User.create(userData)
  })

  group.each.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })

  // update user Data
  test('it should update user Data', async ({ assert, client }) => {
    const updateData = {
      lastname: 'John',
      firstname: 'Doe',
    }

    const response =
      user && (await client.put('/api/v1/user/update').loginAs(user).json(updateData))

    response && response.assertStatus(200)
    const reponseBody = response && response.body()
    assert.exists(reponseBody)
    assert.equal(reponseBody.data.firstname, updateData.firstname)
    assert.equal(reponseBody.data.lastname, updateData.lastname)

    await user.refresh()
    assert.equal(user.firstname, updateData.firstname)
    assert.equal(user.lastname, updateData.lastname)
  })

  // update user image
  test('it should update user image', async ({ assert, client }) => {
    const response = await client
      .put('/api/v1/user/update')
      .loginAs(user)
      .file('profilImage', join('./', './tests/assets', 'image.webp'))
    response.assertStatus(200)
    const reponseBody = response.body()
    assert.exists(reponseBody)
    assert.exists(reponseBody.data.profilImage)

    await user.refresh()
    assert.equal(user.profilImage, reponseBody.data.profilImage)
    const assetsControllerInstance = new AssetsController()
    await assetsControllerInstance.destroy(`profileImages/${user.profilImage}`)
  })

  // update user Data with wrong data
  test('it should not update user Data with wrong data', async ({ assert, client }) => {
    const updateData = {
      lastname: 'John',
      firstname: 'Doe',
      email: 'amir398.fr',
    }
    const response =
      user && (await client.put('/api/v1/user/update').loginAs(user).json(updateData))
    response.assertStatus(400)
    assert.equal(response.body().message, 'Validation failure')
  })

  // update password
  test('it should update user password', async ({ assert, client }) => {
    const updateData = {
      oldPassword: 'password',
      newPassword: 'newPassword',
    }
    const response =
      user && (await client.put('/api/v1/user/updatePassword').loginAs(user).json(updateData))
    response.assertStatus(200)
    assert.equal(response.body().message, 'User password updated successfully')
  })

  // update password with wrong old password
  test('it should not update user password with wrong old password', async ({ assert, client }) => {
    const updateData = {
      oldPassword: 'wrongPassword',
      newPassword: 'newPassword',
    }
    const response =
      user && (await client.put('/api/v1/user/updatePassword').loginAs(user).json(updateData))
    response.assertStatus(400)
    assert.equal(response.body().message, 'Invalid old password')
  })
})
