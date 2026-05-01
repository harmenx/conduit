import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Play, Save, Plus, MessageSquare, Terminal } from 'lucide-react'
import { useState } from 'react'
import { useWorkflowStore } from '@/lib/store'
import { AddStepModal } from '@/components/AddStepModal'
import { StepConfigPanel } from '@/components/StepConfigPanel'
import { StepType } from '@flowcore/shared/types'

export default function WorkflowEditor() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  const { steps, addStep, setSelectedStepId } = useWorkflowStore()
  const [showAddStep, setShowAddStep] = useState(false)

  const handleAddStep = (type: StepType) => {
    addStep({
      id: Math.random().toString(36).substr(2, 9),
      workflowId: id,
      type,
      config: type === 'llm' ? { prompt: 'Translate this to French: {{input}}' } : {},
      order: steps.length,
    })
    setShowAddStep(false)
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-zinc-950">
      {/* top bar */}
      <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-4 py-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="rounded-md p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-sm font-semibold text-zinc-200">Untitled Workflow</h1>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">Draft</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-md border border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800">
            <Play size={14} />
            Test
          </button>
          <button className="flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500">
            <Save size={14} />
            Publish
          </button>
        </div>
      </header>

      {/* main editor body */}
      <div className="flex flex-1 overflow-hidden">
        {/* canvas area */}
        <div className="relative flex-1 overflow-auto bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:24px_24px]">
        <div className="mx-auto flex w-max flex-col items-center gap-8 py-20">
          {/* trigger node */}
          <div className="group relative flex h-20 w-64 items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-lg hover:border-zinc-700 transition-colors cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Plus size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-indigo-400">Trigger</p>
              <p className="text-sm font-medium text-zinc-200">Webhook Listener</p>
            </div>
          </div>

          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center gap-8 w-full">
              <div className="h-8 w-px bg-zinc-800" />
              <div 
                onClick={() => setSelectedStepId(step.id)}
                className="group relative flex h-20 w-64 items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-lg hover:border-indigo-500/50 hover:bg-zinc-800/50 transition-all cursor-pointer"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 group-hover:text-zinc-200">
                  {step.type === 'llm' ? <MessageSquare size={18} /> : <Terminal size={18} />}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-zinc-500">
                    {step.type === 'llm' ? 'AI Step' : 'Action'}
                  </p>
                  <p className="text-sm font-medium text-zinc-200 truncate max-w-[140px]">
                    {step.type === 'llm' ? 'GPT-4 Generator' : 'Log Output'}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="h-8 w-px bg-zinc-800" />

          {/* add step button */}
          <button 
            onClick={() => {
              setSelectedStepId(null)
              setShowAddStep(true)
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-300 transition-all shadow-sm border border-zinc-700/50"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <StepConfigPanel />
    </div>

    {showAddStep && (
      <AddStepModal 
        onClose={() => setShowAddStep(false)} 
        onSelect={handleAddStep}
      />
    )}
    </div>
  )
}
