import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sub_categories'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('category_id')
        .unsigned()
        .references('id')
        .inTable('categories')
        .onDelete('CASCADE')
        .notNullable()
      table.string('name', 255).notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.defer(async (db) => {
      await db.table(this.tableName).insert([
        { category_id: 2, name: 'Sub Category 1', created_at: new Date(), updated_at: new Date() },
        { category_id: 3, name: 'Sub Category 2', created_at: new Date(), updated_at: new Date() },
        { category_id: 2, name: 'Sub Category 3', created_at: new Date(), updated_at: new Date() },
        { category_id: 5, name: 'Sub Category 4', created_at: new Date(), updated_at: new Date() },
      ])
    })
  }
  async down() {
    this.schema.dropTable(this.tableName)
  }
}
