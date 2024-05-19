import { BaseSchema } from '@adonisjs/lucid/schema'
import Roles from '../../app/enums/role.js'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('role_id')
        .unsigned()
        .references('id')
        .inTable('roles')
        .notNullable()
        .defaultTo(Roles.USER)
      table.string('firstname').notNullable()
      table.string('lastname').notNullable()
      table.string('birthdate').notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.string('profil_image_name').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }
  async down() {
    this.schema.dropTable(this.tableName)
  }
}
