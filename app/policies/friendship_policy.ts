import Friendship from '#models/friendship'
import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import FriendshipStatus from '../enums/status.js'

export default class FriendPolicy extends BasePolicy {
  /**
   * @param user
   * @param friend
   * @returns
   */
  editInvitation(user: User, friend: Friendship): AuthorizerResponse {
    const isPending = friend.status === FriendshipStatus.PENDING
    const isReceiver = user.id === friend.userId2

    return isPending && isReceiver
  }
}
