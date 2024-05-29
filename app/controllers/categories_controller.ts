// import type { HttpContext } from '@adonisjs/core/http'

import Category from '#models/category'
import { HttpContext } from '@adonisjs/core/http'

export default class CategoriesController {
  async index({ response }: HttpContext) {
    try {
      const categories = await Category.all()
      return response.ok(categories)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }
}
