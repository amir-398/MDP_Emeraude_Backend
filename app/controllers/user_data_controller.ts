import Friendship from '#models/friendship'
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
  async index({ response, request, auth }: HttpContext) {
    try {
      const { userId } = request.params()
      if (!userId) {
        return response.badRequest({ message: 'User not found' })
      }

      const userConnectedId = auth.user?.id

      const user = await User.findOrFail(userId)

      // Charger les relations d'invitations reçues et envoyées
      const friendsShips: Friendship[] | undefined | 0 =
        userConnectedId &&
        (await Friendship.query().where((builder) => {
          builder
            .where('userId1', userConnectedId)
            .where('userId2', userId)
            .orWhere('userId1', userId)
            .where('userId2', userConnectedId)
        }))

      const friendShipStatus =
        friendsShips && friendsShips.length > 0 ? friendsShips[0].status : null

      return response.ok({ ...user.$attributes, friendShipStatus })
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

      if (!user) {
        return response.status(401).json({ message: 'Unauthorized' })
      }
      const payload = await request.validateUsing(updateUserValidator)
      const profilImage = payload.profilImage

      if (profilImage) {
        const oldProfilImage = user?.profilImage
        const oldBucketKey = `profileImages/${user?.profilImage}`
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
      return response.ok({ data: user })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  // update user password

  async updateUserPassword({ auth, request, response }: HttpContext) {
    try {
      const { oldPassword, newPassword } = await request.validateUsing(updateUserPasswordValidator)
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

      return response.ok({ message: 'User password updated successfully' })
    } catch (error) {
      return response.badRequest({ message: 'Invalid old password' })
    }
  }

  async destroy({ auth, response }: HttpContext) {
    try {
      const user = auth.user
      if (!user) {
        return response.badRequest({ message: 'Unauthorized' })
      }
      const ChatSteamsControllerInstance = new ChatSteamsController()
      await db.from('auth_access_tokens').where('tokenable_id', user.id).delete()
      await user?.delete()
      await ChatSteamsControllerInstance.deleteUser(user!.id)
      await new AssetsController().destroy(`profileImages/${user!.profilImage}`)
      return response.ok({ message: 'User deleted successfully' })
    } catch (error) {
      return response.badRequest({ message: error.message })
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
