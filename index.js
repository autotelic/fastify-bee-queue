'use strict'

const fastifyBeeQueue = require('./plugin')
const workerBees = require('./lib/worker-bee')

module.exports = {
  workerBees,
  fastifyBeeQueue
}
