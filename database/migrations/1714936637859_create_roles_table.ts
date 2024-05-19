import { BaseSchema } from '@adonisjs/lucid/schema'
import Roles from '../../app/enums/role.js'

export default class extends BaseSchema {
  protected tableName = 'roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable()
      table.string('name', 50).notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.defer(async (db) => {
      await db.table(this.tableName).multiInsert([
        { id: Roles.USER, name: 'user', created_at: new Date(), updated_at: new Date() },
        { id: Roles.ADMIN, name: 'admin', created_at: new Date(), updated_at: new Date() },
      ])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
