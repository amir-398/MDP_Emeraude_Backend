import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
    this.defer(async (db) => {
      await db.table(this.tableName).insert([
        { id: 1, name: 'Category 1', created_at: new Date(), updated_at: new Date() },
        { id: 2, name: 'Category 2', created_at: new Date(), updated_at: new Date() },
        { id: 3, name: 'Category 3', created_at: new Date(), updated_at: new Date() },
        { id: 4, name: 'Category 4', created_at: new Date(), updated_at: new Date() },
        { id: 5, name: 'Category 5', created_at: new Date(), updated_at: new Date() },
        { id: 6, name: 'Category 6', created_at: new Date(), updated_at: new Date() },
      ])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
