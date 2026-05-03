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
  removeWorkflow: (id: string) => void
  setCurrentWorkflow: (workflow: Workflow | null) => void
  setSteps: (steps: Step[]) => void
  addStep: (step: Step) => void
  setSelectedStepId: (id: string | null) => void
  updateStep: (id: string, updates: Partial<Step>) => void
  deleteStep: (id: string) => void
  moveStep: (id: string, direction: 'up' | 'down') => void
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
  removeWorkflow: (id) => set((state) => ({
    workflows: state.workflows.filter(w => w.id !== id)
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
  moveStep: (id, direction) => set((state) => {
    const index = state.steps.findIndex(s => s.id === id)
    if (index === -1) return state
    if (direction === 'up' && index === 0) return state
    if (direction === 'down' && index === state.steps.length - 1) return state

    const newSteps = [...state.steps]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    const [moved] = newSteps.splice(index, 1)
    newSteps.splice(targetIndex, 0, moved)

    return {
      steps: newSteps.map((s, i) => ({ ...s, order: i }))
    }
  }),
}))
