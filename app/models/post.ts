import Category from '#models/category'
import Comment from '#models/comment'
import Grade from '#models/grade'
import PostImage from '#models/post_image'
import User from '#models/user'
import { BaseModel, beforeFetch, beforeFind, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
export default class Post extends BaseModel {
  // get the category of the post
  private static async preloadCategories(query: ModelQueryBuilderContract<typeof Post>) {
    query.preload('category', (categoryQuery) => {
      categoryQuery.select('id', 'name')
    })
  }

  // get the comments of the post
  private static async preloadComments(query: ModelQueryBuilderContract<typeof Post>) {
    query.preload('comments', (commentsQuery) => {
      commentsQuery.select('*').preload('user', (userQuery) => {
        userQuery.select('id', 'firstname', 'lastname', 'profilImage')
      })
    })
  }
  private static async preloadGrades(query: ModelQueryBuilderContract<typeof Post>) {
    query.preload('grades', (gradesQuery) => {
      gradesQuery.select('*').preload('user', (userQuery) => {
        userQuery.select('id', 'firstname', 'lastname', 'profilImage')
      })
    })
  }

  private static async preloadImages(query: ModelQueryBuilderContract<typeof Post>) {
    query.preload('images', (imagesQuery) => {
      imagesQuery.select('id', 'postId', 'url')
    })
  }

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column({ serializeAs: null })
  declare categoryId: number

  @column({ serializeAs: null })
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
  declare latitude: number

  @column()
  declare longitude: number

  @column()
  declare geoloc: string

  @column()
  declare grade: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeFetch()
  static async beforeFetchHook(query: ModelQueryBuilderContract<typeof Post>) {
    await this.preloadCategories(query)
    await this.preloadImages(query)
  }

  @beforeFind()
  static async beforeFindHook(query: ModelQueryBuilderContract<typeof Post>) {
    await this.preloadCategories(query)
    await this.preloadComments(query)
    await this.preloadGrades(query)
    await this.preloadImages(query)
  }

  @hasMany(() => PostImage)
  declare images: HasMany<typeof PostImage>

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  @hasMany(() => Grade)
  declare grades: HasMany<typeof Grade>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>
}
