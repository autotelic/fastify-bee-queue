'use strict'

const Queue = require('bee-queue')

async function createWorkerBee ({ name, processor, opts = {} }) {
  const queue = new Queue(name, opts)
  await queue.ready()
  queue.process(processor)
  return queue
}

function workerBees ({ workers, queueOptions = {} }) {
  const start = async () => Promise.all(workers.map(worker => {
    const { name, processor, options } = worker
    return createWorkerBee({ name, processor, opts: { ...queueOptions, ...options } })
  }))

  return {
    start
  }
}

module.exports = workerBees
