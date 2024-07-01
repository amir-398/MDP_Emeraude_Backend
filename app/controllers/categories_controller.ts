// import type { HttpContext } from '@adonisjs/core/http'

import Category from '#models/category'
import RolePolicy from '#policies/role_policy'
import { categoryValidator } from '#validators/category'
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

  /**
   * @store
   * @summary Create a new category
   * @description Create a new category
   * @requestBody {"name" : "category name"}
   *
   */
  async store({ response, request, bouncer }: HttpContext) {
    try {
      if (await bouncer.with(RolePolicy).denies('isAdmin')) {
        return response.badRequest({
          message: "Vous n'avez pas les droits pour effectuer cette action",
        })
      }
      const payload = await request.validateUsing(categoryValidator)
      await Category.create(payload)
      return response.created({ message: 'Category created successfully' })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  async show({ response, params }: HttpContext) {
    const { id } = params

    try {
      const category = await Category.findOrFail(id)
      return response.ok(category)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * @update
   * @summary update a category
   * @description update a category
   * @requestBody {"name" : "category name"}
   *
   */
  async update({ response, params, request, bouncer }: HttpContext) {
    try {
      if (await bouncer.with(RolePolicy).denies('isAdmin')) {
        return response.badRequest({
          message: "Vous n'avez pas les droits pour effectuer cette action",
        })
      }
      const { id } = params
      const payload = await request.validateUsing(categoryValidator)
      const category = await Category.findOrFail(id)
      category.merge(payload)
      await category.save()
      return response.ok(category)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  /**
   * @destroy
   * @summary delete a category
   * @description delete a category
   *
   */
  async destroy({ response, params, bouncer }: HttpContext) {
    try {
      if (await bouncer.with(RolePolicy).denies('isAdmin')) {
        return response.badRequest({
          message: "Vous n'avez pas les droits pour effectuer cette action",
        })
      }
      const { id } = params
      const category = await Category.findOrFail(id)
      await category.delete()
      return response.ok({ message: 'Category deleted successfully' })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }
}
