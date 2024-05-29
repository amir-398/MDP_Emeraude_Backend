import env from '#start/env'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
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
  protected file: MultipartFile | null
  protected bucketKey: string

  constructor(file: MultipartFile | null, profilImageName: string) {
    this.file = file
    this.bucketKey = profilImageName
  }

  async store() {
    const file = this.file
    const stream = createReadStream(file?.tmpPath!)
    const params = {
      Bucket: bucketName || '',
      Key: this.bucketKey,
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

  /**
   * Delete record
   */
  // async destroy({ params }: HttpContext) {}
}
