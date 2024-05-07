import vine from '@vinejs/vine'

export const userProfilImageValidator = vine.compile(
  vine.object({
    profil_image: vine.file({ extnames: ['jpg', 'jpeg', 'png', 'webp'], size: '5mb' }),
  })
)
