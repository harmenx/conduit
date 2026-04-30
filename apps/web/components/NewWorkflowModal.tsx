'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useWorkflowStore } from '@/lib/store'

export function NewWorkflowModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const addWorkflow = useWorkflowStore(state => state.addWorkflow)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || loading) return

    setLoading(true)
    try {
      // simulate api call for now
      const mockWorkflow = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        enabled: false,
        triggerId: 'default',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      addWorkflow(mockWorkflow)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Create Workflow</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-400">Workflow Name</label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Sync Shopify to Slack"
              className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Workflow'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
