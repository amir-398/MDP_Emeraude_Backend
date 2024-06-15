import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.raw(`
      CREATE OR REPLACE FUNCTION notify_changes()
      RETURNS TRIGGER AS $$
      BEGIN
          PERFORM pg_notify('notifications_channel', row_to_json(NEW)::text);
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER notify_changes_trigger
      AFTER INSERT OR UPDATE OR DELETE ON notifications
      FOR EACH ROW EXECUTE FUNCTION notify_changes();
    `)
  }

  async down() {
    this.schema.raw(`
      DROP TRIGGER IF EXISTS notify_changes_trigger ON notifications;
      DROP FUNCTION IF EXISTS notify_changes;
    `)
  }
}
