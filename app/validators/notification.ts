import vine from '@vinejs/vine'
import NotificationType from '../enums/notification_type.js'

export const notificationsValidator = vine.compile(
  vine.object({
    notifiableId: vine.number().withoutDecimals(),
    userId: vine.number().withoutDecimals(),
    type: vine.enum([
      NotificationType.FRIENDSHIP_REQUEST,
      NotificationType.FRIENDSHIP_ACCEPTED,
      NotificationType.FRIENDSHIP_REJECTED,
      NotificationType.MESSAGE,
      NotificationType.LIKE,
      NotificationType.COMMENT,
      NotificationType.SHARE,
      NotificationType.POST,
      NotificationType.GROUP,
      NotificationType.EVENT,
    ]),
  })
)
