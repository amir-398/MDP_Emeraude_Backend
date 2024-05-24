import Roles from '#enums/role'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'profiles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
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
      table.date('birthdate').notNullable()
      table.string('profil_image').notNullable()
      table.text('description').nullable()
      table.string('astrological_sign', 50).nullable()
      table.string('favorite_shows', 255).nullable()
      table.text('center_of_interest').nullable()
      table.text('profession').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.raw('DROP TYPE IF EXISTS "roles"')
    this.schema.dropTable(this.tableName)
  }
}
