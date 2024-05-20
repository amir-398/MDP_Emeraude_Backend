import { BaseSchema } from '@adonisjs/lucid/schema'
import FriendshipStatus from '../../app/enums/frienship_status.js'

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
      table.enu(
        'status',
        [FriendshipStatus.ACCEPTED, FriendshipStatus.PENDING, FriendshipStatus.REJECTED],
        {
          useNative: true,
          existingType: false,
          enumName: 'friendship_status',
        }
      )
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.raw('DROP TYPE IF EXISTS "friendship_status"')
    this.schema.dropTable(this.tableName)
  }
}
