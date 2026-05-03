import Fastify from 'fastify'
import { config } from './config/env.js'

const app = Fastify({
  logger: true
})

app.get('/health', async () => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV
  }
})

app.get('/', async () => {
  return { message: 'CMS API is running' }
})

async function start() {
  try {
    await app.listen({
      port: config.PORT,
      host: '0.0.0.0'
    })

    app.log.info(
      `Server running on http://localhost:${config.PORT} in ${config.NODE_ENV} mode`
    )
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()