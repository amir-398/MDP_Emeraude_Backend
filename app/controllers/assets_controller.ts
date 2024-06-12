import env from '#start/env'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { HttpContext } from '@adonisjs/core/http'
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createReadStream } from 'node:fs'
const accessKeyId: string | undefined = env.get('BUCKET_ACCESS_KEY_ID')
const secretAccessKey: string | undefined = env.get('BUCKET_SECRET_ACCESS_KEY')
const bucketName: string | undefined = env.get('BUCKET_NAME')
// init s3 client
const client = new S3Client({
  credentials: {
    accessKeyId: accessKeyId || '',
    secretAccessKey: secretAccessKey || '',
  },
  region: env.get('BUCKET_REGION') || '',
})

export default class AssetsController {
  async store(file: MultipartFile | null, bucketKey: string) {
    const stream = createReadStream(file?.tmpPath!)
    const params = {
      Bucket: bucketName || '',
      Key: bucketKey,
      Body: stream,
    }
    const command = new PutObjectCommand(params)

    try {
      await client.send(command)
    } catch (err) {
      throw err.message
    }
  }

  /**
   * Display form to create a new record
   */
  async create(bucketUrl: string) {
    try {
      const getObjectParams = {
        Bucket: bucketName || '',
        Key: bucketUrl,
      }
      const command = new GetObjectCommand(getObjectParams)
      const url = await getSignedUrl(client, command, { expiresIn: 100000 })
      return url
    } catch (err) {
      throw err.message
    }
  }

  async createPresignedUrl({ request, response }: HttpContext) {
    try {
      const { bucketUrl } = request.all()

      const getObjectParams = {
        Bucket: bucketName || '',
        Key: bucketUrl,
      }
      const command = new GetObjectCommand(getObjectParams)
      const url = await getSignedUrl(client, command, { expiresIn: 100000 })
      return response.ok({ url })
    } catch (err) {
      return response.badRequest({ message: err.message })
    }
  }

  /**
   * Delete record
   */
  async destroy(bucketUrl: string) {
    const params = {
      Bucket: bucketName || '',
      Key: bucketUrl,
    }
    try {
      const command = new DeleteObjectCommand(params)
      await client.send(command)
    } catch (err) {
      throw err.message
    }
  }
  /**
   * Show individual record
   */
  // async show({ params }: HttpContext) {}

  /**
   * Edit individual record
   */
  // async edit({ params }: HttpContext) {}

  /**
   * Handle form submission for the edit action
   */
  // async update({ params, request }: HttpContext) {}
}
