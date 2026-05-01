import Fastify from 'fastify'
import './lib/queue'
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

server.post('/workflows', async (request, reply) => {
  const { name } = request.body as { name: string }
  const workflow = await prisma.workflow.create({
    data: {
      name,
      trigger: {},
    }
  })
  return workflow
})

server.put('/workflows/:id', async (request, reply) => {
  const { id } = request.params as { id: string }
  const { name, enabled, steps } = request.body as { 
    name?: string, 
    enabled?: boolean, 
    steps: any[] 
  }

  return await prisma.$transaction(async (tx) => {
    // update workflow
    const workflow = await tx.workflow.update({
      where: { id },
      data: { name, enabled }
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

server.post('/hooks/:id', async (request, reply) => {
  const { id } = request.params as { id: string }
  const workflow = await prisma.workflow.findUnique({ where: { id } })
  
  if (!workflow || !workflow.enabled) {
    return reply.status(404).send({ error: 'Workflow not found or disabled' })
  }

  // push to engine (should be async via queue in real prod)
  engine.execute(id, request.body)
  
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
