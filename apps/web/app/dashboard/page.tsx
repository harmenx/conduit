'use client'

import { useEffect, useState } from 'react'
import { useWorkflowStore } from '@/lib/store'
import { NewWorkflowModal } from '@/components/NewWorkflowModal'
import { Plus, ChevronRight, Trash2 } from 'lucide-react'

export default function Dashboard() {
  const { workflows, setWorkflows, updateWorkflow, removeWorkflow } = useWorkflowStore()
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function fetchWorkflows() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workflows`)
        const data = await res.json()
        setWorkflows(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchWorkflows()
  }, [setWorkflows])

  const toggleWorkflow = async (e: React.MouseEvent, id: string, enabled: boolean) => {
    e.stopPropagation()
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workflows/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !enabled, steps: [] }),
      })
      updateWorkflow(id, { enabled: !enabled })
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteWorkflow = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this workflow?')) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workflows/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) removeWorkflow(id)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Workflows</h1>
          <p className="text-sm text-zinc-500">Manage and monitor your automations</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
        >
          <Plus size={16} />
          New Workflow
        </button>
      </header>
      
      <div className="grid gap-4">
        {workflows.length > 0 ? (
          workflows.map(w => (
            <div 
              key={w.id} 
              onClick={() => router.push(`/workflow/${w.id}`)}
              className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <button 
                  onClick={(e) => toggleWorkflow(e, w.id, w.enabled)}
                  className={`h-5 w-9 rounded-full p-1 transition-colors ${w.enabled ? 'bg-emerald-500/20' : 'bg-zinc-800'}`}
                >
                  <div className={`h-3 w-3 rounded-full transition-all ${w.enabled ? 'translate-x-4 bg-emerald-500' : 'bg-zinc-500'}`} />
                </button>
                <div>
                  <h3 className="font-medium text-zinc-200 group-hover:text-white transition-colors">{w.name}</h3>
                  <p className="text-xs text-zinc-500">Last updated {new Date(w.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => handleDeleteWorkflow(e, w.id)}
                  className="rounded-md p-2 text-zinc-600 hover:bg-red-500/10 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
                <div className="text-zinc-400 group-hover:text-zinc-200 transition-colors">
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-zinc-800 p-12 text-center">
            <p className="text-zinc-500 text-sm">No workflows found. Create one to get started.</p>
          </div>
        )}
      </div>

      {showModal && <NewWorkflowModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
