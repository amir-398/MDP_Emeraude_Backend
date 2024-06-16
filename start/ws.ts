import app from '@adonisjs/core/services/app'
import Ws from '../app/services/ws.js'

declare module 'http' {
  interface IncomingMessage {
    user?: string
    _query?: any
  }
}

app.ready(() => {
  Ws.boot()
  const io = Ws.io
  // io?.engine.use((req: IncomingMessage, res: ServerResponse, next: any) => {
  //   const isHandshake = req._query.sid === undefined
  //   if (!isHandshake) {
  //     return next()
  //   }
  //   const header = req.headers['userid']
  //   if (!header) {
  //     return res.writeHead(401, 'Unauthorized').end()
  //   }
  //   req.user = header as string
  //   next()
  // })
  io?.on('connection', (socket) => {
    const userId = socket.request.user
    if (!userId) {
      socket.disconnect(true)
      return
    }
    // the user ID is used as a room
    socket.join(`user:${userId}`)
    socket.on('disconnect', () => {
      console.log('User disconnected:', userId)
    })
  })
})
