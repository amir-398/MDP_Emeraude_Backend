import { BaseSchema } from '@adonisjs/lucid/schema'
import db from '@adonisjs/lucid/services/db'

export default class CreateFriendNotificationTriggers extends BaseSchema {
  async up() {
    db.raw(`
      CREATE OR REPLACE FUNCTION notify_new_invitation()
      RETURNS TRIGGER AS $$
      BEGIN
        PERFORM pg_notify('new_invitation', row_to_json(NEW)::text);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `)

    db.raw(`
      CREATE TRIGGER after_friendship_insert
      AFTER INSERT ON  friendships
      FOR EACH ROW EXECUTE FUNCTION notify_new_invitation();
    `)
  }

  async down() {
    db.raw('DROP TRIGGER IF EXISTS after_friend_insert ON friendships')
    db.raw('DROP FUNCTION IF EXISTS notify_new_invitation')
  }
}
