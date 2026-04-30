'use client'

import { useEffect, useState } from 'react'
import { useWorkflowStore } from '@/lib/store'
import { NewWorkflowModal } from '@/components/NewWorkflowModal'
import { Plus, ChevronRight } from 'lucide-react'

export default function Dashboard() {
  const { workflows, setWorkflows } = useWorkflowStore()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // todo: fetch from api
    setWorkflows([
      { id: '1', name: 'Welcome Email Flow', enabled: true, triggerId: 't1', createdAt: new Date(), updatedAt: new Date() },
      { id: '2', name: 'Slack Notification', enabled: false, triggerId: 't2', createdAt: new Date(), updatedAt: new Date() },
    ])
  }, [setWorkflows])

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
            <div key={w.id} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`h-2.5 w-2.5 rounded-full ${w.enabled ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
                <div>
                  <h3 className="font-medium text-zinc-200">{w.name}</h3>
                  <p className="text-xs text-zinc-500">Last updated {w.updatedAt.toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-zinc-400">
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
