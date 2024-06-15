import factory from '@adonisjs/lucid/factories'
import PostImage from '#models/post_image'

export const PostImageFactory = factory
  .define(PostImage, async ({ faker }) => {
    return {}
  })
  .build()