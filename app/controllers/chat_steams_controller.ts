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

  // remove user from channel
  async removeUserFromChannels(userId: number) {
    try {
      const filters = { type: 'messaging' }
      const sort = [{ last_message_at: -1 }]
      const channels = await streamClient.queryChannels(filters, sort)

      for (const channel of channels) {
        await channel.removeMembers([userId.toString()])
      }
    } catch (error) {
      console.error('Error removing user from channels:', error)
    }
  }

  // create groupe channel
  async createGroupChannel({ request, response, auth }: HttpContext) {
    try {
      const user = auth.user
      if (!user) return response.badRequest({ message: 'Unauthorized' })

      const { name, image } = await request.validateUsing(createGroupChannelValidator)
      const imageName = `${cuid()}.${image.subtype}`
      const bucketKey = `groupImages/${imageName}`
      const AssetsControllerInstance = new AssetsController()
      await AssetsControllerInstance.store(image, bucketKey)
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
  async storeUser(userId: number, firstname: string, lastname: string, imageUrl: string) {
    try {
      const streamUser = {
        id: userId.toString(),
        name: `${firstname} ${lastname}`,
        image: `https://frienddly.s3.eu-north-1.amazonaws.com/profileImages/${imageUrl}`,
      }
      await streamClient.upsertUser(streamUser)
      const streamToken = streamClient.createToken(userId.toString())
      return streamToken
    } catch (error) {
      return { message: error.message || 'Unauthorized' }
    }
  }

  //update user in stream
  async updateUser(userId: number, firstname: string, lastname: string, imageUrl: string) {
    try {
      const streamUser = {
        id: userId.toString(),
        name: `${firstname} ${lastname}`,
        image: `https://frienddly.s3.eu-north-1.amazonaws.com/profileImages/${imageUrl}`,
      }
      await streamClient.upsertUser(streamUser)
    } catch (error) {
      console.error('Error updating user:', error)
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

  // delete user
  async deleteUser(userId: number) {
    try {
      await this.removeUserFromChannels(userId)
      await streamClient.deleteUser(userId.toString(), {
        hard_delete: true,
      })
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }
}
