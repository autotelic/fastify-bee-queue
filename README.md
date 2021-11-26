# fastify-bee-queue

A plugin for implementing [Bee Queue](https://github.com/bee-queue/bee-queue)
job/task queues in fastify applications.

## Install

```
npm i @autotelic/fastify-bee-queue
```

## Usage

```js
// Server.js
const Fastify = require('fastify')
const fastifyBeeQueue = require('@autotelic/fastify-bee-queue')
const fastify = Fastify()

const QUEUE_NAME = 'some-queue-name'

fastify.register(fastifyBeeQueue, {
  redis: 'redis://127.0.0.1',
})

fastify.register(async (fastify, opts) => {
  // Create a Queue instance. By default each Queue will create a connection
  // to redis.
  await fastify.bq.createProducer(QUEUE_NAME)
})

fastify.post('/queue', async (request, response) => {
  const { queues } = fastify.bq
  // Access the Queue Instance
  const q = queues[QUEUE_NAME]
  const { body } = request
  const { x, y } = body
  // Create and save a Job in the Queue.
  q.createJob({ x: parseInt(x), y: parseInt(y) }).save()
  response.send('Scheduled Job')
})

fastify.listen(3000)

// worker.js
const QUEUE_NAME = 'some-queue-name'
const Queue = require('bee-queue')
// Create a worker queue instance to access jobs created by the Queue on the
// web server.
const queue = new Queue(QUEUE_NAME, { redis: 'redis://127.0.0.1' })

queue.on('ready', () => {
  // Process the Job
  queue.process((job, done) => {
      const result = job.data.x + job.data.y
      done(null, result)
  })
})
```

## API

### Options

- `namespace`: The namespace that thee plugin decorators will be added to.
Defaults to `bq`

All remaining options will be passed to the Queue instances when they are created.
For more details please refer to the Bee Queue [settings documentation](https://github.com/bee-queue/bee-queue#settings)

### Decorators

The plugin exposes the following as decorators under the configured namespace.
By default this namespace is `bq`

#### `createProducer: (name: string, opts: Object)`

creates a "Producer" Queue instance. producer Queues are unable to process jobs or
receive messages. They are primarily used to add jobs to a Queue.

`name`: The name of the Queue instance. This is also the lookup key in the queues
object.

`opts`: The Queue instance settings.

#### `create: (name: string, opts: Object)`

Creates a worker Queue instance. This queue can process jobs and send/receive messages.

`name`: The name of the Queue instance. This is also the lookup key in the queues
object.

`opts`: The Queue instance settings.

#### `queues: Object`

The key/value store where all created Queue instances are stored. They may be accessed by queue name. The plugin will throw an error if duplicate keys are added
to the queues object.

## Github Actions/Workflows

#### Triggering a Release

* Trigger the release workflow via release tag
  ```sh
  git checkout main && git pull
  npm version { minor | major | path }
  git push --follow-tags
  ```

## License

This project is covered under the [MIT](./LICENSE) license.
