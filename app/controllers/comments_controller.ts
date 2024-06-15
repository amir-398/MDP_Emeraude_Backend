import Comment from '#models/comment'
import Post from '#models/post'
import { postCommentValidator, postIdParamValidator } from '#validators/comment'
import type { HttpContext } from '@adonisjs/core/http'

export default class CommentsController {
  async store({ auth, response, request, params }: HttpContext) {
    try {
      const payload = await request.validateUsing(postCommentValidator)
      const userId = auth.user?.id
      const { postId } = params
      const postIdValidated = await postIdParamValidator.validate({ postId })

      // check if post exists
      const postExists = (await Post.find(postId)) ? true : false
      if (!postExists) {
        return response.notFound({ message: `Post with id ${postId} not found` })
      }

      // check if comment already exists
      const commentExists =
        userId &&
        (await Comment.query()
          .where('userId', userId)
          .where('postId', postIdValidated.postId)
          .first())
      if (commentExists) {
        return response.badRequest({ message: 'Comment already exists' })
      }
      // create comment
      await Comment.create({
        userId,
        postId: postIdValidated.postId,
        ...payload,
      })
      return response.created({ message: 'Comment created successfully' })
    } catch (error) {
      return response.badRequest({ message: `Failed to create comment: ${error.message}` })
    }
  }

  async update({ auth, response, request, params }: HttpContext) {
    try {
      const payload = await request.validateUsing(postCommentValidator)
      const userId = auth.user?.id
      const { postId } = params
      const postIdValidated = await postIdParamValidator.validate({ postId })

      // check if post exists
      const postExists = (await Post.find(postId)) ? true : false
      if (!postExists) {
        return response.notFound({ message: `Post with id ${postId} not found` })
      }

      // check if comment already exists
      const commentExists =
        userId &&
        (await Comment.query()
          .where('userId', userId)
          .where('postId', postIdValidated.postId)
          .first())
      if (!commentExists) {
        return response.notFound({ message: 'Comment not found' })
      }

      // update comment
      await commentExists.merge(payload).save()
      return response.ok({ message: 'Comment updated successfully' })
    } catch (error) {
      return response.badRequest({ message: `Failed to update comment: ${error.message}` })
    }
  }

  async destroy({ auth, response, params }: HttpContext) {
    try {
      const userId = auth.user?.id
      const { postId } = params
      const postIdValidated = await postIdParamValidator.validate({ postId })

      // check if post exists
      const postExists = (await Post.find(postId)) ? true : false
      if (!postExists) {
        return response.notFound({ message: `Post with id ${postId} not found` })
      }

      // check if comment already exists
      const commentExists =
        userId &&
        (await Comment.query()
          .where('userId', userId)
          .where('postId', postIdValidated.postId)
          .first())
      if (!commentExists) {
        return response.notFound({ message: 'Comment not found' })
      }

      // delete comment
      await commentExists.delete()
      return response.ok({ message: 'Comment deleted successfully' })
    } catch (error) {
      return response.badRequest({ message: `Failed to delete comment: ${error.message}` })
    }
  }
}
