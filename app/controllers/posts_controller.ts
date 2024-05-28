import Post from '#models/post'
import { postValidator } from '#validators/post'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import PostImagesController from './post_images_controller.js'

export default class PostsController {
  async index({ response, request }: HttpContext) {
    const { lgt, ltd } = request.qs()
    console.log(lgt, ltd)

    try {
      const posts = await Post.query()
        .preload('images', (query) => {
          query.select('id', 'url', 'order')
        })
        .preload('category', (query) => {
          query.select('id', 'name')
        })
        .preload('subCategory', (query) => {
          query.select('id', 'name')
        })
        .select(
          '*',
          db.raw(
            'ST_DistanceSphere(geoloc::geometry,ST_SetSRID(ST_MakePoint(?,?), 4326)) AS distance',
            [lgt, ltd]
          )
        )

        .whereRaw(
          'ST_DistanceSphere(geoloc::geometry,ST_SetSRID(ST_MakePoint(?,?), 4326)) < 5000',
          [lgt, ltd]
        )
        .orderBy('distance')
      console.log(posts)

      return response.ok(posts)
    } catch (error) {
      return response.badRequest({ message: error })
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
