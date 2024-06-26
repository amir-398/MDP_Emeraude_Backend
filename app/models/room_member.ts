import RoomMembersRole from '#enums/room_members_role'
import Room from '#models/room'
import User from '#models/user'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class RoomMember extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare roomId: number

  @column()
  declare userId: number

  @column()
  declare memberRole: RoomMembersRole.ADMIN | RoomMembersRole.MEMBER | RoomMembersRole.MODERATOR

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Room)
  declare room: BelongsTo<typeof Room>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
