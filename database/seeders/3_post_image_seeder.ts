import PostImage from '#models/post_image'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    const trx = await db.transaction()
    try {
      await Promise.all([
        PostImage.createMany(
          [
            {
              postId: 1,
              url: 'wojhcvrr18j9uj2igd9fdq24.jpeg',
              order: 0,
            },
            {
              postId: 1,
              url: 'gdvuin44mmt6unfoeqoeqxz7.jpeg',
              order: 1,
            },
            {
              postId: 2,
              url: 'edcj8mzkp5jclqsmzvq32a7i.jpeg',
              order: 0,
            },
            {
              postId: 2,
              url: 'gwn5nvky9817sqfz4myv6gcr.jpeg',
              order: 1,
            },
            {
              postId: 2,
              url: 'mv6syd7r027bd9z0hb5f712t.jpeg',
              order: 2,
            },
            {
              postId: 2,
              url: 'gdvuin44mmt6unfoeqoeqxz7.jpeg',
              order: 3,
            },
            {
              postId: 3,
              url: 'e1xe3dw81rzfiuyllnqpgpjk.jpeg',
              order: 0,
            },
            {
              postId: 3,
              url: 'qj6libidgetgql9n4j6lww5v.jpeg',
              order: 1,
            },
            {
              postId: 4,
              url: 'v779rln1qkmxwamwbnevpcyp.jpeg',
              order: 0,
            },
            {
              postId: 4,
              url: 'ezfuv9sdhkafaex9kkqhgnsm.jpeg',
              order: 1,
            },
            {
              postId: 4,
              url: 'xgmlnw9f68e1racw6y19hxf9.jpeg',
              order: 2,
            },
            {
              postId: 5,
              url: 'sufk6anege17fmj49lvadn2l.jpeg',
              order: 0,
            },
            {
              postId: 5,
              url: 'twzgwyi0c4vgq5itvnlk0ml6.jpeg',
              order: 1,
            },
            {
              postId: 6,
              url: 'e1xe3dw81rzfiuyllnqpgpjk.jpeg',
              order: 0,
            },
            {
              postId: 7,
              url: 'dq1lm74oan9uloyppg4fewbq.png',
              order: 0,
            },
            {
              postId: 8,
              url: 'aqcfkt1j3o0w011h39y977sk.jpeg',
              order: 0,
            },
            {
              postId: 9,
              url: 'elhcd86qpn55iq5a0k839efx.jpeg',
              order: 0,
            },
            {
              postId: 9,
              url: 'elhcd86qpn55iq5a0k839efx.jpeg',
              order: 1,
            },
          ],
          { client: trx }
        ),
      ])
      await trx.commit()
    } catch (error) {
      console.error(error)
      trx.rollback()
    }
  }
}
