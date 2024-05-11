import type { HttpContext } from '@adonisjs/core/http'

import Friend from '#models/friend'
import User from '#models/user'
import { sendInvitationValidator } from '#validators/friend'

export default class FriendsController {
  // get friends

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

  // get pending invitations
  async getPendingInvitations({ auth, response }: HttpContext) {
    const limit = 10
    try {
      const user = auth.getUserOrFail()
      if (!user) {
        return response.status(401).json({ message: 'Unauthorized' })
      }

      const pendingInvitations = await Friend.query()
        .where('userId2', user.id)
        .where('status', 'pending')
        .orderBy('created_at', 'desc')
        .preload('senderData')
        .paginate(1, limit)

      return pendingInvitations
    } catch (error) {
      return response.status(401).json({ message: 'Unauthorized' })
    }
  }
  // get friends
  async getFriends({ auth, response }: HttpContext) {
    const limit = 5
    try {
      const user = auth.getUserOrFail()
      if (!user) {
        return response.status(401).json({ message: 'Unauthorized' })
      }
      // const userFiends = await User.query().preload('friends')
      const friends = []
      // return userFiends
      const snapFriends = await User.query()
        .where('id', user.id)
        .preload('sendedInvitations', (query) => {
          return query.preload('receiverData').where('status', 'accepted')
        })
        .preload('receivedInvitations', (query) => {
          return query.preload('senderData').where('status', 'accepted')
        })
        .first()

      snapFriends?.sendedInvitations?.forEach((friend) => {
        friends.push(friend.receiverData)
      })
      snapFriends?.receivedInvitations?.forEach((friend) => {
        friends.push(friend.senderData)
      })

      return friends
    } catch (error) {
      return response.status(401).json({ message: error.message || 'Unauthorized' })
    }
  }

  // accept an invitation
  async acceptInvitation({ params, response, auth }: HttpContext) {
    try {
      const friendId = params.friendId
      const userId = auth.getUserOrFail().id
      if (!userId) {
        return response.status(401).json({ message: 'Unauthorized' })
      }

      const friend = await Friend.findOrFail(friendId)

      friend.status = 'accepted'
      friend.save()

      return response.status(200).json({ message: 'Invitation accepted' })
    } catch (error) {
      return response.status(401).json({ message: error.message || 'Unauthorized' })
    }
  }

  // reject an invitation
  async rejectInvitation({ params, response, auth }: HttpContext) {
    try {
      const friendId = params.friendId
      const userId = auth.getUserOrFail().id
      if (!userId) {
        return response.status(401).json({ message: 'Unauthorized' })
      }

      const friend = await Friend.findOrFail(friendId)

      friend.status = 'rejected'
      friend.save()

      return response.status(200).json({ message: 'Invitation rejected' })
    } catch (error) {
      return response.status(401).json({ message: error.message || 'Unauthorized' })
    }
  }
}
