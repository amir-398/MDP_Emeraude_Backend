import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'conversations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id_1').unsigned().references('id').inTable('users').notNullable()
      table.integer('user_id_2').unsigned().references('id').inTable('users').notNullable()
      table.unique(['user_id_1', 'user_id_2'])
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}