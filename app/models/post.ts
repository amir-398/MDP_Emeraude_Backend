import AssetsController from '#controllers/assets_controller'
import PostImage from '#models/post_image'
import {
  BaseModel,
  afterFetch,
  afterFind,
  beforeFetch,
  beforeFind,
  belongsTo,
  column,
  hasMany,
} from '@adonisjs/lucid/orm'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import type { Point } from 'geojson'
import { DateTime } from 'luxon'
import Category from './category.js'
import Grade from './grade.js'
import Participant from './participant.js'
import SubCategory from './sub_category.js'
import User from './user.js'
export default class Post extends BaseModel {
  private static async generatePresignedUrls(post: Post, first: boolean) {
    const assetsController = new AssetsController()
    await post.load('images', (query) => {
      query.select('id', 'url').if(first, (fQuery) => fQuery.where('order', 0))
    })
    for (const image of post.images) {
      if (image.url) {
        image.url = await assetsController.create(`postImages/${image.url}`)
      }
    }
  }

  private static async preloadCategories(query: ModelQueryBuilderContract<typeof Post>) {
    query.preload('category', (categoryQuery) => {
      categoryQuery.select('id', 'name')
    })
    query.preload('subCategory', (subCategoryQuery) => {
      subCategoryQuery.select('id', 'name')
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
  declare geoloc: Point
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeFetch()
  static async beforeFetchHook(query: ModelQueryBuilderContract<typeof Post>) {
    await this.preloadCategories(query)
  }
  @afterFetch()
  static async afterFetchHook(posts: Post[]) {
    for (const post of posts) {
      await this.generatePresignedUrls(post, true)
    }
  }
  @beforeFind()
  static async beforeFindHook(query: ModelQueryBuilderContract<typeof Post>) {
    await this.preloadCategories(query)
  }

  @afterFind()
  static async afterFindHook(post: Post) {
    await this.generatePresignedUrls(post, false)
  }
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
