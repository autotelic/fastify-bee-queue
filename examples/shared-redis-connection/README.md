# Shared Redis Connection

This example shows integration with an existing redis client. In this case,
we configure a redis client with the [fastify-redis plugin]() and provide that
client to fastify-bee-queue. Any generated Queue instances will use the
connection from the already configured redis client. For more detail on this
approach, see the [Bee-Queue documentation](https://github.com/bee-queue/bee-queue#optimizing-redis-connections)
on optimizing redis connections.

## Running

- Ensure you have a local redis instance running. You can start one using the
docker-compose.yml file in the root of this project

  `$ docker compose up`

- start the worker
  `$ node worker.js`

- start the web server in a separate process
  `$ node index.js`

- Schedule a job with an http request:

 `curl -X POST :3000/queue  -H 'Content-Type: application/json' -d '{"x":1, "y":7}'`

You will see the job be consumed by the worker and the sum of x and y will be
logged out to the console of the worker process.
