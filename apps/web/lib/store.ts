import { create } from 'zustand'
import { Workflow } from '@flowcore/shared/types'

interface WorkflowState {
  workflows: Workflow[]
  currentWorkflow: Workflow | null
  steps: Step[]
  selectedStepId: string | null
  setWorkflows: (workflows: Workflow[]) => void
  addWorkflow: (workflow: Workflow) => void
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void
  setCurrentWorkflow: (workflow: Workflow | null) => void
  setSteps: (steps: Step[]) => void
  addStep: (step: Step) => void
  setSelectedStepId: (id: string | null) => void
  updateStep: (id: string, updates: Partial<Step>) => void
  deleteStep: (id: string) => void
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  workflows: [],
  currentWorkflow: null,
  steps: [],
  selectedStepId: null,
  setWorkflows: (workflows) => set({ workflows }),
  addWorkflow: (workflow) => set((state) => ({ 
    workflows: [workflow, ...state.workflows] 
  })),
  updateWorkflow: (id, updates) => set((state) => ({
    workflows: state.workflows.map(w => w.id === id ? { ...w, ...updates } : w)
  })),
  setCurrentWorkflow: (workflow) => set({ currentWorkflow: workflow }),
  setSteps: (steps) => set({ steps }),
  addStep: (step) => set((state) => ({ 
    steps: [...state.steps, step].sort((a, b) => a.order - b.order) 
  })),
  setSelectedStepId: (id) => set({ selectedStepId: id }),
  updateStep: (id, updates) => set((state) => ({
    steps: state.steps.map(s => s.id === id ? { ...s, ...updates } : s)
  })),
  deleteStep: (id) => set((state) => ({
    steps: state.steps.filter(s => s.id !== id),
    selectedStepId: state.selectedStepId === id ? null : state.selectedStepId
  })),
}))
