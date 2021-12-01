'use strict'

const fastifyBeeQueue = require('./plugin')
const workerBees = require('./lib/workerBees')

module.exports = {
  workerBees,
  fastifyBeeQueue
}
