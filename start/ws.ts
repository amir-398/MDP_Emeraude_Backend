import app from '@adonisjs/core/services/app'
import Ws from '../app/services/ws.js'
app.ready(() => {
  console.log('App is ready')

  Ws.boot()
  const io = Ws.io

  io?.on('connection', (socket) => {
    console.log(socket.id)
  })
})
