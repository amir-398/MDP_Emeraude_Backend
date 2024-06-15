import PostImage from '#models/post_image'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { cuid } from '@adonisjs/core/helpers'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'
import AssetsController from './assets_controller.js'

export default class PostImagesController {
  async store(postId: number, images: MultipartFile[], trx: TransactionClientContract) {
    try {
      // Utiliser Promise.all pour attendre toutes les opérations asynchrones
      await Promise.all(
        images.map(async (image, index) => {
          const imageId = `${cuid()}.${image.subtype}`
          const bucketKey = `postImages/${imageId}`
          try {
            const uploadImageController = new AssetsController()
            await uploadImageController.store(image, bucketKey)
          } catch (error) {
            throw new Error(error.message) // Ne pas rollback ici, gérer la transaction dans le contrôleur principal
          }
          await PostImage.create({ postId, url: imageId, order: index }, { client: trx })
        })
      )
    } catch (error) {
      throw new Error(error.message) // Ne pas rollback ici, gérer la transaction dans le contrôleur principal
    }
  }

  async destroy(postId: number) {
    try {
      const images = await PostImage.query().where('postId', postId).select('url')
      await Promise.all(
        images.map(async (image) => {
          const deleteImageController = new AssetsController()
          await deleteImageController.destroy(image.url)
        })
      )
      await PostImage.query().where('postId', postId).delete()
    } catch (error) {
      throw new Error(error.message) // Ne pas rollback ici, gérer la transaction dans le contrôleur principal
    }
  }
}
