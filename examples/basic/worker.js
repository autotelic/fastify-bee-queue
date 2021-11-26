const Queue = require('bee-queue')

const { QUEUE_NAME } = require('./constants')

const queue = new Queue(QUEUE_NAME)

queue.on('ready', () => {
  queue.process((job, done) => {
    setTimeout(() => {
      const result = job.data.x + job.data.y
      console.log(`job: ${job.id} - result: ${result}`)
      done(null, result)
    }, 5000)
  })

  console.log(`${QUEUE_NAME} - processing jobs`)
})
