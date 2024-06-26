import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import { test } from '@japa/runner'
import { join } from 'node:path'
test.group('Posts store', (group) => {
  let user: User
  let userNotAdmin: User
  group.each.setup(async () => {
    await db.beginGlobalTransaction()
    const findUser = await User.find(1)
    const findUserNotAdmin = await User.find(2)
    findUser && (user = findUser)
    findUserNotAdmin && (userNotAdmin = findUserNotAdmin)
  })
  group.each.teardown(async () => {
    await db.rollbackGlobalTransaction()
  })
  test('it should store a post', async ({ assert, client }) => {
    const postData = {
      title: 'Restaurant Le Jules Verne',
      categoryId: 1,
      price: 120,
      description:
        "Dînez dans ce restaurant gastronomique avec une vue imprenable sur Paris, situé au deuxième étage de la Tour Eiffel. Profitez d'une cuisine raffinée et innovante, créée par des chefs de renom, tout en admirant la ville lumière.",
      location: 'Tour Eiffel, 2nd floor, Avenue Gustave Eiffel, 75007 Paris, France',
      geoloc: 'POINT(2.294844 48.857739)',
      latitude: 48.857739,
      longitude: 2.294844,
    }
    const response = await client
      .post('/api/v1/posts/addPost')
      .file('images', join('./', './tests/assets', 'image.webp'))
      .file('images', join('./', './tests/assets', 'image.webp'))
      .fields(postData)
      .loginAs(user)

    response.assertStatus(201)
    assert.exists(response.body().message)
    assert.equal(response.body().message, 'post created')
  })

  // store a post with invalid data
  test('it should not store a post with invalid data', async ({ assert, client }) => {
    const postData = {
      title: 'Restaurant Le Jules Verne',
      categoryId: 1,
      price: 120,
      description:
        "Dînez dans ce restaurant gastronomique avec une vue imprenable sur Paris, situé au deuxième étage de la Tour Eiffel. Profitez d'une cuisine raffinée et innovante, créée par des chefs de renom, tout en admirant la ville lumière.",
      location: 'Tour Eiffel, 2nd floor, Avenue Gustave Eiffel, 75007 Paris, France',
      geoloc: 'POINT(2.294844 48.857739)',
      latitude: 48.857739,
      longitude: 2.294844,
    }
    const response = await client
      .post('/api/v1/posts/addPost')
      .file('images', join('./', './tests/assets', 'image.webp'))
      .fields(postData)
      .loginAs(user)

    response.assertStatus(400)
    assert.exists(response.body().message)
    assert.equal(response.body().message, 'Validation failure')
  })

  // store a post without being an admin
  test('it should not store a post without being an admin', async ({ assert, client }) => {
    const postData = {
      title: 'Restaurant Le Jules Verne',
      categoryId: 1,
      price: 120,
      description:
        "Dînez dans ce restaurant gastronomique avec une vue imprenable sur Paris, situé au deuxième étage de la Tour Eiffel. Profitez d'une cuisine raffinée et innovante, créée par des chefs de renom, tout en admirant la ville lumière.",
      location: 'Tour Eiffel, 2nd floor, Avenue Gustave Eiffel, 75007 Paris, France',
      geoloc: 'POINT(2.294844 48.857739)',
      latitude: 48.857739,
      longitude: 2.294844,
    }
    const response = await client
      .post('/api/v1/posts/addPost')
      .file('images', join('./', './tests/assets', 'image.webp'))
      .fields(postData)
      .loginAs(userNotAdmin)

    response.assertStatus(400)
    assert.exists(response.body().message)
    assert.equal(response.body().message, "You don't have the rights to perform this action")
  })
})
