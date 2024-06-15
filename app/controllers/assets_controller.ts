import env from '#start/env'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
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
  /**
   * Get signed url
   */
  async store(file: MultipartFile, bucketKey: string) {
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
}
