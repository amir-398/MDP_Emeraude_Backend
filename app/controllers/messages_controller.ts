// import type { HttpContext } from '@adonisjs/core/http'
import { HttpContext } from '@adonisjs/core/http'
export default class MessagesController {
  async store({ request, response }: HttpContext) {}
}

// const client = new Client.Client({
//   user: 'postgres',
//   password: 'sk43subezero',
//   database: 'postgres',
//   host: 'localhost',
//   port: 5432,
// })
// client
//   .connect()
//   .then(() => {
//     console.log('Connected to PostgreSQL database')
//     return response.status(200).json({ message: `Connected to PostgreSQL database` })
//   })
//   .catch((err) => {
//     console.error('Error connecting to PostgreSQL database', err)
//   })
// client.query('LISTEN new_message')
// client.on('notification', (msg) => {
//   console.log('Received notification:', msg.payload)
//   return response.status(200).json({ message: `Notification received ${msg.payload}` })
// })
// // Pour maintenir le script en exécution
// process.on('SIGINT', () => {
//   client.end()
//   process.exit()
// })
