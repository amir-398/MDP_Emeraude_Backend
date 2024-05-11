// import type { HttpContext } from '@adonisjs/core/http'

import Role from '#models/role'
import { userRoleValidator } from '#validators/role'
import { HttpContext } from '@adonisjs/core/http'

export default class RolesController {
  async create({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(userRoleValidator)
      Role.create(payload)
      return response.status(201).json({ message: 'Role created successfully' })
    } catch (error) {
      return response.badRequest({ message: 'Role already exists' })
    }
  }
}
