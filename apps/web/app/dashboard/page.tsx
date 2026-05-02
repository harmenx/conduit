'use client'

import { useEffect, useState } from 'react'
import { useWorkflowStore } from '@/lib/store'
import { NewWorkflowModal } from '@/components/NewWorkflowModal'
import { Plus, ChevronRight } from 'lucide-react'

export default function Dashboard() {
  const { workflows, setWorkflows, updateWorkflow } = useWorkflowStore()
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // todo: fetch from api
    setWorkflows([
      { id: '1', name: 'Welcome Email Flow', enabled: true, triggerId: 't1', createdAt: new Date(), updatedAt: new Date() },
      { id: '2', name: 'Slack Notification', enabled: false, triggerId: 't2', createdAt: new Date(), updatedAt: new Date() },
    ])
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
                  <p className="text-xs text-zinc-500">Last updated {w.updatedAt.toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-zinc-400 group-hover:text-zinc-200 transition-colors">
                <ChevronRight size={20} />
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
