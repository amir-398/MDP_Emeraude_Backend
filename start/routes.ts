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
const RolesController = () => import('#controllers/roles_controller')

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

// router
//   .group(() => {
//     router.get('messages', [MessagesController, 'store']).as('submitMessage')
//   })
//   .prefix('/api/v1')

// router.get('/api/v1/messages', async () => {
//   emitter.emit('send-io-message', {
//     message: 'Hello from AdonisJS',
//   })
//   // verify if the message was sent

//   return 'pong'
// })
// emitter.on('send-io-message', async (data) => {
//   console.log('Event received:', data)

//   // Set a timeout of 5 seconds
//   const timeout = 1000

//   // Execute some asynchronous task
//   try {
//     // Simulate a delay with a promise
//     await new Promise((resolve) => setTimeout(resolve, timeout))
//     ws.io?.emit('ping', { message: 'pong send by adonisJS' })
//     console.log('Asynchronous task completed')
//   } catch (error) {
//     console.error('Error:', error.message)
//   }
// })
