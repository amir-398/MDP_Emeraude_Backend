import factory from '@adonisjs/lucid/factories'
import Message from '#models/message'

export const MessageFactory = factory
  .define(Message, async ({ faker }) => {
    return {}
  })
  .build()