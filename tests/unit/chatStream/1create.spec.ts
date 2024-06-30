import ChatSteamsController from '#controllers/chat_steams_controller'
import { test } from '@japa/runner'

test.group('Chat stream create', () => {
  // created chat stream
  test('it should create a chat stream', async ({ assert }) => {
    const userData = {
      id: 6700,
      firstname: 'Amir',
      lastname: 'Bouker',
      imageUrl: 'https://www.google.com',
    }
    const chatSteamController = new ChatSteamsController()
    const response = await chatSteamController.storeUser(
      userData.id,
      userData.firstname,
      userData.lastname,
      userData.imageUrl
    )
    assert.exists(response)
  })

  // add user to channel
})
