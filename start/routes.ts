/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#controllers/auth_controller')
const AssetsController = () => import('#controllers/assets_controller')
const UserDataController = () => import('#controllers/user_data_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router.post('/auth/register', [AuthController, 'register']).as('register')
    router.post('/auth/login', [AuthController, 'login']).as('login')
  })
  .prefix('/api/v1')

router
  .get('/api/v1', async () => {
    return 'protected route'
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )

router.group(() => {
  router
    .get('/user', [UserDataController, 'getUserData'])
    .as('getUserData')
    .use(middleware.auth())
    .prefix('/api/v1')
})
