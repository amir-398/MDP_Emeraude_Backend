import vine from '@vinejs/vine'
import RoomType from '../enums/room_type.js'

export const publicRoomValidator = vine.compile(
  vine.object({
    name: vine.string().trim().escape().minLength(3).maxLength(255),
    roomType: vine.enum([RoomType.PUBLIC]),
    usersId: vine.array(vine.number().positive()).minLength(1).maxLength(100).optional(),
  })
)

export const privateRoomValidator = vine.compile(
  vine.object({
    name: vine.string().trim().escape().minLength(3).maxLength(255).optional(),
    roomType: vine.enum([RoomType.PRIVATE]),
    usersId: vine.array(vine.number().positive()).minLength(1).maxLength(100),
  })
)

export const roomTypeValidator = vine.compile(
  vine.object({
    roomType: vine.enum([RoomType.PUBLIC, RoomType.PRIVATE]),
  })
)

export const updateRoomNameValidator = vine.compile(
  vine.object({
    name: vine.string().trim().escape().minLength(3).maxLength(255),
  })
)

export const addMemberValidator = vine.compile(
  vine.object({
    userId: vine.number().positive(),
  })
)
