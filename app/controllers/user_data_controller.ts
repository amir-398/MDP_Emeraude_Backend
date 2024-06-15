import User from '#models/user'
import { updateUserPasswordValidator, updateUserValidator } from '#validators/update_user_data'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'
import AssetsController from './assets_controller.js'
import ChatSteamsController from './chat_steams_controller.js'

export default class UserDataController {
  // get userData Profil
  async index({ response, request }: HttpContext) {
    try {
      const { userId } = request.params()
      if (!userId) return response.badRequest({ message: 'User not found' })
      const user = await User.findOrFail(userId)
      return response.ok(user)
    } catch (error) {
      return response.badRequest({ message: error.message || 'Unauthorized' })
    }
  }
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
      const user = auth.user
      const oldProfilImage = user?.profilImage
      const oldBucketKey = `profileImages/${user?.profilImage}`

      if (!user) {
        return response.status(401).json({ message: 'Unauthorized' })
      }
      const payload = await request.validateUsing(updateUserValidator)
      const profilImage = payload.profilImage

      if (profilImage) {
        const imageId = `${cuid()}.${profilImage.subtype}`
        const bucketKey = `profileImages/${imageId}`
        try {
          const uploadImageController = new AssetsController()
          await uploadImageController.store(profilImage, bucketKey)
          oldProfilImage && (await uploadImageController.destroy(oldBucketKey))
          payload.profilImage = imageId
        } catch (error) {
          return response.badRequest({ message: `Failed to upload image: ${error.message}` })
        }
      }
      await user?.merge(payload).save()
      const ChatSteamsControllerInstance = new ChatSteamsController()
      await ChatSteamsControllerInstance.updateUser(
        user!.id,
        user!.firstname,
        user!.lastname,
        user!.profilImage
      )
      return response.status(200).json({ data: user })
    } catch (error) {
      return response.status(401).json({ message: error })
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

  async destroy({ auth, response }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.status(401).json({ message: 'Unauthorized' })
      }
      const ChatSteamsControllerInstance = new ChatSteamsController()
      await db.from('auth_access_tokens').where('tokenable_id', user.id).delete()
      await user?.delete()
      await ChatSteamsControllerInstance.deleteUser(user!.id)
      return response.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
      return response.status(401).json({ message: error.message })
    }
  }

  async searchUsers({ request, response, auth }: HttpContext) {
    try {
      const { query } = request.all()
      if (!query) {
        return response.badRequest({ message: 'Query is required' })
      }
      const capitalizedQueries = query
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())

      const userId = auth.user?.id

      const users =
        userId &&
        (await User.query()
          .select('id', 'firstname', 'lastname', 'profilImage')
          .whereNot('id', userId)
          .where((builder) => {
            capitalizedQueries.forEach((word: string) => {
              builder
                .orWhere('firstname', 'ilike', `%${word}%`)
                .orWhere('lastname', 'ilike', `%${word}%`)
            })
          }))
      return response.ok(users)
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }
}
