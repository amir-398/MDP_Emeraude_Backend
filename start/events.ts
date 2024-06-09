import app from '@adonisjs/core/services/app'
import emitter from '@adonisjs/core/services/emitter'
import Notifications from '../app/services/notifications.js'
const NotificationListener = () => import('#listeners/notification_listener')
app.ready(() => {
  Notifications.connect()
})

emitter.on('new:notification', [NotificationListener, 'handle'])
