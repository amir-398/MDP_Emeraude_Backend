import factory from '@adonisjs/lucid/factories'
import RoomMember from '#models/room_member'

export const RoomMemberFactory = factory
  .define(RoomMember, async ({ faker }) => {
    return {}
  })
  .build()