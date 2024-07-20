/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import swagger from '#config/swagger'
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import AutoSwagger from 'adonis-autoswagger'
const ChatSteamsController = () => import('#controllers/chat_steams_controller')
const PostsController = () => import('#controllers/posts_controller')
const CategoriesController = () => import('#controllers/categories_controller')
const CommentsController = () => import('#controllers/comments_controller')
const GradesController = () => import('#controllers/grades_controller')
const NotificationsController = () => import('#controllers/notifications_controller')
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
    router.get('/profil/:userId', [UserDataController, 'index']).as('getUserProfil')
    router.post('/search', [UserDataController, 'searchUsers']).as('searchUsers')
    router.put('/update', [UserDataController, 'update']).as('updateUserData')
    router
      .put('/updatePassword', [UserDataController, 'updateUserPassword'])
      .as('updateUserPassword')
    router.delete('/delete', [UserDataController, 'destroy']).as('deleteUserData')
  })

  .use(middleware.auth())
  .prefix('/api/v1/user')

// friends routes
router
  .group(() => {
    router.get('/', [FriendsController, 'getFriends'])
    router.get('/pendingInvitations', [FriendsController, 'getPendingInvitations'])
    router.get('/suggestion', [FriendsController, 'friendsSuggestions'])
    router.put('/acceptInvitation/:friendId', [FriendsController, 'acceptInvitation'])
    router.put('/rejectInvitation/:friendId', [FriendsController, 'rejectInvitation'])
    router.post('/sendInvitation/:userId', [FriendsController, 'sendInvitation'])
  })
  .use(middleware.auth())
  .prefix('/api/v1/friends')

//user rooms routes
// router
//   .group(() => {
//     router.post('/create', [RoomsController, 'create'])
//     router.post('/createGroup', [ChatSteamsController, 'createGroupChannel'])
//     router.get('/rooms', [RoomsController, 'index'])
//     router.get('/rooms/:id', [RoomsController, 'show'])
//     router.put('/:id', [RoomsController, 'update'])
//   })
//   .use(middleware.auth())
//   .prefix('/api/v1/rooms')

// posts & comments
router
  .group(() => {
    router.get('/', [PostsController, 'index']).as('getPosts')
    router.get('/:id', [PostsController, 'show']).as('getPost')
    router.post('/addPost', [PostsController, 'store']).as('storePost')
    router.post('/:postId/addComment', [CommentsController, 'store']).as('addComment')
    router.put('/:postId/updateComment', [CommentsController, 'update']).as('updateComment')
    router.delete('/:postId/deleteComment', [CommentsController, 'destroy']).as('deleteComment')
    router.put('/:id', [PostsController, 'update']).as('updatePost')
    router.delete('/:id', [PostsController, 'destroy']).as('deletePost')
    router.post('/:postId/addGrade', [GradesController, 'store']).as('addGrade')
    router.put('/:postId/updateGrade', [GradesController, 'update']).as('updateGrade')
    router.delete('/:postId/deleteGrade', [GradesController, 'destroy']).as('deleteGrade')
  })
  .use(middleware.auth())
  .prefix('/api/v1/posts')

// categories
router
  .group(() => {
    router.get('/', [CategoriesController, 'index'])
    router.post('/', [CategoriesController, 'store'])
    router.get('/:id', [CategoriesController, 'show'])
    router.put('/:id', [CategoriesController, 'update'])
    router.delete('/:id', [CategoriesController, 'destroy'])
  })
  .use(middleware.auth())
  .prefix('/api/v1/categories')

// notifications
router
  .group(() => {
    router.get('/', [NotificationsController, 'index'])
  })
  .use(middleware.auth())
  .prefix('/api/v1/notifications')

// chat stream
router
  .group(() => {
    router.post('/createGroup', [ChatSteamsController, 'createGroupChannel'])
  })
  .use(middleware.auth())
  .prefix('/api/v1/chat')
// returns swagger in YAML
router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

// Renders Swagger-UI and passes YAML-output of /swagger
router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
  // return AutoSwagger.default.scalar('/swagger', swagger)
  // return AutoSwagger.default.rapidoc('/swagger', swagger)
})
