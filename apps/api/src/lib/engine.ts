import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import prisma from './prisma'
import { workflowQueue } from './queue'

export class WorkflowEngine {
  // ... (previous execute method)
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
    const config = step.config as any
    
    switch (step.type) {
      case 'log':
        console.log(`[Step ${step.id}]`, input)
        return input

      case 'llm': {
        const { text } = await generateText({
          model: openai('gpt-4-turbo'),
          prompt: config.prompt.replace(/{{input}}/g, JSON.stringify(input)),
        })
        return { ...input, ai_result: text }
      }

      case 'condition': {
        const { field, operator, value } = config
        // Support nested fields (e.g. "user.email")
        const getValue = (obj: any, path: string) => {
          return path.split('.').reduce((o, i) => (o ? o[i] : undefined), obj)
        }
        
        const inputValue = getValue(input, field)
        
        let match = false
        if (operator === 'equals') match = String(inputValue) === String(value)
        if (operator === 'contains') match = String(inputValue).includes(String(value))
        if (operator === 'exists') match = inputValue !== undefined && inputValue !== null
        
        if (!match) {
          console.log(`Condition failed: ${field} (${inputValue}) ${operator} ${value}`)
          throw new Error(`Condition not met: ${field} ${operator} ${value}`)
        }
        return input
      }

      case 'wait': {
        const seconds = parseInt(config.seconds || '5')
        console.log(`Waiting for ${seconds} seconds...`)
        await new Promise(resolve => setTimeout(resolve, seconds * 1000))
        return input
      }

      default:
        return input
    }
  }
}

export const engine = new WorkflowEngine()
