import { BaseSchema } from '@adonisjs/lucid/schema'
import { default as Status } from '../../app/enums/status.js'

export default class extends BaseSchema {
  protected tableName = 'friendships'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id_1')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
      table
        .integer('user_id_2')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
      table.unique(['user_id_1', 'user_id_2'])
      table
        .enu('status', [Status.ACCEPTED, Status.PENDING, Status.REJECTED], {
          useNative: true,
          enumName: 'friendship_status',
          existingType: false,
        })
        .defaultTo(Status.PENDING)
        .notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.raw('DROP TYPE IF EXISTS friendship_status')
    this.schema.dropTable(this.tableName)
  }
}
