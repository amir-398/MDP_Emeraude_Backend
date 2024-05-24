import Profile from '#models/profile'
import { updateUserPasswordValidator, updateUserValidator } from '#validators/update_user_data'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'
import AssetsController from './assets_controller.js'

interface UserDataProps {
  firstname: string
  lastname: string
  birthdate: Date
  profilImage: MultipartFile
}
export default class ProfileController {
  async store(userId: number, userData: UserDataProps, trx: TransactionClientContract) {
    try {
      //generate a random name for the image
      const profilImageName = cuid() + '.' + userData.profilImage?.extname

      //upload the image to the s3 bucket
      const uploadImageController = new AssetsController(userData.profilImage, profilImageName)
      await uploadImageController.store()

      //store the user data in the database
      const data = { ...userData, profilImage: profilImageName, userId }
      await Profile.create(data)
    } catch (error) {
      await trx.rollback()
      throw new Error(error.message)
    }
  }
  // get user data

  async show({ auth, response }: HttpContext) {
    try {
      const user = auth.user
      const userData = await Profile.findBy('userId', user?.id)
      if (!user) {
        return response.status(401).json({ message: 'Unauthorized' })
      }
      return response.status(200).json(userData)
    } catch (error) {
      return response.status(401).json({ message: error.message || 'Unauthorized' })
    }
  }

  // update user data
  async update({ auth, request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(updateUserValidator)
      const user = auth.user?.id
      const userProfil = await Profile.findBy('userId', user)
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
}
