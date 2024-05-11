import User from '#models/user'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class Friend extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId1: number

  @column()
  declare userId2: number

  @column()
  declare status: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'userId1' })
  declare senderData: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'userId2' })
  declare receiverData: BelongsTo<typeof User>
}
