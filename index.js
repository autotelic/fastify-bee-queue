'use strict'

const fp = require('fastify-plugin')
const Queue = require('bee-queue')

const NAMESPACE_KEY = 'bq'

async function fastifyBeeQueue (fastify, opts) {
  const {
    namespace = NAMESPACE_KEY,
    ...bqOpts
  } = opts

  const queues = {}

  function addToQueuesObject (key, queue) {
    const q = queues[key]
    if (q) throw new Error(`Cannot override existing Queue at key: ${key}`)
    queues[key] = queue
  }

  async function create (name, opts) {
    const q = new Queue(name, {
      ...bqOpts,
      ...opts
    })
    addToQueuesObject(name, q)
    return await q.ready()
  }

  async function createProducer (name, opts) {
    return create(name, {
      isWorker: false,
      getEvents: false,
      ...opts
    })
  }

  fastify.decorate(namespace, {
    create,
    createProducer,
    queues
  })
}

module.exports = fp(fastifyBeeQueue, { name: 'fastify-bee-queue' })
