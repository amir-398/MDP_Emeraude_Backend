import vine from '@vinejs/vine'

export const registerUserValidator = vine.compile(
  vine.object({
    firstname: vine.string().trim().escape(),
    lastname: vine.string().trim().escape(),
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
      }),
    birthdate: vine.date(),
    password: vine.string().minLength(8).maxLength(32).escape(),
    profilImage: vine.file({ extnames: ['jpg', 'jpeg', 'png', 'webp'], size: '5mb' }),
  })
)
