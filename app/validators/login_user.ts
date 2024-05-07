import vine from '@vinejs/vine'
export const loginUserValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().escape(),
    password: vine.string().minLength(8).maxLength(32).escape(),
  })
)
