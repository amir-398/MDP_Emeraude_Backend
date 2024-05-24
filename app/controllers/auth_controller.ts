import User from '#models/user'
import { loginUserValidator } from '#validators/login_user'
import { registerUserValidator } from '#validators/register_user'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import ProfileController from './profile_controller.js'

export default class AuthController {
  //register logic
  async register({ request, response }: HttpContext) {
    //register logic
    const trx = await db.transaction()
    try {
      const { email, password, firstname, lastname, birthdate, profilImage } =
        await request.validateUsing(registerUserValidator)

      // const file = request.file('file')
      // console.log(file)

      // console.log(all?.formDataImage._parts[0][1])

      // const uploadImageController = new AssetsController(file, 'test4')
      // const reponse = await uploadImageController.store()
      // console.log(reponse)

      // create user
      const data = { email, password }
      const { id } = await User.create(data, { client: trx })

      // create profil
      const userData = { firstname, lastname, profilImage, birthdate, userId: id }
      new ProfileController().store(id, userData, trx)

      // commit the transaction
      await trx.commit()
      return response.status(201).json({ message: 'User created successfully' })
    } catch (error) {
      // rollback the transaction
      await trx.rollback()
      return response.badRequest({ message: error.message })
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

      // return token
      return response.ok({ token })
    } catch (error) {
      return response.status(401).json({ message: error.message })
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
}
