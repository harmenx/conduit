'use client'

import { X, MessageSquare, Terminal, Zap } from 'lucide-react'
import { StepType } from '@flowcore/shared/types'

const STEP_TYPES: { type: StepType; name: string; icon: any; desc: string }[] = [
  { type: 'llm', name: 'AI Generation', icon: MessageSquare, desc: 'Process data with GPT-4' },
  { type: 'action', name: 'Log Output', icon: Terminal, desc: 'Print data to execution logs' },
  { type: 'condition', name: 'Filter', icon: Zap, desc: 'Continue if condition matches' },
]

export function AddStepModal({ onClose, onSelect }: { onClose: () => void; onSelect: (type: StepType) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <h2 className="text-lg font-semibold">Add Step</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2 p-4">
          {STEP_TYPES.map(s => (
            <button
              key={s.type}
              onClick={() => onSelect(s.type)}
              className="flex items-start gap-4 rounded-xl border border-transparent p-4 text-left hover:border-zinc-700 hover:bg-zinc-800/50 transition-all group"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 transition-colors">
                <s.icon size={20} />
              </div>
              <div>
                <p className="font-medium text-zinc-200">{s.name}</p>
                <p className="text-xs text-zinc-500">{s.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
