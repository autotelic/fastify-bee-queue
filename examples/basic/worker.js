'use strict'

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
