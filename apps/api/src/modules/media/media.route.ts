import { FastifyInstance } from 'fastify'
import { mediaService } from './media.service.js'
import { createMediaSchema } from './media.schema.js'
import { AppError } from '../../common/errors/app.error.js'

export async function mediaRoutes(app: FastifyInstance) {
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
}