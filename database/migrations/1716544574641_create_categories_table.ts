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
        { id: 1, name: 'Restaurant', created_at: new Date(), updated_at: new Date() },
        { id: 2, name: 'Boutique', created_at: new Date(), updated_at: new Date() },
        { id: 3, name: 'Pâtisserie', created_at: new Date(), updated_at: new Date() },
        { id: 4, name: 'Evènementiel', created_at: new Date(), updated_at: new Date() },
        { id: 5, name: 'Culturel', created_at: new Date(), updated_at: new Date() },
      ])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
