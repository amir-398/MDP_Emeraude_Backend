import RoomType from '#enums/room_type'
import RoomVisibility from '#enums/room_visibility'
import Message from '#models/message'
import RoomMember from '#models/room_member'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class Room extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string | null

  @column()
  declare roomType: RoomType.GROUP | RoomType.PRIVATE

  @column()
  declare visibility: RoomVisibility.PUBLIC | RoomVisibility.PRIVATE

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => RoomMember)
  declare members: HasMany<typeof RoomMember>

  @hasMany(() => Message)
  declare messages: HasMany<typeof Message>
}
