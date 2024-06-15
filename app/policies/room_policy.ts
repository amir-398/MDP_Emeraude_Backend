import Room from '#models/room'
import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import RoomMembersRole from '../enums/room_members_role.js'

export default class RoomPolicy extends BasePolicy {
  async alterRoom(user: User, room: Room) {
    const userId = user.id
    const roomMember =
      userId && (await room.related('members').query().where('userId', userId).first())

    return roomMember ? roomMember?.role === RoomMembersRole.ADMIN : false
  }
}
