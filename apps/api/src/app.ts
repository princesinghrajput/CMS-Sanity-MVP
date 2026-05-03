import Fastify from 'fastify'

const app = Fastify({
  logger: true
})

app.get('/health', async () => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString()
  }
})

async function start() {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' })
    app.log.info('Server running on http://localhost:3000')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()