import { test } from '@japa/runner'

test.group('User verifications', () => {
  // verify if email exists
  test('it should verify if email exist in db', async ({ assert, client }) => {
    const email = 'amir.398@hotmail.fr'
    const response = await client.post('/api/v1/auth/verifyEmail').json({ email })
    response.assertStatus(200)
    const responseBody = response.body()
    assert.exists(responseBody)
    assert.isTrue(responseBody.isEmailExist)
  })

  // verify if email does not exist
  test('it should return false if email does not exist in db', async ({ assert, client }) => {
    const email = 'nonexistent@example.com'
    const response = await client.post('/api/v1/auth/verifyEmail').json({ email })

    response.assertStatus(200)
    const responseBody = response.body()
    assert.exists(responseBody)
    assert.isFalse(responseBody.isEmailExist)
  })
})
