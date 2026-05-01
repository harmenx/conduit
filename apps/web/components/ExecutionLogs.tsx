'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Clock, Search } from 'lucide-react'

interface Log {
  id: string
  status: 'success' | 'failed' | 'running'
  startedAt: string
  finishedAt?: string
  error?: string
}

export function ExecutionLogs({ workflowId }: { workflowId: string }) {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workflows/${workflowId}/logs`)
        const data = await res.json()
        setLogs(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
    const interval = setInterval(fetchLogs, 5000)
    return () => clearInterval(interval)
  }, [workflowId])

  if (loading) return <div className="p-4 text-zinc-500 text-sm">Loading logs...</div>

  return (
    <div className="flex flex-col h-full bg-zinc-900 border-l border-zinc-800 w-80">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Execution History</h2>
        <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-mono">
          {logs.length} runs
        </span>
      </div>

      <div className="flex-1 overflow-auto">
        {logs.length > 0 ? (
          <div className="divide-y divide-zinc-800/50">
            {logs.map(log => (
              <div key={log.id} className="p-4 hover:bg-zinc-800/30 transition-colors cursor-pointer group">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {log.status === 'success' && <CheckCircle2 size={14} className="text-emerald-500" />}
                    {log.status === 'failed' && <XCircle size={14} className="text-red-500" />}
                    {log.status === 'running' && <Clock size={14} className="text-blue-500 animate-pulse" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-xs font-medium text-zinc-200 truncate font-mono tracking-tighter">
                        {log.id.split('-')[0]}
                      </p>
                      <p className="text-[10px] text-zinc-500 whitespace-nowrap">
                        {new Date(log.startedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    {log.error && (
                      <p className="text-[10px] text-red-400 line-clamp-1 italic">{log.error}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Search className="mx-auto mb-3 text-zinc-700" size={24} />
            <p className="text-xs text-zinc-500">No executions yet. Trigger the webhook to see results.</p>
          </div>
        )}
      </div>
    </div>
  )
}
