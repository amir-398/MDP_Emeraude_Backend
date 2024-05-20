import { BaseSchema } from '@adonisjs/lucid/schema'
import db from '@adonisjs/lucid/services/db'

export default class CreateNotificationTrigger extends BaseSchema {
  protected tableName = 'notifications'
  async up() {
    // Création de la fonction qui envoie une notification
    db.raw(`
      CREATE OR REPLACE FUNCTION notify_on_new_notification()
      RETURNS TRIGGER AS $$
      BEGIN
        PERFORM pg_notify('new_notification', 'New notification created with ID: ' || NEW.id);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `)

    // Création du trigger qui appelle la fonction ci-dessus
    db.raw(`
      CREATE TRIGGER notification_trigger
      AFTER INSERT ON notifications
      FOR EACH ROW
      EXECUTE FUNCTION notify_on_new_notification();
    `)
  }

  async down() {
    // Supprimer le trigger
    db.raw('DROP TRIGGER IF EXISTS notification_trigger ON notifications')

    // Supprimer la fonction
    db.raw('DROP FUNCTION IF EXISTS notify_on_new_notification')
  }
}
