import ChatSteamsController from '#controllers/chat_steams_controller'
import { test } from '@japa/runner'

test.group('Chat stream delete', () => {
  // delete user chat stream
  test('it should delete a chat stream', async ({ assert }) => {
    const chatStreamController = new ChatSteamsController()
    const response = await chatStreamController.deleteUser(3700)
    assert.exists(response)
    response && assert.equal(response.message, 'User deleted successfully')
  })
})
