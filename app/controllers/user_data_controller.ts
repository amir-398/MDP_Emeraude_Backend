import type { HttpContext } from '@adonisjs/core/http'
import AssetsController from './assets_controller.js'

export default class UserDataController {
  async getUserData({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const getUrlInstance = new AssetsController(null, user.profil_image_name)
      const url = await getUrlInstance.create()
      const userData = { ...user.$attributes, url }
      return response.status(200).json({ userData })
    } catch (error) {
      return response.status(401).json({ message: 'Unauthorized' })
    }
  }

  /**
   * Display a list of resource
   */
  async index({}: HttpContext) {}

  /**
   * Display form to create a new record
   */
  async create({}: HttpContext) {}

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {}

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request }: HttpContext) {}

  /**
   * Delete record
   */
  async destroy({ params }: HttpContext) {}
}
