import type { HttpContext } from '@adonisjs/core/http'

import Friend from '#models/friend'
import User from '#models/user'
import { sendInvitationValidator } from '#validators/friend'

export default class FriendsController {
  // get friends
  async getFriends({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      if (!user) {
        return response.status(401).json({ message: 'Unauthorized' })
      }
      // const userFiends = await User.query().preload('friends')

      // return userFiends
      const friends = await User.query()
        .where('id', user.id)
        .preload('sendedInvitations', (query) => {
          query.preload('user2')
        })
        .preload('receivedInvitations', (query) => {
          query.preload('user1')
        })

      return friends
    } catch (error) {
      return response.status(401).json({ message: error.message || 'Unauthorized' })
    }
  }

  // send an invitation
  async sendInvitation({ params, response, auth }: HttpContext) {
    try {
      // user sending the invitation
      const user = auth.getUserOrFail().id
      if (!user) {
        return response.status(401).json({ message: 'Unauthorized' })
      }

      // user receiving the invitation
      const userId = params.userId
      const payload = await sendInvitationValidator.validate({ userId })

      if (user === payload.userId) {
        return response.status(400).json({ message: 'You cannot send an invitation to yourself' })
      }
      Friend.create({ userId1: user, userId2: payload.userId })
      return response.status(201).json({ message: 'Invitation sent' })
    } catch (error) {
      return response.status(401).json({ message: 'Unauthorized' })
    }
    // send the invitation
  }

  async getPendingInvitation({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      if (!user) {
        return response.status(401).json({ message: 'Unauthorized' })
      }

      const pendingInvitations = await Friend.query().where('userId2', user.id).preload('user1')

      return pendingInvitations
    } catch (error) {
      return response.status(401).json({ message: 'Unauthorized' })
    }
  }
}
