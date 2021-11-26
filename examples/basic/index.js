const Fastify = require('fastify')

const fastifyBeeQueue = require('../../')

const { QUEUE_NAME } = require('./constants')

const LOCAL_CONNECTION = 'redis://127.0.0.1:6379'

const PORT = process.env.PORT || 3000

const fastify = Fastify()

fastify.register(fastifyBeeQueue, {
  redis: LOCAL_CONNECTION
})

fastify.register(async (fastify, opts) => {
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
