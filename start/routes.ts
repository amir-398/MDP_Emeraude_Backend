/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#controllers/auth_controller')
const UserDataController = () => import('#controllers/user_data_controller')
const FriendsController = () => import('#controllers/friends_controller')
const RolesController = () => import('#controllers/roles_controller')
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

// user data routes
router
  .group(() => {
    router.get('/user', [UserDataController, 'getUserData']).as('getUserData')
    router.put('/updateUser', [UserDataController, 'updateUserData']).as('updateUserData')
    router
      .put('/updateUserPassword', [UserDataController, 'updateUserPassword'])
      .as('updateUserPassword')
  })
  .use(middleware.auth())
  .prefix('/api/v1')

// friends routes
router
  .group(() => {
    router.get('/', [FriendsController, 'getFriends'])
    router.get('/pendingInvitations', [FriendsController, 'getPendingInvitations'])
    router.put('/acceptInvitation/:friendId', [FriendsController, 'acceptInvitation'])
    router.put('/rejectInvitation/:friendId', [FriendsController, 'rejectInvitation'])
    router.post('/sendInvitation/:userId', [FriendsController, 'sendInvitation'])
  })
  .use(middleware.auth())
  .prefix('/api/v1/friends')

// user roles routes

router
  .group(() => {
    router.post('/roles/createRole', [RolesController, 'create'])
  })

  .prefix('/api/v1')
