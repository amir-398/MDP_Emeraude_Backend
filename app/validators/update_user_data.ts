import vine from '@vinejs/vine'

export const updateUserValidator = vine.compile(
  vine.object({
    firstname: vine.string().trim().escape().optional(),
    lastname: vine.string().trim().escape().optional(),
    email: vine
      .string()
      .email()
      .trim()
      .escape()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        if (user) {
          throw new Error('Email already exists')
        }
        return !user
      })
      .optional(),
    birthdate: vine.date().optional(),
  })
)

export const updateUserPasswordValidator = vine.compile(
  vine.object({
    oldPassword: vine.string().minLength(8).maxLength(32).escape(),
    newPassword: vine.string().minLength(8).maxLength(32).escape(),
  })
)
