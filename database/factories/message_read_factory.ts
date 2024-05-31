import factory from '@adonisjs/lucid/factories'
import MessageRead from '#models/message_read'

export const MessageReadFactory = factory
  .define(MessageRead, async ({ faker }) => {
    return {}
  })
  .build()