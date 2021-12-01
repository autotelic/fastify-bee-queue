const Fastify = require('fastify')

const { fastifyBeeQueue } = require('../../')

const { QUEUE_NAME } = require('./constants')

const PORT = process.env.PORT || 3000
const REDIS_CONNECTION_STRING = 'redis://127.0.0.1'

const fastify = Fastify()

// Create a redis client with a single connection using fastify-redis.
fastify.register(require('fastify-redis'), {
  url: REDIS_CONNECTION_STRING,
  closeClient: true
})

// Provide the redis client as an option to our plugin.
fastify.register(fastifyBeeQueue, { redis: fastify.redis })

fastify.register(async (fastify, opts) => {
  // All created queues will used the fastify-redis client. This means our
  // application will use a single connection to register jobs.
  await fastify.bq.createProducer(QUEUE_NAME)
})

fastify.post('/queue', async (request, response) => {
  const { queues } = fastify.bq
  const q = queues[QUEUE_NAME]
  const { body } = request
  const { x, y } = body
  q.createJob({ x: parseInt(x), y: parseInt(y) }).save()
  response.send('Scheduled Job')
})

fastify.listen(PORT)
