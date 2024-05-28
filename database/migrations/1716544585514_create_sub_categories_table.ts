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
        { id: 1, category_id: 4, name: 'Soirée', created_at: new Date(), updated_at: new Date() },
        { id: 2, category_id: 4, name: 'Festival', created_at: new Date(), updated_at: new Date() },
        { id: 3, category_id: 4, name: 'Carnaval', created_at: new Date(), updated_at: new Date() },
        { id: 4, category_id: 4, name: 'Atelier', created_at: new Date(), updated_at: new Date() },
      ])
    })
  }
  async down() {
    this.schema.dropTable(this.tableName)
  }
}
