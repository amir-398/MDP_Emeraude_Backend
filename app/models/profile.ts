import Roles from '#enums/role'
import User from '#models/user'
import { BaseModel, afterFind, belongsTo, column, computed } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column({ serializeAs: null })
  declare role: string

  @column()
  declare lastname: string

  @column()
  declare firstname: string

  @column()
  declare birthdate: Date

  @column()
  declare profilImage: string

  @column()
  declare description: string | null

  @column()
  declare astrologicalSign: string | null

  @column()
  declare favorite_shows: string | null

  @column()
  declare centerOfInterest: string | null

  @afterFind()
  static async loadProfile(profile: Profile) {
    await profile.load('user')
  }

  //isAdmin
  @computed()
  get isAdmin() {
    return this.role === Roles.ADMIN
  }

  // @column({
  //   prepare: (value: string[]) => JSON.stringify(value), // Convertit le tableau en JSON avant de sauvegarder dans la base de données
  //   consume: (value: string) => JSON.parse(value), // Convertit le JSON en tableau après la lecture de la base de données
  // })
  // declare centerOfInterest: string[]
  @column()
  declare profession: string | null

  @column.dateTime({ autoCreate: true, serializeAs: null })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
