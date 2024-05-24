import Conversation from '#models/conversation'
import Friend from '#models/friendship'
import Message from '#models/message'
import Notification from '#models/notification'
import RoomMember from '#models/room_member'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Profile from './profile.js'
const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true, serializeAs: null })
  declare id: number

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @hasOne(() => Profile)
  declare profile: HasOne<typeof Profile>

  @hasMany(() => Friend, {
    localKey: 'id',
    foreignKey: 'userId1',
  })
  declare sendedInvitations: HasMany<typeof Friend>

  @hasMany(() => Friend, {
    localKey: 'id',
    foreignKey: 'userId2',
  })
  declare receivedInvitations: HasMany<typeof Friend>

  @hasMany(() => Conversation, {
    localKey: 'id',
    foreignKey: 'userId1',
  })
  declare conversations1: HasMany<typeof Conversation>

  @hasMany(() => Conversation, {
    localKey: 'id',
    foreignKey: 'userId2',
  })
  declare conversations2: HasMany<typeof Conversation>

  @hasMany(() => Message)
  declare messages: HasMany<typeof Message>

  @hasMany(() => RoomMember)
  declare roomMembers: HasMany<typeof RoomMember>

  @hasMany(() => Notification)
  declare notifications: HasMany<typeof Notification>
}
