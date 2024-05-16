import { BaseSchema } from '@adonisjs/lucid/schema'

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
        .defaultTo('public')
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
