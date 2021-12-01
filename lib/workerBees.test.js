'use strict'

const test = require('ava')
const sinon = require('sinon')
const Queue = require('bee-queue')
const crypto = require('crypto')

const workerBees = require('./workerBees')

async function addJob (queueName) {
  const q = new Queue(queueName, { isWorker: false })
  const job = q.createJob({ x: 2, y: 3 })
  await job.save()

  const promise = new Promise((resolve, reject) => {
    job.on('succeeded', resolve)
  })

  return {
    job,
    promise
  }
}

test('Workers will process Jobs added to a Queue', async (t) => {
  const expected = 5
  const processor = sinon.stub().resolves(expected)

  const QUEUE_NAME = generateQueueName()
  const workers = [
    {
      name: QUEUE_NAME,
      processor,
      options: {}
    }
  ]

  const { start } = workerBees({ workers })
  const { job, promise } = await addJob(QUEUE_NAME)
  await start()
  const actual = await promise
  t.is(expected, actual)
  t.true(processor.calledOnce)
  t.is(job.id, processor.firstCall.args[0].id)
  t.deepEqual(job.data, processor.firstCall.args[0].data)
})

test('Workers will process multiple Jobs added to a Queue', async (t) => {
  const expected = 5
  const processor = sinon.stub().resolves(expected)
  const QUEUE_NAME = generateQueueName()
  const workers = [
    {
      name: QUEUE_NAME,
      processor,
      options: {}
    }
  ]

  const { start } = workerBees({ workers })
  await start()
  const { job, promise } = await addJob(QUEUE_NAME)
  const actual = await promise
  t.is(expected, actual)
  t.is(job.id, processor.firstCall.args[0].id)
  t.deepEqual(job.data, processor.firstCall.args[0].data)

  const { job: job2, promise: promise2 } = await addJob(QUEUE_NAME)
  const actual2 = await promise2
  t.is(expected, actual2)
  t.is(job2.id, processor.secondCall.args[0].id)
  t.deepEqual(job2.data, processor.secondCall.args[0].data)
})

test('Each Queue will receive the shared configuration object', async (t) => {
  const expected = 5
  const processor = sinon.stub().resolves(expected)
  const QUEUE_NAME = generateQueueName()
  const SECOND_QUEUE_NAME = generateQueueName()
  const workers = [
    {
      name: QUEUE_NAME,
      processor
    },
    {
      name: SECOND_QUEUE_NAME,
      processor
    }
  ]

  const options = { prefix: 'new-bq-prefix' }
  const expected1 = `${options.prefix}:${QUEUE_NAME}:`
  const expected2 = `${options.prefix}:${SECOND_QUEUE_NAME}:`

  const { start } = workerBees({ workers, queueOptions: options })
  const queues = await start()

  const [queue1, queue2] = queues

  t.is(expected1, queue1.settings.keyPrefix)
  t.is(expected2, queue2.settings.keyPrefix)
})

test('Each Queue instance can override the receive the shared configuration object', async (t) => {
  const expected = 5
  const processor = sinon.stub().resolves(expected)
  const QUEUE_NAME = generateQueueName()
  const SECOND_QUEUE_NAME = generateQueueName()
  const options = { prefix: 'new-bq-prefix' }
  const options2 = { prefix: 'extra-new-bq-prefix' }

  const workers = [
    {
      name: QUEUE_NAME,
      processor
    },
    {
      name: SECOND_QUEUE_NAME,
      processor,
      options: options2
    }
  ]

  const expected1 = `${options.prefix}:${QUEUE_NAME}:`
  const expected2 = `${options2.prefix}:${SECOND_QUEUE_NAME}:`

  const { start } = workerBees({ workers, queueOptions: options })
  const queues = await start()

  const [queue1, queue2] = queues

  t.is(expected1, queue1.settings.keyPrefix)
  t.is(expected2, queue2.settings.keyPrefix)
})

// As the tests are run concurrently, we need to generate random queue names to
// ensure that jobs scheduled in one test is consumed by a worker in another test
function generateQueueName () {
  return `test-queue-${crypto.randomUUID()}`
}
