'use client'

import { useState } from 'react'
import { X, Play, Code } from 'lucide-react'

interface TestWorkflowModalProps {
  workflowId: string
  onClose: () => void
}

export function TestWorkflowModal({ workflowId, onClose }: TestWorkflowModalProps) {
  const [payload, setPayload] = useState('{\n  "input": "Hello World"\n}')
  const [loading, setLoading] = useState(false)

  const handleRunTest = async () => {
    setLoading(true)
    try {
      let parsedPayload = {}
      try {
        parsedPayload = JSON.parse(payload)
      } catch (e) {
        alert('Invalid JSON payload')
        return
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workflows/${workflowId}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: parsedPayload }),
      })
      
      if (res.ok) {
        alert('Test triggered! Check the history sidebar for results.')
        onClose()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-800 p-4">
          <div className="flex items-center gap-2">
            <Play size={16} className="text-indigo-400" />
            <h2 className="text-sm font-semibold text-zinc-200">Manual Test Run</h2>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-400">
              <Code size={14} />
              <label className="text-[10px] font-bold uppercase tracking-widest">Test Payload (JSON)</label>
            </div>
            <textarea
              value={payload}
              onChange={e => setPayload(e.target.value)}
              className="h-48 w-full rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="rounded-md px-4 py-2 text-xs font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleRunTest}
              disabled={loading}
              className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-lg"
            >
              <Play size={14} />
              {loading ? 'Triggering...' : 'Run Test'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
