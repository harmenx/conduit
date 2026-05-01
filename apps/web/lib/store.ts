import { create } from 'zustand'
import { Workflow } from '@flowcore/shared/types'

interface WorkflowState {
  workflows: Workflow[]
  currentWorkflow: Workflow | null
  steps: Step[]
  setWorkflows: (workflows: Workflow[]) => void
  addWorkflow: (workflow: Workflow) => void
  setCurrentWorkflow: (workflow: Workflow | null) => void
  setSteps: (steps: Step[]) => void
  addStep: (step: Step) => void
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  workflows: [],
  currentWorkflow: null,
  steps: [],
  setWorkflows: (workflows) => set({ workflows }),
  addWorkflow: (workflow) => set((state) => ({ 
    workflows: [workflow, ...state.workflows] 
  })),
  setCurrentWorkflow: (workflow) => set({ currentWorkflow: workflow }),
  setSteps: (steps) => set({ steps }),
  addStep: (step) => set((state) => ({ 
    steps: [...state.steps, step].sort((a, b) => a.order - b.order) 
  })),
}))
