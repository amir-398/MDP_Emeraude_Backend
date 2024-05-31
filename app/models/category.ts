import Post from '#models/post'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare parentCategoryId: number | null

  @column()
  declare name: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  declare updatedAt: DateTime

  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  @hasMany(() => Category, { foreignKey: 'parentCategoryId' })
  declare subCategories: HasMany<typeof Category>
}
