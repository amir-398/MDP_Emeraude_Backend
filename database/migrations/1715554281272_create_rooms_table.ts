import { BaseSchema } from '@adonisjs/lucid/schema'
import RoomType from '../../app/enums/room_type.js'

export default class extends BaseSchema {
  protected tableName = 'rooms'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table
        .enu('room_type', ['public', 'private'], {
          useNative: true,
          existingType: true,
          enumName: 'room_type',
        })
        .defaultTo(RoomType.PRIVATE)
        .notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.raw('DROP TYPE IF EXISTS "room_type"')
    this.schema.dropTable(this.tableName)
  }
}
