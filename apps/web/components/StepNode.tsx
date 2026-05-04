'use client'

import { MessageSquare, Terminal, ChevronUp, ChevronDown, Zap } from 'lucide-react'
import { Step } from '@flowcore/shared/types'

interface StepNodeProps {
  step: Step
  index: number
  totalSteps: number
  isSelected: boolean
  onClick: () => void
  onMove: (direction: 'up' | 'down') => void
}

export function StepNode({ step, index, totalSteps, isSelected, onClick, onMove }: StepNodeProps) {
  const getStepDescription = () => {
    if (step.type === 'llm') return step.config.prompt || 'No prompt set'
    if (step.type === 'condition') return `${step.config.field} ${step.config.operator} ${step.config.value}`
    return 'Logs input to console'
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="h-8 w-px bg-zinc-800" />
      <div 
        onClick={onClick}
        className={`group relative flex h-20 w-72 items-center gap-4 rounded-xl border p-4 shadow-lg transition-all cursor-pointer ${
          isSelected ? 'border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500/50' : 'border-zinc-800 bg-zinc-900 hover:border-indigo-500/50 hover:bg-zinc-800/50'
        }`}
      >
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
          isSelected ? 'bg-indigo-500 text-white' : 'bg-zinc-800 text-zinc-400 group-hover:text-zinc-200'
        }`}>
          {step.type === 'llm' && <MessageSquare size={18} />}
          {step.type === 'action' && <Terminal size={18} />}
          {step.type === 'condition' && <Zap size={18} />}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase text-zinc-500">
            {step.type === 'llm' ? 'AI Generator' : step.type === 'condition' ? 'Condition' : 'Logger'}
          </p>
          <p className="text-sm font-medium text-zinc-200 truncate pr-4">
            {getStepDescription()}
          </p>
        </div>

        {/* move controls */}
        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-1">
          <button 
            onClick={(e) => { e.stopPropagation(); onMove('up') }}
            disabled={index === 0}
            className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-0"
          >
            <ChevronUp size={14} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onMove('down') }}
            disabled={index === totalSteps - 1}
            className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-0"
          >
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
