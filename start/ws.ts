import app from '@adonisjs/core/services/app'
import Ws from '../app/services/ws.js'
app.ready(() => {
  Ws.boot()
  const io = Ws.io

  io?.engine.use((req, res, next) => {
    const isHandshake = req._query.sid === undefined
    if (!isHandshake) {
      return next()
    }
    const header = req.headers['authorization']

    console.log('Header:', header)
  })
  io?.on('connection', (socket) => {
    const user = socket.request.user
    console.log('User connected:', user)
  })
})
