import Roles from '#enums/role'
import Comment from '#models/comment'
import Friend from '#models/friendship'
import Message from '#models/message'
import Notification from '#models/notification'
import Post from '#models/post'
import RoomMember from '#models/room_member'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, column, computed, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

const AuthFinder = withAuthFinder(() => hash.use('argon'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column({ serializeAs: null })
  declare role: string

  @column()
  declare lastname: string

  @column()
  declare firstname: string

  @column()
  declare birthDate: Date

  @column()
  declare profilImage: string

  @column()
  declare description: string | null

  @column()
  declare cityOfBirth: string | null

  @column()
  declare iLike: string | null

  @column()
  declare dreamCity: string | null

  @column()
  declare activity: string | null

  @column()
  declare astrologicalSign: string | null

  @column()
  declare favoriteShows: string | null

  @column()
  declare favoriteArtists: string | null

  @column()
  declare centerOfInterest: string | null

  @column.dateTime({ autoCreate: true, serializeAs: null })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @computed()
  get isAdmin() {
    return this.role === Roles.ADMIN
  }

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

  @hasMany(() => Message)
  declare messages: HasMany<typeof Message>

  @hasMany(() => RoomMember)
  declare roomMembers: HasMany<typeof RoomMember>

  @hasMany(() => Notification)
  declare notifications: HasMany<typeof Notification>

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>
}
