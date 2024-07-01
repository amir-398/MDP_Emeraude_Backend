import type { HttpContext } from '@adonisjs/core/http'

import Grade from '#models/grade'
import Post from '#models/post'
import { postGradeController, postIdParamValidator } from '#validators/grade'
import db from '@adonisjs/lucid/services/db'

export default class GradesController {
  /**
   * @store
   * @summary Create a new grade
   * @description Create a new grade
   * @requestBody {"grade" : "3"}
   */
  async store({ auth, response, request, params }: HttpContext) {
    const trx = await db.transaction()
    try {
      const payload = await request.validateUsing(postGradeController)
      const { postId } = params
      // verify if the postId is a number
      const postIdValidated = await postIdParamValidator.validate({ postId })

      // get the userId
      const userId = auth.user?.id

      // check if post exists
      const postExists = await Post.find(postId)

      if (!postExists) {
        return response.notFound({ message: `Post with id ${postId} not found` })
      }

      //check if user aleady graded the post
      const userGraded =
        userId &&
        (await Grade.query()
          .where('userId', userId)
          .where('postId', postIdValidated.postId)
          .first())

      if (userGraded) {
        return response.badRequest({ message: 'User already graded this post' })
      }

      // create comment
      await Grade.create(
        {
          userId,
          postId: postIdValidated.postId,
          ...payload,
        },
        { client: trx }
      )

      // add grade in the table
      const oldGrade = postExists.grade
      const newGrade = oldGrade === 0 ? payload.grade : (oldGrade + payload.grade) / 2
      postExists.useTransaction(trx)
      postExists.merge({ grade: Number(newGrade.toFixed(2)) })
      await postExists.save()

      // save the new grade
      trx.commit()
      return response.created({ message: 'grade created successfully' })
    } catch (error) {
      await trx.rollback()
      return response.badRequest({ message: `Failed to create grade: ${error.message}` })
    }
  }

  /**
   * @store
   * @summary update a grade
   * @description update a grade
   * @requestBody {"grade" : "4"}
   */
  async update({ auth, response, request, params }: HttpContext) {
    const trx = await db.transaction()
    try {
      const payload = await request.validateUsing(postGradeController)
      const { postId } = params
      // verify if the postId is a number
      const postIdValidated = await postIdParamValidator.validate({ postId })

      // get the userId
      const userId = auth.user?.id

      // check if post exists
      const postExists = await Post.find(postId)

      if (!postExists) {
        return response.notFound({ message: `Post with id ${postId} not found` })
      }

      //check if user aleady graded the post
      const userGraded =
        userId &&
        (await Grade.query()
          .where('userId', userId)
          .where('postId', postIdValidated.postId)
          .first())

      if (!userGraded) {
        return response.badRequest({ message: 'User has not graded this post' })
      }

      // update grade
      userGraded.useTransaction(trx)
      userGraded.merge(payload)
      await userGraded.save()

      // update grade in the table
      const oldGrade = postExists.grade
      const newGrade = (oldGrade - userGraded.grade + payload.grade) / 2
      postExists.useTransaction(trx)
      postExists.merge({ grade: Number(newGrade.toFixed(2)) })
      await postExists.save()

      // save the new grade
      trx.commit()
      return response.ok({ message: 'grade updated successfully' })
    } catch (error) {
      await trx.rollback()
      return response.badRequest({ message: `Failed to update grade: ${error.message}` })
    }
  }

  /**
   * @destroy
   * @summary delete a grade
   * @description delete a grade
   *
   */
  async destroy({ auth, response, params }: HttpContext) {
    const trx = await db.transaction()
    try {
      const { postId } = params
      // verify if the postId is a number
      const postIdValidated = await postIdParamValidator.validate({ postId })

      // get the userId
      const userId = auth.user?.id

      // check if post exists
      const postExists = await Post.find(postId)

      if (!postExists) {
        return response.notFound({ message: `Post with id ${postId} not found` })
      }

      //check if user aleady graded the post
      const userGraded =
        userId &&
        (await Grade.query()
          .where('userId', userId)
          .where('postId', postIdValidated.postId)
          .first())

      if (!userGraded) {
        return response.badRequest({ message: 'User has not graded this post' })
      }

      // delete grade
      await userGraded.delete()

      // update grade in the table
      const oldGrade = postExists.grade
      const newGrade = oldGrade - userGraded.grade
      postExists.useTransaction(trx)
      postExists.merge({ grade: Number(newGrade.toFixed(2)) })
      await postExists.save()

      // save the new grade
      trx.commit()
      return response.ok({ message: 'grade deleted successfully' })
    } catch (error) {
      await trx.rollback()
      return response.badRequest({ message: `Failed to delete grade: ${error.message}` })
    }
  }
}
