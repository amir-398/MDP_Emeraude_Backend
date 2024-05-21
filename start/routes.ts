/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const RoomsController = () => import('#controllers/rooms_controller')
const MessagesController = () => import('#controllers/messages_controller')

const AuthController = () => import('#controllers/auth_controller')
const UserDataController = () => import('#controllers/user_data_controller')
const FriendsController = () => import('#controllers/friends_controller')

// auth login register routes
router
  .group(() => {
    router.post('/register', [AuthController, 'register']).as('register')
    router.post('/login', [AuthController, 'login']).as('login')
  })
  .prefix('/auth/api/v1')

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

//user rooms routes
router
  .group(() => {
    router.post('/create', [RoomsController, 'create'])
    router.get('/rooms', [RoomsController, 'index'])
    router.get('/rooms/:id', [RoomsController, 'show'])
    router.put('/:id', [RoomsController, 'update'])
  })
  .use(middleware.auth())
  .prefix('/api/v1/rooms')
