import { FastifyInstance } from 'fastify'
import { mediaService } from './media.service.js'
import { createMediaSchema } from './media.schema.js'

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

      return reply.status(500).send({
        message: 'Internal Server Error'
      })
    }
  })
}