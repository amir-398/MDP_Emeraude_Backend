import vine from '@vinejs/vine'

export const sendInvitationValidator = vine.compile(
  vine.object({
    receiverId: vine.number().withoutDecimals(),
  })
)
