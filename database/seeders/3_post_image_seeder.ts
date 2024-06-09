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
              url: 'gdvuin44mmt6unfoeqoeqxz7.jpg',
              order: 0,
            },
            {
              postId: 1,
              url: 'gdvuin44mmt6unfoeqoeqxz7.jpg',
              order: 1,
            },
            {
              postId: 2,
              url: 'edcj8mzkp5jclqsmzvq32a7i.jpg',
              order: 0,
            },
            {
              postId: 2,
              url: 'gwn5nvky9817sqfz4myv6gcr.jpg',
              order: 1,
            },
            {
              postId: 3,
              url: 'mv6syd7r027bd9z0hb5f712t.jpg',
              order: 0,
            },
            {
              postId: 4,
              url: 'gdvuin44mmt6unfoeqoelxz7.jpg',
              order: 0,
            },
            {
              postId: 5,
              url: 'e1xe3dw81rzfiuyllnqpgpjk.jpg',
              order: 0,
            },
            {
              postId: 6,
              url: 'qj6libidgetgql9n4j6lww5v.jpg',
              order: 0,
            },
            {
              postId: 7,
              url: 'v779rln1qkmxwamwbnevpcyp.jpg',
              order: 0,
            },
            {
              postId: 8,
              url: 'ezfuv9sdhkafaex9kkqhgnsm.jpg',
              order: 0,
            },
            {
              postId: 9,
              url: 'xgmlnw9f68e1racw6y19hxf9.jpg',
              order: 0,
            },
            {
              postId: 10,
              url: 'sufk6anege17fmj49lvadn2l.jpg',
              order: 0,
            },
            {
              postId: 11,
              url: 'twzgwyi0c4vgq5itvnlk0ml6.jpg',
              order: 0,
            },
            {
              postId: 12,
              url: 'e1xe3dw81rzfiuylsnqpgpjk.jpg',
              order: 0,
            },
            {
              postId: 13,
              url: 'dq1lm74oan9uloyppg4fewbq.jpg',
              order: 0,
            },
            {
              postId: 14,
              url: 'aqcfkt1j3o0w011h39y977sk.jpg',
              order: 0,
            },
            // {
            //   postId: 15,
            //   url: 'elhcd86qpn55iq5a0k839efx.jpeg',
            //   order: 0,
            // },
            // {
            //   postId: 16,
            //   url: 'elhcd86qpn55iq5a0k839efx.jpeg',
            //   order: 0,
            // },
            // {
            //   postId: 17,
            //   url: 'wojhcvrr18j9uj2igd9fdq24.jpeg',
            //   order: 0,
            // },
            // {
            //   postId: 18,
            //   url: 'gdvuin44mmt6unfoeqoeqxz7.jpeg',
            //   order: 0,
            // },
            // {
            //   postId: 19,
            //   url: 'edcj8mzkp5jclqsmzvq32a7i.jpeg',
            //   order: 0,
            // },
            // {
            //   postId: 20,
            //   url: 'gwn5nvky9817sqfz4myv6gcr.jpeg',
            //   order: 0,
            // },
            // {
            //   postId: 21,
            //   url: 'mv6syd7r027bd9z0hb5f712t.jpeg',
            //   order: 0,
            // },
            // {
            //   postId: 22,
            //   url: 'gdvuin44mmt6unfoeqoeqxz7.jpeg',
            //   order: 0,
            // },
            // {
            //   postId: 23,
            //   url: 'e1xe3dw81rzfiuyllnqpgpjk.jpeg',
            //   order: 0,
            // },
            // {
            //   postId: 24,
            //   url: 'qj6libidgetgql9n4j6lww5v.jpeg',
            //   order: 0,
            // },
            // {
            //   postId: 25,
            //   url: 'v779rln1qkmxwamwbnevpcyp.jpeg',
            //   order: 0,
            // },
            // {
            //   postId: 26,
            //   url: 'ezfuv9sdhkafaex9kkqhgnsm.jpeg',
            //   order: 0,
            // },
            // {
            //   postId: 27,
            //   url: 'xgmlnw9f68e1racw6y19hxf9.jpeg',
            //   order: 0,
            // },
            // {
            //   postId: 28,
            //   url: 'sufk6anege17fmj49lvadn2l.jpeg',
            //   order: 0,
            // },
            // {
            //   postId: 29,
            //   url: 'twzgwyi0c4vgq5itvnlk0ml6.jpeg',
            //   order: 0,
            // },
            // {
            //   postId: 30,
            //   url: 'e1xe3dw81rzfiuyllnqpgpjk.jpeg',
            //   order: 0,
            // },
            // {
            //   postId: 31,
            //   url: 'dq1lm74oan9uloyppg4fewbq.png',
            //   order: 0,
            // },
            // {
            //   postId: 32,
            //   url: 'aqcfkt1j3o0w011h39y977sk.jpeg',
            //   order: 0,
            // },
            // {
            //   postId: 33,
            //   url: 'elhcd86qpn55iq5a0k839efx.jpeg',
            //   order: 0,
            // },
            // {
            //   postId: 34,
            //   url: 'elhcd86qpn55iq5a0k839efx.jpeg',
            //   order: 0,
            // },
            // {
            //   postId: 35,
            //   url: 'wojhcvrr18j9uj2igd9fdq24.jpeg',
            //   order: 0,
            // },
            // {
            //   postId: 36,
            //   url: 'gdvuin44mmt6unfoeqoeqxz7.jpeg',
            //   order: 0,
            // },
            // {
            //   postId: 37,
            //   url: 'edcj8mzkp5jclqsmzvq32a7i.jpeg',
            //   order: 0,
            // },
            // {
            //   postId: 38,
            //   url: 'gwn5nvky9817sqfz4myv6gcr.jpeg',
            //   order: 0,
            // },
            // {
            //   postId: 39,
            //   url: 'mv6syd7r027bd9z0hb5f712t.jpeg',
            //   order: 0,
            // },
            // {
            //   postId: 40,
            //   url: 'gdvuin44mmt6unfoeqoeqxz7.jpeg',
            //   order: 0,
            // },
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
