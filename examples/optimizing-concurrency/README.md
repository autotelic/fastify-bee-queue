# Optimizing Concurrency

Usage example where worker processes are optimized using [throng](https://github.com/hunterloftis/throng).

For additional information on nodejs optimizations, see [Optimizing Node.js Application Concurrency](https://devcenter.heroku.com/articles/node-concurrency)

## Running

- Ensure you have a local redis instance running. You can start one using the
docker-compose.yml file in the root of this project

  `$ docker compose up`

- start the worker and specify the number of concurrent workers
  `$ WEB_CONCURRENCY=4 node worker.js`

- start the web server in a separate process
  `$ node index.js`

- Schedule a job with an http request:

 `curl -X POST http://localhost:3000/queue  -H 'Content-Type: application/json' -d '{"x":1, "y":7}'`

You will see the worker processes start up and begin to consuming jobs.
the output will be the sum of x and y.
