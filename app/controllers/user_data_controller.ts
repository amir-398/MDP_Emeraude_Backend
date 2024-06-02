import User from '#models/user'
import { updateUserPasswordValidator, updateUserValidator } from '#validators/update_user_data'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'

interface UserDataProps {
  firstname: string
  lastname: string
  birthDate: Date
  profilImage: string
}
export default class UserDataController {
  // get user data
  async show({ auth, response }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.status(401).json({ message: 'Unauthorized' })
      }
      return response.ok(user)
    } catch (error) {
      return response.badRequest({ message: error.message || 'Unauthorized' })
    }
  }

  // update user data
  async update({ auth, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(updateUserValidator)
      const user = auth.user?.id
      const userProfil = await User.findBy('userId', user)
      await userProfil?.merge(payload).save()
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

  async getProfilImage({ response, request }: HttpContext) {
    try {
      const { userId } = request.all()
      const userData = await User.find(userId)
      const userImage = userData?.profilImage
      return response.ok(userImage)
    } catch (error) {
      return response.badRequest({ message: 'Unauthorized' })
    }
  }
}
