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
      .toLowerCase()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        if (user) {
          throw new Error('Email already exists')
        }
        return !user
      }),
    birthDate: vine.date(),
    password: vine.string().minLength(8).maxLength(32).escape(),
    profilImage: vine.file({ extnames: ['jpg', 'jpeg', 'png', 'webp'], size: '5mb' }),
  })
)

export const loginUserValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().escape().toLowerCase(),
    password: vine.string().minLength(8).maxLength(32).escape(),
  })
)

export const userEmailValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().escape().toLowerCase(),
  })
)