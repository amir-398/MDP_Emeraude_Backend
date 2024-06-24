import AssetsController from '#controllers/assets_controller'
import ChatSteamsController from '#controllers/chat_steams_controller'
import User from '#models/user'
import streamClient from '#start/stream'
import { registerUserValidator, userEmailValidator } from '#validators/auth'
import { loginUserValidator } from '#validators/login_user'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class AuthController {
  //register logic
  async register({ request, response }: HttpContext) {
    //register logic
    const trx = await db.transaction()
    try {
      const payload = await request.validateUsing(registerUserValidator)
      const chatStreamController = new ChatSteamsController()
      const profilImage = payload.profilImage
      const imageId = `${cuid()}.${profilImage.subtype}`
      const bucketKey = `profileImages/${imageId}`
      const data = { ...payload, profilImage: imageId }
      // upload image to s3
      try {
        const uploadImageController = new AssetsController()
        await uploadImageController.store(profilImage, bucketKey)
      } catch (error) {
        await trx.rollback()
        return response.badRequest({ message: `Failed to upload image: ${error.message}` })
      }

      // create user
      const { id } = await User.create(data, { client: trx })

      // // commit the transaction
      await trx.commit()

      // generate token
      const user = await User.findOrFail(id)
      const token = await User.accessTokens.create(user)
      // create user and add to channel in stream t
      try {
        await chatStreamController.storeUser(
          user.id,
          user.firstname,
          user.lastname,
          user.profilImage
        )
        await chatStreamController.addUserToGroupChannels(user.id)
      } catch (error) {
        await trx.rollback()
        return response.badRequest({ message: `Failed to add user to stream` })
      }

      const streamToken = streamClient.createToken(user.id.toString())
      return response.created({ token: token, streamToken: streamToken })
    } catch (error) {
      // rollback the transaction

      await trx.rollback()
      return response.status(401).json({ message: error.message })
    }
  }

  //login logic
  async login({ response, request }: HttpContext) {
    try {
      // validate user data
      const { email, password } = await request.validateUsing(loginUserValidator)

      // verify user credentials
      const user = await User.verifyCredentials(email, password)

      // generate token
      const token = await User.accessTokens.create(user)

      const streamToken = streamClient.createToken(user.id.toString())

      // return token
      return response.ok({ token: token, streamToken: streamToken })
    } catch (error) {
      return response.badRequest({ message: error.message })
    }
  }

  //logout logic
  async logout({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const token = auth.user?.currentAccessToken.identifier
    if (!token) {
      return response.badRequest({ message: 'Token not found' })
    }
    await User.accessTokens.delete(user, token)
    return response.ok({ message: 'Logged out' })
  }

  // const verify if emailExist
  async verifyEmail({ response, request }: HttpContext) {
    const { email } = await request.validateUsing(userEmailValidator)
    try {
      const isEmailExist = (await User.findBy('email', email)) ? true : false
      return response.send({ isEmailExist })
    } catch (error) {
      response.badRequest({ message: 'error de vérification du mail' })
    }
  }

  async verifyToken({ auth, response }: HttpContext) {
    try {
      const authcheck = await auth.check()
      if (authcheck) {
        return response.ok(true)
      } else {
        return response.status(401).json({ message: false })
      }
    } catch (error) {
      return response.status(401).json({ message: false })
    }
  }
}
