import Post from '#models/post'
import { postValidator } from '#validators/post'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import PostImagesController from './post_images_controller.js'

export default class PostsController {
  async index({ response, request }: HttpContext) {
    const { lgt, ltd, cat, nb } = request.qs()

    try {
      const posts = await Post.query()
        .if(lgt && ltd, (query) =>
          query
            .select(
              'id',
              'title',
              'category_id',
              'sub_category_id',
              'latitude',
              'longitude',
              db.raw(
                'ST_DistanceSphere(posts.geoloc::geometry, ST_SetSRID(ST_MakePoint(?, ?), 4326)) AS distance',
                [lgt, ltd]
              )
            )
            .whereRaw(
              'ST_DistanceSphere(posts.geoloc::geometry, ST_SetSRID(ST_MakePoint(?, ?), 4326)) < 5000',
              [lgt, ltd]
            )
            .orderBy('distance')
        )
        .if(cat, (query) => query.where('category_id', cat))
        .if(nb, (query) => query.limit(nb))

      return response.ok(posts)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  async store({ response, request, auth }: HttpContext) {
    const trx = await db.transaction()
    try {
      const userId = auth?.user?.id
      const { title, categoryId, price, description, location, geoloc, images } =
        await request.validateUsing(postValidator)

      const payload = { userId, title, categoryId, price, description, location, geoloc }

      const { id } = await Post.create(payload, { client: trx })
      try {
        const postImage = new PostImagesController()
        await postImage.store(id, images, trx)
      } catch (error) {
        await trx.rollback()
        return response.badRequest({ message: error })
      }
      await trx.commit()
      return response.status(201).json({ message: 'post crée avec succées' })
    } catch (error) {
      await trx.rollback()
      return response.badRequest({ message: error })
    }
  }

  async show({ response, params }: HttpContext) {
    return response.json({ message: 'Hello World' })
  }

  async update({ response, params, request }: HttpContext) {
    return response.json({ message: 'Hello World' })
  }

  async destroy({ response, params }: HttpContext) {
    return response.json({ message: 'Hello World' })
  }
}
