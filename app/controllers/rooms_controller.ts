// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from '@adonisjs/core/http'

export default class RoomsController {
  async index({ view }) {
    return view.render('rooms/index')
  }

  async create({ request, response, auth }: HttpContext) {
    const user = auth.user
    // get user data with his role

    return user
    const { name, room_type } = request.all()
    return 'lol'
  }

  async store({ request, response }) {
    // Create a new room
  }

  async show({ view }) {
    return view.render('rooms/show')
  }

  async edit({ view }) {
    return view.render('rooms/edit')
  }
  async update({ request, response }) {
    // Update a room
  }
  async destroy({ response }) {
    // Delete a room
  }
}
