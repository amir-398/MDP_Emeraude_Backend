import NotificationType from '#enums/notification_type'
import Friendship from '#models/friendship'
import User from '#models/user'
import FriendPolicy from '#policies/friendship_policy'
import { sendInvitationValidator } from '#validators/friendship'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import FriendshipStatus from '../enums/status.js'
import NotificationsController from './notifications_controller.js'

export default class FriendsController {
  // send an invitation
  async sendInvitation({ params, response, auth }: HttpContext) {
    const trx = await db.transaction()
    try {
      // user sending the invitation
      const user = auth.user?.id
      const { userId } = params

      // check if the user is sending an invitation to himself
      if (user === userId) {
        return response.status(400).json({ message: 'You cannot send an invitation to yourself' })
      }

      const existingInvitation =
        user &&
        (await Friendship.query().where('userId1', user).andWhere('userId2', userId).first())

      if (existingInvitation) {
        return response.status(400).json({ message: 'Invitation already exists' })
      }

      // user receiving the invitation
      const { receiverId } = await sendInvitationValidator.validate({ receiverId: userId })

      const { id } = await Friendship.create(
        { userId1: user, userId2: receiverId },
        { client: trx }
      )
      const notificationResult = await new NotificationsController().store(
        receiverId,
        id,
        NotificationType.FRIENDSHIPS,
        trx
      )
      await trx.commit()
      return response
        .status(201)
        .json({ message: 'Invitation sent && ' + notificationResult.message })
    } catch (error) {
      await trx.rollback()
      return response.status(401).json({ message: error })
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
        (await Friendship.query()
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
  async acceptInvitation({ params, response, bouncer }: HttpContext) {
    try {
      const friendId = params.friendId
      const friend = await Friendship.findOrFail(friendId)

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
  async rejectInvitation({ params, response, bouncer }: HttpContext) {
    try {
      const friendId = params.friendId
      const friend = await Friendship.findOrFail(friendId)

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
