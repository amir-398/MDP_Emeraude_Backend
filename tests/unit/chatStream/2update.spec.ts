import ChatSteamsController from '#controllers/chat_steams_controller'
import { test } from '@japa/runner'

test.group('Chat stream update', () => {
  // update user data
  test('it should update user data', async ({ assert }) => {
    const chatStreamController = new ChatSteamsController()
    const userData = {
      id: 6700,
      firstname: 'Fouad',
      lastname: 'Bouker',
      imageUrl: 'https://www.google.com',
    }
    const response = await chatStreamController.updateUser(
      userData.id,
      userData.firstname,
      userData.lastname,
      userData.imageUrl
    )
    assert.exists(response)
    response && assert.equal(response.message, 'User updated successfully')
  })
})
