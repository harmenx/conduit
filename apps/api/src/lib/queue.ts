import { Queue, Worker } from 'bullmq'
import IORedis from 'ioredis'
import { engine } from './engine'

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null
})

export const workflowQueue = new Queue('workflow-executions', { connection })

export const worker = new Worker('workflow-executions', async job => {
  console.log('processing workflow job:', job.id, job.data)
  const { workflowId, payload } = job.data
  await engine.execute(workflowId, payload)
}, { connection })
