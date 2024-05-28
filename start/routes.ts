/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
const ProfileController = () => import('#controllers/profile_controller')
const PostsController = () => import('#controllers/posts_controller')
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const RoomsController = () => import('#controllers/rooms_controller')
const MessagesController = () => import('#controllers/messages_controller')

const AuthController = () => import('#controllers/auth_controller')
const UserDataController = () => import('#controllers/profile_controller')
const FriendsController = () => import('#controllers/friends_controller')

// auth login register routes
router
  .group(() => {
    router.post('/register', [AuthController, 'register']).as('register')
    router.post('/login', [AuthController, 'login']).as('login')
    router.post('/verifyEmail', [AuthController, 'verifyEmail']).as('verifyEmail')
    router
      .get('/verifyToken', [AuthController, 'verifyToken'])
      .as('verifyToken')
      .use(middleware.auth())
  })
  .prefix('/api/v1/auth')

// user data routes
router
  .group(() => {
    router.get('/getData', [ProfileController, 'show']).as('getUserData')
    router.put('/update', [ProfileController, 'update']).as('updateUserData')
    router
      .put('/updatePassword', [UserDataController, 'updateUserPassword'])
      .as('updateUserPassword')
  })
  .use(middleware.auth())
  .prefix('/api/v1/user')

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

// posts
router
  .group(() => {
    router.get('/', [PostsController, 'index']).as('getPosts')
    router.post('/addPost', [PostsController, 'store']).as('storePost')
  })
  .use(middleware.auth())
  .prefix('/api/v1/posts')
