import vine from '@vinejs/vine'

export const userProfilImageValidator = vine.compile(
  vine.object({
    image: vine.file({ extnames: ['jpg', 'jpeg', 'png', 'webp'], size: '5mb' }),
  })
)
