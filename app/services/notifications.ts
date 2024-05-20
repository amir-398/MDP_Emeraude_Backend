import emitter from '@adonisjs/core/services/emitter'
import Client from 'pg'

class Notifications {
  handle() {
    const client = new Client.Client({
      user: 'postgres',
      password: 'sk43subezero',
      database: 'postgres',
      host: 'localhost',
      port: 5432,
    })

    client
      .connect()
      .then(() => {
        console.log('Connected to PostgreSQL databases')
      })
      .catch((err) => {
        console.log('Error connecting to PostgreSQL database', err)
      })
    client.query('LISTEN watch_notifications')

    client.on('notification', (msg) => {
      emitter.emit('new:notification', msg.payload)
    })
    process.on('SIGINT', () => {
      client.end()
      process.exit()
    })
  }
}

export default new Notifications()
