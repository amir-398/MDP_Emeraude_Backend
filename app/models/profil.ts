import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Profil extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare lastname: string

  @column()
  declare firstname: string

  @column()
  declare birthdate: Date

  @column()
  declare profilImage: string

  @column()
  declare description: string

  @column()
  declare astrologicalSign: string

  @column()
  declare favorite_shows: string

  @column()
  declare centerOfInterest: string

  @column()
  declare profession: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
