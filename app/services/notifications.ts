import env from '#start/env'
import emitter from '@adonisjs/core/services/emitter'
import Client from 'pg'

class Notifications {
  private client: Client.Client

  constructor() {
    this.client = new Client.Client({
      user: env.get('DB_USER'),
      password: env.get('DB_PASSWORD'),
      database: env.get('DB_DATABASE'),
      host: env.get('DB_HOST'),
      port: 5432,
      // ssl: true,
    })
  }

  async connect() {
    this.client
      .connect()
      .then(() => {
        console.log('Connected to PostgreSQL databases')
      })
      .catch((err) => {
        console.log('Error connecting to PostgreSQL database', err)
      })

    this.client.query('LISTEN notifications_channel')

    this.client.on('notification', (msg) => {
      emitter.emit('new:notification', msg.payload)
    })
    process.on('SIGINT', () => {
      this.client.end()
      process.exit()
    })
  }
}

export default new Notifications()
