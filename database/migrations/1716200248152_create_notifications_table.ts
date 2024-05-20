import { BaseSchema } from '@adonisjs/lucid/schema'
import NotificationType from '../../app/enums/notification_type.js'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
      table.integer('notifiable_id').unsigned().notNullable()
      table
        .enu(
          'type',
          [
            NotificationType.FRIENDSHIP_ACCEPTED,
            NotificationType.FRIENDSHIP_REJECTED,
            NotificationType.FRIENDSHIP_REQUEST,
          ],
          { useNative: true, enumName: 'notification_type', existingType: true }
        )
        .notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.raw('DROP TYPE IF EXISTS "notification_type"')
    this.schema.dropTable(this.tableName)
  }
}
