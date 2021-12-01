# Basic

Basic usage example where a producer Queue is created and used to create jobs.
With this configuration a redis connection will be created for each Queue
instance.

## Running

- Ensure you have a local redis instance running. You can start one using the
docker-compose.yml file in the root of this project

  `$ docker compose up`

- start the worker
  `$ node worker.js`

- start the web server in a separate process
  `$ node index.js`

- Schedule a job with an http request:

 `curl -X POST http://localhost:3000/queue  -H 'Content-Type: application/json' -d '{"x":1, "y":7}'`

You will see the job be consumed by the worker and the sum of x and y will be
logged out to the console of the worker process.
