import PostImage from '#models/post_image'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Category from './category.js'
import Grade from './grade.js'
import Participant from './participant.js'
import SubCategory from './sub_category.js'
import User from './user.js'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare categoryId: number

  @column()
  declare subCategoryId: number | undefined

  @column()
  declare title: string

  @column()
  declare price: number

  @column()
  declare description: string

  @column()
  declare location: string

  @column()
  declare geoloc: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => PostImage)
  declare images: HasMany<typeof PostImage>

  @hasMany(() => Grade)
  declare grades: HasMany<typeof Grade>

  @hasMany(() => Participant)
  declare participants: HasMany<typeof Participant>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @belongsTo(() => SubCategory)
  declare subCategory: BelongsTo<typeof SubCategory>
}
