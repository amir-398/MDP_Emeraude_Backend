import app from '@adonisjs/core/services/app'
import Ws from '../app/services/ws.js'
app.ready(() => {
  Ws.boot()
  const io = Ws.io

  // io?.engine.use((req, res, next) => {
  //   const isHandshake = req._query.sid === undefined
  //   if (!isHandshake) {
  //     return next()
  //   }
  //   const header = req.headers['data']
  //   req.user = header
  //   next()
  // })
  io?.on('connection', (socket) => {
    const userId = socket.request.user
    // the user ID is used as a room
    socket.join(`user:${userId}`)
    console.log('User connected:', userId)
  })
})
