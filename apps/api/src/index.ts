import Fastify from 'fastify'
import './lib/queue' // init worker
import prisma from './lib/prisma'

const server = Fastify({
  logger: true
})

server.get('/health', async () => {
  return { status: 'ok', uptime: process.uptime() }
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
