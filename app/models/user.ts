import AssetsController from '#controllers/assets_controller'
import Roles from '#enums/role'
import Friend from '#models/friendship'
import Message from '#models/message'
import Notification from '#models/notification'
import RoomMember from '#models/room_member'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, afterFind, column, computed, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Comment from './comment.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  private static async generatePresignedUrls(user: User) {
    const assetsController = new AssetsController()
    user.profilImage = await assetsController.create(`postImages/${user.profilImage}`)
  }

  @column({ isPrimary: true, serializeAs: null })
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
  declare profession: string | null

  @column()
  declare astrologicalSign: string | null

  @column()
  declare favorite_shows: string | null

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
  @afterFind()
  static async afterFindHook(user: User) {
    await this.generatePresignedUrls(user)
  }

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
}
