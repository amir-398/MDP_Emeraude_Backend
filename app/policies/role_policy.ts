import Roles from '#enums/role'
import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class RolePolicy extends BasePolicy {
  isAdmin(user: User): AuthorizerResponse {
    return user.role === Roles.ADMIN
  }
}
