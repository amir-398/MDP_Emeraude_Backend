import type { HttpContext } from '@adonisjs/core/http'

import Grade from '#models/grade'
import Post from '#models/post'
import { postGradeController, postIdParamValidator } from '#validators/grade'

export default class GradesController {
  async store({ auth, response, request, params }: HttpContext) {
    try {
      const payload = await request.validateUsing(postGradeController)
      const userId = auth.user?.id
      const { postId } = params

      // verify if the postId is a number
      const postIdValidated = await postIdParamValidator.validate({ postId })

      // check if post exists
      const postExists = (await Post.find(postId)) ? true : false

      if (!postExists) {
        return response.notFound({ message: `Post with id ${postId} not found` })
      }
      // create comment
      await Grade.create({
        userId,
        postId: postIdValidated.postId,
        ...payload,
      })
      return response.created({ message: 'grade created successfully' })
    } catch (error) {
      return response.badRequest({ message: `Failed to create grade: ${error.message}` })
    }
  }
}
