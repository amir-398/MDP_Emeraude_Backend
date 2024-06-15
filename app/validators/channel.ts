import vine from '@vinejs/vine'

export const createGroupChannelValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    image: vine.file({ extnames: ['jpg', 'jpeg', 'png', 'webp'], size: '5mb' }),
  })
)
