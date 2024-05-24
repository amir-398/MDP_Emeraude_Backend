import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  async up() {
    await this.schema.raw('CREATE EXTENSION IF NOT EXISTS postgis;')

    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').notNullable()
      table.integer('category_id').unsigned().references('id').inTable('categories').notNullable()
      table
        .integer('sub_category_id')
        .unsigned()
        .references('id')
        .inTable('sub_categories')
        .nullable()
      table.string('title', 255).notNullable()
      table.string('price', 255).notNullable()
      table.text('description').notNullable()
      table.string('location', 255).notNullable()
      table.specificType('geoloc', 'geography(Point, 4326)').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}