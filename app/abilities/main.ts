/*
|--------------------------------------------------------------------------
| Bouncer abilities
|--------------------------------------------------------------------------
|
| You may export multiple abilities from this file and pre-register them
| when creating the Bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

import Room from '#models/room'
import User from '#models/user'
import { Bouncer } from '@adonisjs/bouncer'
import RoomMembersRole from '../enums/room_members_role.js'

/**
 * Delete the following ability to start from
 * scratch
 */
export const alterRoom = Bouncer.ability(async (user: User, room: Room) => {
  const userId = user.id
  const roomMember =
    userId && (await room.related('members').query().where('userId', userId).first())

  return roomMember ? roomMember?.role === RoomMembersRole.ADMIN : false
})
