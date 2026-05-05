'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWorkflowStore } from '@/lib/store'
import { NewWorkflowModal } from '@/components/NewWorkflowModal'
import { Plus, ChevronRight, Trash2, Link as LinkIcon, Copy } from 'lucide-react'

export default function Dashboard() {
  const { workflows, setWorkflows, updateWorkflow, removeWorkflow } = useWorkflowStore()
  const [showModal, setShowModal] = useState(false)
  const [stats, setStats] = useState({ workflowCount: 0, executionCount: 0, successRate: 0 })
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        const [wRes, sRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/workflows`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats`)
        ])
        const wData = await wRes.json()
        const sData = await sRes.json()
        setWorkflows(wData)
        setStats(sData)
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
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
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage and monitor your automation pipelines</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <Plus size={18} />
          New Workflow
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'Total Workflows', value: stats.workflowCount, color: 'text-indigo-400' },
          { label: 'Total Executions', value: stats.executionCount, color: 'text-emerald-400' },
          { label: 'Success Rate', value: `${Math.round(stats.successRate)}%`, color: 'text-amber-400' },
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">{stat.label}</p>
            <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2 mb-2">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Your Workflows</h2>
        </div>
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
                  <h3 className="font-medium text-zinc-200 group-hover:text-white transition-colors flex items-center gap-2">
                    {w.name}
                    {w.logs?.[0] && (
                      <div className={`h-1.5 w-1.5 rounded-full ${
                        w.logs[0].status === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                      }`} />
                    )}
                  </h3>
                  <div className="flex items-center gap-3 mt-0.5">
                    <p className="text-xs text-zinc-500">Last updated {new Date(w.updatedAt).toLocaleDateString()}</p>
                    {w.trigger?.type === 'webhook' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          navigator.clipboard.writeText(`${window.location.origin}/hooks/${w.id}`)
                          alert('Webhook URL copied!')
                        }}
                        className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/5 px-1.5 py-0.5 rounded border border-indigo-500/10"
                      >
                        <LinkIcon size={10} />
                        Copy Webhook
                      </button>
                    )}
                  </div>
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
