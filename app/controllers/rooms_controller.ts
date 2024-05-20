// import type { HttpContext } from '@adonisjs/core/http'

import Room from '#models/room'
import {
  addMemberValidator,
  privateRoomValidator,
  publicRoomValidator,
  roomTypeValidator,
  updateRoomNameValidator,
} from '#validators/room'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import RoomMembersRole from '../enums/room_members_role.js'
import RoomType from '../enums/room_type.js'
import RoomMembersController from './room_members_controller.js'

export default class RoomsController {
  async index({ response }: HttpContext) {
    try {
      const rooms = await Room.query().preload('members').exec()
      return response.status(200).json(rooms)
    } catch (error) {
      console.error('Room fetch failed:', error)
      return response.status(400).json({ message: error || 'An error occurred' })
    }
  }

  async create({ request, response, auth }: HttpContext) {
    const trx = await db.transaction()
    try {
      const RoomMember = new RoomMembersController()
      if (!auth.user) {
        return response.unauthorized('Vous devez être connecté pour accéder à cette ressource')
      }
      const isAdmin = auth.user?.isAdmin
      const { roomType } = await request.validateUsing(roomTypeValidator)
      let payload

      if (roomType === RoomType.PUBLIC && !isAdmin) {
        return response
          .status(403)
          .json({ message: 'Seuls les administrateurs peuvent créer des groupes publics' })
      }
      payload =
        roomType === RoomType.PUBLIC
          ? await request.validateUsing(publicRoomValidator)
          : await request.validateUsing(privateRoomValidator)

      const data = { name: payload.name, roomType: payload.roomType }
      const room = await Room.create(data, { client: trx })
      if (payload.usersId) {
        await Promise.all(
          payload.usersId.map((uid) => RoomMember.create(room.id, RoomMembersRole.MEMBER, uid, trx))
        )
      }

      await RoomMember.create(room.id, RoomMembersRole.ADMIN, auth.user.id, trx)

      await trx.commit()
      return response.status(201).json({ message: 'Room created successfully', roomId: room.id })
    } catch (error) {
      await trx.rollback()
      console.error('Room creation failed:', error)
      return response.status(400).json({ message: error || 'An error occurred' })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const room = await Room.query().where('id', params.id).preload('members').first()
      return response.status(200).json(room)
    } catch (error) {
      console.error('Room fetch failed:', error)
      return response.status(400).json({ message: error || 'An error occurred' })
    }
  }

  async update({ params, request, bouncer, response }: HttpContext) {
    try {
      const room = await Room.findOrFail(params.id)
      if (await bouncer.denies('alterRoom', room)) {
        return response
          .status(403)
          .json({ message: "Vous n'êtes pas autorisé à effectuer cette action" })
      }
      const { name } = await request.validateUsing(updateRoomNameValidator)

      await room.merge({ name }).save()
      return response.status(200).json({ message: 'Room updated successfully' })
    } catch (error) {
      console.error('Room update failed:', error)
      return response.status(400).json({ message: error || 'An error occurred' })
    }
  }

  async addMember({ params, request, bouncer, response }: HttpContext) {
    try {
      const room = await Room.findOrFail(params.id)
      const { userId } = await request.validateUsing(addMemberValidator)
      const RoomMember = new RoomMembersController()
      await RoomMember.create(room.id, RoomMembersRole.MEMBER, userId, db)
      return response.status(200).json({ message: 'Member added successfully' })
    } catch (error) {
      console.error('Member addition failed:', error)
      return response.status(400).json({ message: error || 'An error occurred' })
    }
  }

  async destroy({ params, bouncer, response }: HttpContext) {
    try {
      const room = await Room.findOrFail(params.id)
      if (await bouncer.denies('alterRoom', room)) {
        return response
          .status(403)
          .json({ message: "Vous n'êtes pas autorisé à effectuer cette action" })
      }
      await room.delete()
      return response.status(200).json({ message: 'Room deleted successfully' })
    } catch (error) {
      console.error('Room deletion failed:', error)
      return response.status(400).json({ message: error || 'An error occurred' })
    }
  }
}
