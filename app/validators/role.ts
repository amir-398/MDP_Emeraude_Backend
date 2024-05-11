import vine from '@vinejs/vine'

export const userRoleValidator = vine.compile(
  vine.object({
    name: vine.enum(['admin', 'user']),
  })
)
