import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'room_members'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('room_id').unsigned().references('id').inTable('rooms').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').notNullable()
      table
        .enum('role', ['member', 'moderator', 'admin'], {
          useNative: true,
          existingType: true,
          enumName: 'room_members_role',
        })
        .defaultTo('member')
        .notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.raw('DROP TYPE IF EXISTS "room_members_role"')
    this.schema.dropTable(this.tableName)
  }
}
