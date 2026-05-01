'use client'

import { X } from 'lucide-react'
import { useWorkflowStore } from '@/lib/store'

export function StepConfigPanel() {
  const { steps, selectedStepId, setSelectedStepId, updateStep } = useWorkflowStore()
  const step = steps.find(s => s.id === selectedStepId)

  if (!step) return null

  return (
    <div className="w-80 border-l border-zinc-800 bg-zinc-900/50 p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-200">Step Settings</h2>
        <button 
          onClick={() => setSelectedStepId(null)}
          className="text-zinc-500 hover:text-zinc-300"
        >
          <X size={18} />
        </button>
      </div>

      <div className="space-y-4">
        {step.type === 'llm' && (
          <div>
            <label className="mb-2 block text-xs font-medium text-zinc-500 uppercase tracking-wider">AI Prompt</label>
            <textarea
              value={step.config.prompt || ''}
              onChange={e => updateStep(step.id, { config: { ...step.config, prompt: e.target.value } })}
              className="h-48 w-full rounded-md border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-300 focus:border-indigo-500 focus:outline-none transition-colors"
              placeholder="Enter instructions for the AI..."
            />
            <p className="mt-2 text-[10px] text-zinc-500 italic">
              Use {"{{input}}"} to reference data from the previous step.
            </p>
          </div>
        )}

        {step.type === 'condition' && (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-medium text-zinc-500 uppercase tracking-wider">Field Path</label>
              <input
                type="text"
                value={step.config.field || ''}
                onChange={e => updateStep(step.id, { config: { ...step.config, field: e.target.value } })}
                className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300 focus:border-indigo-500 focus:outline-none"
                placeholder="e.g. user.email"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-zinc-500 uppercase tracking-wider">Operator</label>
              <select
                value={step.config.operator || 'equals'}
                onChange={e => updateStep(step.id, { config: { ...step.config, operator: e.target.value } })}
                className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300 focus:border-indigo-500 focus:outline-none"
              >
                <option value="equals">Equals</option>
                <option value="contains">Contains</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-zinc-500 uppercase tracking-wider">Value</label>
              <input
                type="text"
                value={step.config.value || ''}
                onChange={e => updateStep(step.id, { config: { ...step.config, value: e.target.value } })}
                className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300 focus:border-indigo-500 focus:outline-none"
                placeholder="Value to match..."
              />
            </div>
          </div>
        )}

        {step.type === 'action' && (
          <div>
            <p className="text-sm text-zinc-400">This step will log the input data to the execution history for debugging.</p>
          </div>
        )}

        <div>
          <label className="mb-2 block text-xs font-medium text-zinc-500 uppercase tracking-wider">Step ID</label>
          <code className="block rounded bg-zinc-950 p-2 text-[10px] text-zinc-400 font-mono">
            {step.id}
          </code>
        </div>
      </div>

      <div className="mt-auto">
        <button 
          onClick={() => {
            // todo: implement delete
          }}
          className="w-full rounded-md border border-red-900/50 px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors"
        >
          Delete Step
        </button>
      </div>
    </div>
  )
}
