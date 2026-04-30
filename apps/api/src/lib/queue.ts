import { Queue, Worker } from 'bullmq'
import IORedis from 'ioredis'

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null
})

export const workflowQueue = new Queue('workflow-executions', { connection })

export const worker = new Worker('workflow-executions', async job => {
  console.log('processing workflow job:', job.id)
  // todo: implement engine
}, { connection })
