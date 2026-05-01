import Fastify from 'fastify'
import './lib/queue'
import prisma from './lib/prisma'
import { engine } from './lib/engine'

const server = Fastify({
  logger: true
})

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
