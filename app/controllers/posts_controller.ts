import { postValidator } from '#validators/post'
import { HttpContext } from '@adonisjs/core/http'

export default class PostsController {
  async index({ response }: HttpContext) {
    return response.json({ message: 'Hello World' })
  }

  async store({ response, request, auth }: HttpContext) {
    try {
      const userId = auth?.user?.id
      const requestData = request.all()
      const data = { ...requestData, userId }
      const payload = userId ? data.validateUsing(postValidator) : ''
      return response.json({ payload })
    } catch (error) {
      return response.badRequest({ message: error.message })
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
