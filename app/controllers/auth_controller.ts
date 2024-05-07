import User from '#models/user'
import { userProfilImageValidator } from '#validators/asset'
import { loginUserValidator } from '#validators/login_user'
import { registerUserValidator } from '#validators/register_user'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import AssetsController from './assets_controller.js'

export default class AuthController {
  //register logic
  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerUserValidator)
    const profilImage = request.file('profil_image')
    //generate a random name for the image

    const valideProfilImage = await userProfilImageValidator.validate({ profil_image: profilImage })
    const profilImageName = cuid() + '.' + valideProfilImage.profil_image?.extname

    //upload the image to the s3 bucket
    const uploadImageController = new AssetsController(
      valideProfilImage.profil_image,
      profilImageName
    )
    await uploadImageController.store()

    const userData = { ...payload, profil_image_name: profilImageName }
    await User.create(userData)
    return response.status(201).json({ message: 'User created successfully' })
  }

  //login logic
  async login({ request }: HttpContext) {
    //login logic
    const { email, password } = await request.validateUsing(loginUserValidator)
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)
    return { token: token, ...user.serialize() }
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
