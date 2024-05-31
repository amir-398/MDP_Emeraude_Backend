import Roles from '#enums/role'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table
        .enu('role', [Roles.USER, Roles.ADMIN], {
          useNative: true,
          enumName: 'roles',
          existingType: true,
        })
        .defaultTo(Roles.USER)
        .notNullable()
      table.string('firstname', 255).notNullable()
      table.string('lastname', 255).notNullable()
      table.date('birth_date').notNullable()
      table.string('profil_image').notNullable()
      table.text('description').nullable()
      table.string('astrological_sign', 50).nullable()
      table.string('favorite_shows', 255).nullable()
      table.text('center_of_interest').nullable()
      table.text('profession').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }
  async down() {
    this.schema.raw('DROP TYPE IF EXISTS "roles"')
    this.schema.dropTable(this.tableName)
  }
}
