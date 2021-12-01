'use strict'

const throng = require('throng')

const WORKERS = process.env.WEB_CONCURRENCY || 1

throng({ start: proc, workers: WORKERS })

function proc () {
  console.log('Starting worker process')

  const { QUEUE_NAME } = require('./constants')
  const { workerBees } = require('../../')

  function sleep (ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  async function processor (job) {
    await sleep(4000)
    const result = job.data.x + job.data.y
    console.log(`job: ${job.id} - result: ${result}`)
    return result
  }

  const workers = [
    {
      name: QUEUE_NAME,
      processor,
      options: {}
    }
  ]

  const { start } = workerBees({ workers })

  start()
}
