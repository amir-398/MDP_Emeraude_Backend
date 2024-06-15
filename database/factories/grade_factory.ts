import factory from '@adonisjs/lucid/factories'
import Grade from '#models/grade'

export const GradeFactory = factory
  .define(Grade, async ({ faker }) => {
    return {}
  })
  .build()