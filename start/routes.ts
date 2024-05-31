/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const PostsController = () => import('#controllers/posts_controller')
const CategoriesController = () => import('#controllers/categories_controller')
const CommentsController = () => import('#controllers/comments_controller')
const GradesController = () => import('#controllers/grades_controller')
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
    router.get('/getData', [UserDataController, 'show']).as('getUserData')
    router.put('/update', [UserDataController, 'update']).as('updateUserData')
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
    router.get('/:id', [PostsController, 'show']).as('getPost')
    router.post('/addPost', [PostsController, 'store']).as('storePost')
  })
  .use(middleware.auth())
  .prefix('/api/v1/posts')

// comments
router
  .group(() => {
    router.post('/addComment/:postId', [CommentsController, 'store']).as('addComment')
  })
  .use(middleware.auth())
  .prefix('/api/v1/comments')

// grades
router
  .group(() => {
    router.post('/addGrade/:postId', [GradesController, 'store']).as('addGrade')
  })
  .use(middleware.auth())
  .prefix('/api/v1/grades')
// categories
router
  .group(() => {
    router.get('/', [CategoriesController, 'index'])
  })
  .use(middleware.auth())
  .prefix('/api/v1/categories')
