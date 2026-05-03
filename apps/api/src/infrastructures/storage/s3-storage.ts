import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { config } from '../../config/env.js'
import {
  ObjectStorage,
  PresignedUploadInput,
  PresignedUploadResult
} from './object-storage.js'

const s3Client = new S3Client({
  region: config.AWS_REGION,
  endpoint: config.S3_ENDPOINT,
  forcePathStyle: config.S3_FORCE_PATH_STYLE,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY
  }
})

export const s3ObjectStorage: ObjectStorage = {
  async createPresignedUploadUrl(
    input: PresignedUploadInput
  ): Promise<PresignedUploadResult> {
    const command = new PutObjectCommand({
      Bucket: config.S3_BUCKET_NAME,
      Key: input.objectKey,
      ContentType: input.mimeType
    })

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: input.expiresInSeconds
    })

    return {
      uploadUrl,
      objectKey: input.objectKey,
      expiresIn: input.expiresInSeconds
    }
  },

  async objectExists(objectKey: string): Promise<boolean> {
    try {
      await s3Client.send(
        new HeadObjectCommand({
          Bucket: config.S3_BUCKET_NAME,
          Key: objectKey
        })
      )

      return true
    } catch (error: any) {
      const statusCode = error?.$metadata?.httpStatusCode

      if (statusCode === 404 || error?.name === 'NotFound') {
        return false
      }

      throw error
    }
  }
}
