import { Queue, Worker } from 'bullmq'
import IORedis from 'ioredis'
import { engine } from './engine'

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null
})

export const workflowQueue = new Queue('workflow-executions', { connection })

export async function syncWorkflowSchedule(workflow: any) {
  // 1. Remove existing repeatable jobs for this workflow
  const repeatableJobs = await workflowQueue.getRepeatableJobs()
  for (const job of repeatableJobs) {
    if (job.id.startsWith(`schedule:${workflow.id}`)) {
      await workflowQueue.removeRepeatableByKey(job.key)
    }
  }

  // 2. Add new schedule if enabled and has cron
  if (workflow.enabled && workflow.trigger?.type === 'schedule' && workflow.trigger?.cron) {
    console.log(`Scheduling workflow ${workflow.id} with cron: ${workflow.trigger.cron}`)
    await workflowQueue.add(
      'scheduled-execution',
      { workflowId: workflow.id, payload: { source: 'scheduler', timestamp: new Date() } },
      {
        repeat: { pattern: workflow.trigger.cron },
        jobId: `schedule:${workflow.id}` // Use a consistent prefix to find/remove later
      }
    )
  }
}

export const worker = new Worker('workflow-executions', async job => {
  console.log('processing workflow job:', job.id, job.data)
  const { workflowId, payload } = job.data
  await engine.execute(workflowId, payload)
}, { connection })
