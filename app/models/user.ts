import AssetsController from '#controllers/assets_controller'
import Friend from '#models/friend'
import Role from '#models/role'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, afterFind, belongsTo, column, computed, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Roles from '../enums/role.js'
import Conversation from './conversation.js'
import Message from './message.js'
import RoomMember from './room_member.js'
const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare roleId: number

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare firstname: string

  @column()
  declare lastname: string

  @column()
  declare birthdate: Date

  @column()
  declare profilImageName: string

  @column()
  declare profilImageUrl: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)

  @afterFind()
  static async getUrl(user: User) {
    const assetInstance = new AssetsController(null, user.profilImageName)
    const url = await assetInstance.create()
    user.profilImageUrl = url
  }

  @computed()
  get isAdmin() {
    return this.roleId === Roles.ADMIN
  }

  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>

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
}
