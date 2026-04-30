import { create } from 'zustand'
import { Workflow } from '@flowcore/shared/types'

interface WorkflowState {
  workflows: Workflow[]
  setWorkflows: (workflows: Workflow[]) => void
  addWorkflow: (workflow: Workflow) => void
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  workflows: [],
  setWorkflows: (workflows) => set({ workflows }),
  addWorkflow: (workflow) => set((state) => ({ 
    workflows: [workflow, ...state.workflows] 
  })),
}))
