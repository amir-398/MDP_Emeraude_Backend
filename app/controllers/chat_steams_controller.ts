import AssetsController from '#controllers/assets_controller'
import streamClient from '#start/stream'
import { createGroupChannelValidator } from '#validators/channel'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'

export default class ChatSteamsController {
  // create friends channel
  async createFriendChannel(userId1: number, userId2: number) {
    const channelId = cuid()
    try {
      const channel = streamClient.channel('messaging', channelId, {
        members: [userId1.toString(), userId2.toString()],
        created_by_id: userId1.toString(),
        channelType: 'private',
      })
      await channel.create()
    } catch (error) {
      return { message: error.message || 'Unauthorized' }
    }
  }

  // create groupe channel
  async createGroupChannel({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user
      if (!user) return response.badRequest({ message: 'Unauthorized' })

      const { name, image } = await request.validateUsing(createGroupChannelValidator)
      const imageName = `${cuid()}.${image.extname}`
      const AssetsControllerInstance = new AssetsController(image, imageName)
      await AssetsControllerInstance.store()
      const channel = streamClient.channel('messaging', name, {
        name: name,
        members: [user?.id.toString()],
        created_by_id: user?.id.toString(),
        channelType: 'group',
        image: imageName,
      })
      await channel.create()
      return response.ok({ message: 'Channel created successfully' })
    } catch (error) {
      return response.badRequest({ message: error.message || 'Unauthorized' })
    }
  }

  // store user in stream
  async storeUser(userId: number, firstname: string, lastname: string) {
    try {
      const streamUser = {
        id: userId.toString(),
        name: `${firstname} ${lastname}`,
      }
      await streamClient.upsertUser(streamUser)
      const streamToken = streamClient.createToken(userId.toString())
      return streamToken
    } catch (error) {
      return { message: error.message || 'Unauthorized' }
    }
  }

  // Fonction pour ajouter l'utilisateur aux canaux de groupe
  async addUserToGroupChannels(userId: number) {
    try {
      const filters = { type: 'messaging', channelType: 'group' }
      const sort = [{ last_message_at: -1 }]
      const channels = await streamClient.queryChannels(filters, sort)

      for (const channel of channels) {
        await channel.addMembers([userId.toString()])
      }
    } catch (error) {
      console.error('Error adding user to group channels:', error)
    }
  }
}
