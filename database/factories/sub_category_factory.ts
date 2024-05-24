import factory from '@adonisjs/lucid/factories'
import SubCategory from '#models/sub_category'

export const SubCategoryFactory = factory
  .define(SubCategory, async ({ faker }) => {
    return {}
  })
  .build()