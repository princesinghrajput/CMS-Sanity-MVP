import { FastifyInstance } from 'fastify'
import { mediaService } from './media.service.js'
import { createMediaSchema, createPresignedUploadSchema } from './media.schema.js'
import { AppError } from '../../common/errors/app.error.js'

export async function mediaRoutes(app: FastifyInstance) {
  app.post('/media/presigned-upload', async (request, reply) => {
    try {
      const parsed = createPresignedUploadSchema.safeParse(request.body)

      if (!parsed.success) {
        return reply.status(400).send({
          message: 'Invalid request',
          errors: parsed.error.format()
        })
      }

      const body = parsed.data
      const result = await mediaService.createPresignedUpload({
        userId: '11111111-1111-1111-1111-111111111111',
        fileName: body.fileName,
        mimeType: body.mimeType,
        fileSize: body.fileSize
      })

      return reply.status(201).send({
        upload: result.upload,
        media: {
          id: result.media.id,
          status: result.media.status,
          originalKey: result.media.originalKey,
          mimeType: result.media.mimeType,
          fileSize: result.media.fileSize,
          thumbnailKey: result.media.thumbnailKey
        }
      })
    } catch (error: any) {
      request.log.error(error)

      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
          message: error.message
        })
      }

      return reply.status(500).send({
        message: 'Internal Server Error'
      })
    }
  })

  app.post('/media', async (request, reply) => {
    try {
      const parsed = createMediaSchema.safeParse(request.body)

      if (!parsed.success) {
        return reply.status(400).send({
          message: 'Invalid request',
          errors: parsed.error.format()
        })
      }

      const body = parsed.data

      const media = await mediaService.createMedia({
        userId: '11111111-1111-1111-1111-111111111111',
        originalKey: body.originalKey,
        mimeType: body.mimeType,
        fileSize: body.fileSize
      })

      return reply.send({
        id: media.id,
        status: media.status
      })
    } catch (error: any) {
  request.log.error(error)

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      message: error.message
    })
  }

  return reply.status(500).send({
    message: 'Internal Server Error'
  })
}
  })

app.get('/media/:id', async (request, reply) => {
  try {
    const { id } = request.params as { id: string }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

    if (!uuidRegex.test(id)) {
      return reply.status(400).send({
        message: 'Invalid media id'
      })
    }

    const media = await mediaService.getMedia(id)

    return reply.send({
      id: media.id,
      status: media.status,
      originalKey: media.originalKey,
      mimeType: media.mimeType,
      fileSize: media.fileSize,
      thumbnailKey: media.thumbnailKey
    })
  } catch (error: any) {
    request.log.error(error)

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        message: error.message
      })
    }

    return reply.status(500).send({
      message: 'Internal Server Error'
    })
  }
})
}
