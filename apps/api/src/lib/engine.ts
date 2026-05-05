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
      const stepResults: any[] = []

      for (const step of workflow.steps) {
        const result = await this.executeStep(step, currentData, stepResults)
        stepResults.push({ 
          stepId: step.id, 
          type: step.type,
          output: result,
          timestamp: new Date()
        })
        currentData = result
      }

      await prisma.executionLog.update({
        where: { id: log.id },
        data: {
          status: 'success',
          finishedAt: new Date(),
          trace: { 
            input: payload, 
            output: currentData,
            steps: stepResults 
          }
        }
      })

    } catch (err: any) {
      console.error('Workflow execution failed:', err)
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

  private resolveTemplate(template: string, context: { input: any, steps: any[] }) {
    if (!template) return template
    
    return template.replace(/{{(.*?)}}/g, (match, path) => {
      const trimmedPath = path.trim()
      
      // Handle {{input}}
      if (trimmedPath === 'input') return typeof context.input === 'object' ? JSON.stringify(context.input) : context.input
      
      // Handle {{steps.0.output.field}}
      if (trimmedPath.startsWith('steps.')) {
        const parts = trimmedPath.split('.')
        const stepIndex = parseInt(parts[1])
        const stepResult = context.steps[stepIndex]
        
        if (!stepResult) return match
        
        const remainingPath = parts.slice(2).join('.')
        if (!remainingPath) return typeof stepResult.output === 'object' ? JSON.stringify(stepResult.output) : stepResult.output
        
        const getValue = (obj: any, path: string) => {
          return path.split('.').reduce((o, i) => (o ? o[i] : undefined), obj)
        }
        
        const value = getValue(stepResult.output, remainingPath)
        return value !== undefined ? (typeof value === 'object' ? JSON.stringify(value) : value) : match
      }
      
      return match
    })
  }

  private async executeStep(step: any, input: any, previousSteps: any[]) {
    const config = step.config as any
    const context = { input, steps: previousSteps }
    switch (step.type) {
      case 'log':
        console.log(`[Step ${step.id}]`, input)
        return input

      case 'llm': {
        const prompt = this.resolveTemplate(config.prompt, context)
        const { text } = await generateText({
          model: openai('gpt-4-turbo'),
          prompt,
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

      case 'webhook': {
        const { url, method = 'POST' } = config
        const resolvedUrl = this.resolveTemplate(url, context)
        
        console.log(`Making ${method} request to ${resolvedUrl}...`)
        const response = await fetch(resolvedUrl, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input)
        })
        const data = await response.json()
        return { ...input, webhook_result: data }
      }

      default:
        return input
    }
  }
}

export const engine = new WorkflowEngine()
