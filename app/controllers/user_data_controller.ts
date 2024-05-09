import { updateUserPasswordValidator, updateUserValidator } from '#validators/update_user_data'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'
import AssetsController from './assets_controller.js'
export default class UserDataController {
  // get user data
  async getUserData({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      if (!user) {
        return response.status(401).json({ message: 'Unauthorized' })
      }
      const getUrlInstance = new AssetsController(null, user.profil_image_name)
      const url = await getUrlInstance.create()
      const userData = { ...user.$attributes, url }
      return response.status(200).json({ userData })
    } catch (error) {
      return response.status(401).json({ message: 'Unauthorized' })
    }
  }

  // update user data
  async updateUserData({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      if (!user) {
        return response.status(401).json({ message: 'Unauthorized' })
      }

      const payload = await request.validateUsing(updateUserValidator)

      await user.merge(payload).save()
      return response.status(200).json({ message: 'User data updated successfully' })
    } catch (error) {
      return response.status(401).json({ message: 'Unauthorized' })
    }
  }

  // update user password

  async updateUserPassword({ auth, request, response }: HttpContext) {
    const { oldPassword, newPassword } = await request.validateUsing(updateUserPasswordValidator)
    try {
      const user = auth.getUserOrFail()
      if (!user) {
        return response.status(401).json({ message: 'Unauthorized' })
      }
      // Vérifiez si l'ancien mot de passe est correct
      if (!(await hash.verify(user!.password, oldPassword))) {
        return response.badRequest({ message: 'Invalid old password' })
      }
      await user
        .merge({
          password: newPassword,
        })
        .save()
      //logout and delete all tokens
      await db.from('auth_access_tokens').where('tokenable_id', user.id).delete()

      return response.status(200).json({ message: 'User password updated successfully' })
    } catch (error) {
      return response.status(401).json({ message: 'Unauthorized' })
    }
  }
}
