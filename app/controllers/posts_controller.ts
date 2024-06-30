import Post from '#models/post'
import RolePolicy from '#policies/role_policy'
import { postValidator, updatePostValidator } from '#validators/post'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import PostImagesController from './post_images_controller.js'

export default class PostsController {
  async index({ request, response }: HttpContext) {
    const { lgt, ltd, cat, nb, q } = request.qs()

    try {
      const postsQuery = Post.query().select(
        'id',
        'title',
        'category_id',
        'latitude',
        'longitude',
        'grade',
        'price',
        'location'
      )
      if (q) {
        postsQuery.whereILike('title', `%${q}%`)
      }
      if (lgt && ltd) {
        postsQuery
          .select(
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
      }

      if (cat) {
        postsQuery.where('category_id', cat)
      }

      if (nb) {
        postsQuery.limit(nb)
      }

      const posts = await postsQuery

      return response.ok(posts)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  async store({ response, request, auth, bouncer }: HttpContext) {
    // start a transaction
    const trx = await db.transaction()

    // verify if the user is admin
    try {
      if (await bouncer.with(RolePolicy).denies('isAdmin')) {
        return response.badRequest({
          message: "You don't have the rights to perform this action",
        })
      }
      // get the user id from the auth object
      const userId = auth?.user?.id
      if (!userId) {
        return response.badRequest({ message: 'User not found' })
      }

      // validate the request
      const {
        title,
        categoryId,
        price,
        description,
        location,
        geoloc,
        images,
        latitude,
        longitude,
      } = await request.validateUsing(postValidator)

      const payload = {
        userId,
        title,
        categoryId,
        price,
        description,
        location,
        geoloc,
        latitude,
        longitude,
      }

      // create the post
      const { id } = await Post.create(payload, { client: trx })

      // create the post images
      try {
        const postImage = new PostImagesController()
        await postImage.store(id, images, trx)
      } catch (error) {
        await trx.rollback()
        return response.badRequest({ message: error })
      }

      // commit the transaction
      await trx.commit()
      return response.created({ message: 'post created' })
    } catch (error) {
      // rollback the transaction
      await trx.rollback()
      return response.badRequest({ message: error.message })
    }
  }

  async show({ response, params }: HttpContext) {
    try {
      const { id } = params
      const { title, description, images, category, location, price, comments, grades, grade } =
        await Post.findOrFail(id)
      const post = {
        title,
        description,
        images,
        category,
        location,
        price,
        comments,
        grades,
        grade,
      }
      return response.ok(post)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  async update({ response, params, request, bouncer }: HttpContext) {
    try {
      if (await bouncer.with(RolePolicy).denies('isAdmin')) {
        return response.badRequest({
          message: "You don't have the rights to perform this action",
        })
      }
      const { id } = params
      const payload = await request.validateUsing(updatePostValidator)
      const post = await Post.findOrFail(id)
      post.merge(payload)
      await post.save()
      return response.ok({ message: 'Post updated' })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  async destroy({ response, params, bouncer }: HttpContext) {
    try {
      if (await bouncer.with(RolePolicy).denies('isAdmin')) {
        return response.badRequest({
          message: "You don't have the rights to perform this action",
        })
      }
      const { id } = params
      const post = await Post.findOrFail(id)
      await post.delete()
      return response.ok({ message: 'Post deleted' })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }
}
