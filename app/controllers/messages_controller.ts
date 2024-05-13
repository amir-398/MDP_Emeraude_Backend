// import type { HttpContext } from '@adonisjs/core/http'
import Client from 'pg'

export default class MessagesController {
  async notif() {
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
        console.log('Connected to PostgreSQL database')
      })
      .catch((err) => {
        console.error('Error connecting to PostgreSQL database', err)
      })

    client.query('LISTEN new_message')

    client.on('notification', (msg) => {
      console.log('Received notification:', msg.payload)
      // Ici, vous pouvez implémenter la logique pour gérer le message, par exemple en envoyant des données aux clients WebSocket
    })

    // Pour maintenir le script en exécution
    process.on('SIGINT', () => {
      client.end()
      process.exit()
    })
  }
}
