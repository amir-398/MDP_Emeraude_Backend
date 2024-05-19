import type { HttpContext } from '@adonisjs/core/http'

import Friend from '#models/friend'
import User from '#models/user'
import FriendPolicy from '#policies/friend_policy'
import { sendInvitationValidator } from '#validators/friend'
import FriendshipStatus from '../enums/frienship_status.js'

export default class FriendsController {
  // send an invitation
  async sendInvitation({ params, response, auth }: HttpContext) {
    try {
      // user sending the invitation
      const user = auth.user?.id
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
    try {
      const user = auth.user
      const userId = user?.id
      const pendingInvitations =
        userId &&
        (await Friend.query()
          .where('userId2', userId)
          .where('status', 'pending')
          .preload('senderData'))

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
      const friends: User[] = []
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
  async acceptInvitation({ params, response, auth, bouncer }: HttpContext) {
    try {
      const friendId = params.friendId
      const friend = await Friend.findOrFail(friendId)

      if (await bouncer.with(FriendPolicy).denies('editInvitation', friend)) {
        // get my custom message from my policy
        return response.status(401).json({ message: 'Unauthorized action' })
      }

      friend.status = FriendshipStatus.ACCEPTED
      friend.save()

      return response.status(200).json({ message: 'Invitation accepted' })
    } catch (error) {
      return response.status(401).json({ message: error.message || 'Unauthorized' })
    }
  }

  // reject an invitation
  async rejectInvitation({ params, response, auth, bouncer }: HttpContext) {
    try {
      const friendId = params.friendId
      const friend = await Friend.findOrFail(friendId)

      if (await bouncer.with(FriendPolicy).denies('editInvitation', friend)) {
        // get my custom message from my policy
        return response.status(401).json({ message: 'Unauthorized action' })
      }

      friend.status = FriendshipStatus.REJECTED
      friend.save()

      return response.status(200).json({ message: 'Invitation rejected' })
    } catch (error) {
      return response.status(401).json({ message: error.message || 'Unauthorized' })
    }
  }
}
