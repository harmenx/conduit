import Fastify from 'fastify'
import { workflowQueue, syncWorkflowSchedule } from './lib/queue'
import prisma from './lib/prisma'
import { engine } from './lib/engine'
import { auth } from './lib/auth'
import { toFastifyHandler } from 'better-auth/fastify'

const server = Fastify({
  logger: true
})

server.all('/api/auth/*', toFastifyHandler(auth))

server.get('/health', async () => {
  return { status: 'ok', uptime: process.uptime() }
})

server.get('/workflows', async () => {
  return await prisma.workflow.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      logs: {
        orderBy: { startedAt: 'desc' },
        take: 1
      }
    }
  })
})

server.get('/stats', async () => {
  const [workflowCount, executionCount, successCount] = await Promise.all([
    prisma.workflow.count(),
    prisma.executionLog.count(),
    prisma.executionLog.count({ where: { status: 'success' } })
  ])
  
  return {
    workflowCount,
    executionCount,
    successRate: executionCount > 0 ? (successCount / executionCount) * 100 : 0
  }
})

server.post('/workflows', async (request, reply) => {
  const { name, trigger, steps } = request.body as { name: string, trigger?: any, steps?: any[] }
  
  return await prisma.$transaction(async (tx) => {
    const workflow = await tx.workflow.create({
      data: {
        name,
        trigger: trigger || {},
      }
    })

    if (steps && steps.length > 0) {
      await tx.step.createMany({
        data: steps.map((s, i) => ({
          id: s.id,
          workflowId: workflow.id,
          type: s.type,
          config: s.config,
          order: i,
        }))
      })
    }

    return workflow
  })
})

server.get('/workflows/:id', async (request, reply) => {
  const { id } = request.params as { id: string }
  const workflow = await prisma.workflow.findUnique({
    where: { id },
    include: { steps: { orderBy: { order: 'asc' } } }
  })
  if (!workflow) return reply.status(404).send({ error: 'Not found' })
  return workflow
})

server.put('/workflows/:id', async (request, reply) => {
  const { id } = request.params as { id: string }
  const { name, enabled, steps, trigger } = request.body as { 
    name?: string, 
    enabled?: boolean, 
    steps: any[],
    trigger?: any
  }

  return await prisma.$transaction(async (tx) => {
    // update workflow
    const workflow = await tx.workflow.update({
      where: { id },
      data: { name, enabled, trigger }
    })

    // sync steps (delete and recreate for simplicity in this draft)
    await tx.step.deleteMany({ where: { workflowId: id } })
    await tx.step.createMany({
      data: steps.map((s, i) => ({
        id: s.id,
        workflowId: id,
        type: s.type,
        config: s.config,
        order: i,
      }))
    })

    return workflow
  }).then(async (workflow) => {
    await syncWorkflowSchedule(workflow)
    return workflow
  })
})

server.get('/workflows/:id/logs', async (request, reply) => {
  const { id } = request.params as { id: string }
  const logs = await prisma.executionLog.findMany({
    where: { workflowId: id },
    orderBy: { startedAt: 'desc' },
    take: 50
  })
  return logs
})

server.delete('/workflows/:id', async (request, reply) => {
  const { id } = request.params as { id: string }
  await prisma.workflow.delete({ where: { id } })
  return { status: 'deleted' }
})

server.post('/workflows/:id/test', async (request, reply) => {
  const { id } = request.params as { id: string }
  const { payload } = request.body as { payload: any }
  
  // ignore enabled check for tests
  await workflowQueue.add('test-execution', { workflowId: id, payload })
  return { status: 'test_triggered' }
})

server.post('/hooks/:id', async (request, reply) => {
  const { id } = request.params as { id: string }
  const workflow = await prisma.workflow.findUnique({ where: { id } })
  
  if (!workflow || !workflow.enabled) {
    return reply.status(404).send({ error: 'Workflow not found or disabled' })
  }

  await workflowQueue.add('hook-execution', { workflowId: id, payload: request.body })
  
  return { status: 'triggered' }
})

const start = async () => {
  try {
    // todo: connect db & redis
    await server.listen({ port: 3001, host: '0.0.0.0' })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
