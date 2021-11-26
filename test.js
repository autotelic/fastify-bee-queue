'use strict'

const test = require('ava')

const Queue = require('bee-queue')
const plugin = require('./')

const TEST_QUEUE_NAME = 'test-queue'

test('"create" creates a worker Queue instance', async (t) => {
  const app = require('fastify')()
  app.register(plugin)
  await app.ready()

  const q = await app.bq.create(TEST_QUEUE_NAME)
  t.true(q instanceof Queue)
  t.true(q.settings.isWorker)
  t.true(q.settings.getEvents)
})

test('createProducer creates a producer Queue instance', async (t) => {
  const app = require('fastify')()
  app.register(plugin)
  await app.ready()

  const q = await app.bq.createProducer(TEST_QUEUE_NAME)
  t.true(q instanceof Queue)
  t.false(q.settings.isWorker)
  t.false(q.settings.getEvents)
})

test('"createProducer" registers Queue instances in the queues object', async (t) => {
  const app = require('fastify')()
  app.register(plugin)
  await app.ready()

  await app.bq.createProducer(TEST_QUEUE_NAME)
  const q = app.bq.queues[TEST_QUEUE_NAME]

  t.true(q instanceof Queue)
  t.false(q.settings.isWorker)
  t.false(q.settings.getEvents)
})

test('"create" registers Queue instances in the queues object', async (t) => {
  const app = require('fastify')()
  app.register(plugin)
  await app.ready()

  await app.bq.create(TEST_QUEUE_NAME)
  const q = app.bq.queues[TEST_QUEUE_NAME]

  t.true(q instanceof Queue)
  t.true(q.settings.isWorker)
  t.true(q.settings.getEvents)
})

test('"create": Cannot override existing stored Queues in the queues decorator', async (t) => {
  const app = require('fastify')()
  app.register(plugin)
  await app.ready()

  await app.bq.create(TEST_QUEUE_NAME)
  const expected = `Cannot override existing Queue at key: ${TEST_QUEUE_NAME}`
  const error = await t.throwsAsync(app.bq.create(TEST_QUEUE_NAME))
  t.is(error.message, expected)
})

test('"createProducer": Cannot override existing stored Queues in the queues decorator', async (t) => {
  const app = require('fastify')()
  app.register(plugin)
  await app.ready()

  await app.bq.createProducer(TEST_QUEUE_NAME)
  const expected = `Cannot override existing Queue at key: ${TEST_QUEUE_NAME}`
  const error = await t.throwsAsync(app.bq.createProducer(TEST_QUEUE_NAME))
  t.is(error.message, expected)
})
