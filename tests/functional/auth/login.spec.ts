import { test } from '@japa/runner'

test.group('Auth login', () => {
  // test for valid credentials
  test('it should login a user successfully', async ({ assert, client }) => {
    const requestData = {
      email: 'amir.398@hotmail.fr',
      password: 'Hicsof30@',
    }
    const response = await client.post('/api/v1/auth/login').json(requestData)
    response.assertStatus(200)
    assert.exists(response.body().token)
    assert.exists(response.body().streamToken)
  })

  // test for invalid credentials
  test('it should not login a user if email or password are wrong', async ({ assert, client }) => {
    const requestData = {
      email: 'amir@hotmail.fr',
      password: 'Hicsof30@',
    }
    const response = await client.post('/api/v1/auth/login').json(requestData)
    response.assertStatus(400)
    assert.equal(response.body().message, 'Invalid user credentials')
  })

  // test for missing credentials
  test('it should not login a user with missing credentials', async ({ assert, client }) => {
    const requestData = {
      email: 'amir@hotmail.fr',
      password: '',
    }
    const response = await client.post('/api/v1/auth/login').json(requestData)
    response.assertStatus(400)
    assert.equal(response.body().message, 'Validation failure')
  })
})
