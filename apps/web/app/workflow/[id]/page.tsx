'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Play, Save, Plus } from 'lucide-react'

export default function WorkflowEditor() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

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

      {/* canvas area */}
      <div className="relative flex-1 overflow-auto bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:24px_24px]">
        <div className="mx-auto flex w-max flex-col items-center gap-8 py-20">
          {/* trigger node */}
          <div className="group relative flex h-24 w-64 items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-lg hover:border-zinc-700 transition-colors cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
              <Plus size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-indigo-400">Trigger</p>
              <p className="text-sm font-medium text-zinc-200">Define how it starts</p>
            </div>
          </div>

          <div className="h-12 w-px bg-zinc-800" />

          {/* add step button */}
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-zinc-300 transition-all shadow-sm">
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
