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
const { fastifyBeeQueue } = require('@autotelic/fastify-bee-queue')
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

// The workerBees function provides a convenience wrapper for creating
// and configuring Queue instances which will process jobs.
const { workerBees } = require('@autotelic/fastify-bee-queue')
const QUEUE_NAME = 'some-queue-name'

// The worker Queue instances to be created.
const workers = [
  {
    name: QUEUE_NAME,
    processor: async (job) => job.data.x + job.data.y,
    options: {}
  }
]

// Base configuration applied to all worker Queues.
const queueOptions = {
  redis: 'redis://127.0.0.1',
}

const { start } = workerBees({ workers, queueOptions })

// Start the workers and begin processing jobs. Start also returns a promise
// which resolves to an array of the running worker Queues.
const queues = await start()
```
## Examples

We provide the following usage examples and recipes:
- [basic](./examples/basic/README.md)
- [shared redis connection](./examples/shared-redis-connection/README.md)
- [optimizing concurrency](./examples/optimizing-concurrency/README.md)

## API

### Plugin

#### Options

- `namespace`: The namespace that the plugin decorators will be added to.
Defaults to `bq`

All remaining options will be passed to the Queue instances when they are created.
For more details please refer to the Bee Queue [settings documentation](https://github.com/bee-queue/bee-queue#settings)

#### Decorators

The plugin exposes the following as decorators under the configured namespace.
By default this namespace is `bq`

##### `createProducer: (name: string, opts: Object)`

creates a "Producer" Queue instance. producer Queues are unable to process jobs or
receive messages. They are primarily used to add jobs to a Queue.

`name`: The name of the Queue instance. This is also the lookup key in the queues
object.

`opts`: The Queue instance settings.

##### `create: (name: string, opts: Object)`

Creates a worker Queue instance. This queue can process jobs and send/receive messages.

`name`: The name of the Queue instance. This is also the lookup key in the queues
object.

`opts`: The Queue instance settings.

##### `queues: Object`

The key/value store where all created Queue instances are stored. They may be accessed by queue name. The plugin will throw an error if duplicate keys are added
to the queues object.

### Workers

Utilities for creating bee-queue workers.

#### `workerBees: (configuration: Object) => Object<{ start: () => Promise<Array[Queues]> }>`

Creates and starts bee-queue workers for processing jobs.

- `configuration` The configuration object for worker bees, expects fields:
  - `queueOptions`: The Queue [settings](https://github.com/bee-queue/bee-queue#settings)) which will be applied to all worker Queues.
  - `workers: Object` - A worker configuration Object which contains fields:
    - `name: string` - The Name of the queue
    - `processor: () => Promise<Any>` - An async method to process jobs from the queue.
    - `options: Object` - The Queue settings which will be applied only to this worker Queue.


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
