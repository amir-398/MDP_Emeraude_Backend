import vine from '@vinejs/vine'

export const sendInvitationValidator = vine.compile(
  vine.object({
    userId: vine.number().withoutDecimals(),
  })
)
