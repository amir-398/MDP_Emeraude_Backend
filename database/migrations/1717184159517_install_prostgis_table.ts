import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    await this.schema.raw('CREATE EXTENSION IF NOT EXISTS postgis')
  }

  async down() {
    await this.schema.raw('DROP EXTENSION IF EXISTS postgis')
  }
}
