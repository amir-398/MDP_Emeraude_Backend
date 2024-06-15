import factory from '@adonisjs/lucid/factories'
import Participant from '#models/participant'

export const ParticipantFactory = factory
  .define(Participant, async ({ faker }) => {
    return {}
  })
  .build()