import prisma from './prisma'
import { workflowQueue } from './queue'

export class WorkflowEngine {
  async execute(workflowId: string, payload: any) {
    const log = await prisma.executionLog.create({
      data: {
        workflowId,
        status: 'running',
        trace: { input: payload }
      }
    })

    try {
      const workflow = await prisma.workflow.findUnique({
        where: { id: workflowId },
        include: { steps: { orderBy: { order: 'asc' } } }
      })

      if (!workflow) throw new Error('Workflow not found')

      let currentData = payload

      for (const step of workflow.steps) {
        currentData = await this.executeStep(step, currentData)
      }

      await prisma.executionLog.update({
        where: { id: log.id },
        data: {
          status: 'success',
          finishedAt: new Date(),
          trace: { ...log.trace as object, output: currentData }
        }
      })

    } catch (err: any) {
      await prisma.executionLog.update({
        where: { id: log.id },
        data: {
          status: 'failed',
          finishedAt: new Date(),
          error: err.message
        }
      })
    }
  }

  private async executeStep(step: any, input: any) {
    // simplified step execution
    switch (step.type) {
      case 'log':
        console.log(`[Step ${step.id}]`, input)
        return input
      case 'llm':
        // stub for vercel ai sdk integration
        return { ...input, ai_response: 'LLM Response Stub' }
      default:
        return input
    }
  }
}

export const engine = new WorkflowEngine()
