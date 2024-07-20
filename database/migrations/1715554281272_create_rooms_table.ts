import RoomType from '#enums/room_type'
import RoomVisibility from '#enums/room_visibility'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rooms'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .enu('room_type', [RoomType.GROUP, RoomType.PRIVATE], {
          useNative: true,
          enumName: 'room_type',
          existingType: true,
        })
        .defaultTo(RoomType.PRIVATE)
        .notNullable()
      table
        .enu('visibility', [RoomVisibility.PUBLIC, RoomVisibility.PRIVATE], {
          useNative: true,
          enumName: 'room_visibility',
          existingType: true,
        })
        .defaultTo(RoomType.PRIVATE)
        .notNullable()
      table.string('name', 50).nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.raw('DROP TYPE IF EXISTS room_type')
    this.schema.raw('DROP TYPE IF EXISTS room_visibility')
    this.schema.dropTable(this.tableName)
  }
}
