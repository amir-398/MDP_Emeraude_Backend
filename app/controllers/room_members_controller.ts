// import type { HttpContext } from '@adonisjs/core/http'

import RoomMember from '#models/room_member'

export default class RoomMembersController {
  //create
  async create(roomId: number, role: 'admin' | 'moderator' | 'member', userId: number, trx: any) {
    // Create a new room member
    try {
      await RoomMember.create(
        {
          roomId,
          userId,
          role,
        },
        { client: trx }
      )
    } catch (error) {
      console.error('Room member creation failed:', error)
      throw error
    }
  }
}
