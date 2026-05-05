'use client'

import { X, Code } from 'lucide-react'

interface LogDetailsModalProps {
  log: any
  onClose: () => void
}

export function LogDetailsModal({ log, onClose }: LogDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between border-b border-zinc-800 p-4 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className={`h-2 w-2 rounded-full ${
              log.status === 'success' ? 'bg-emerald-500' : log.status === 'failed' ? 'bg-red-500' : 'bg-blue-500'
            }`} />
            <h2 className="text-sm font-semibold">Run Details: <span className="font-mono text-zinc-500">{log.id}</span></h2>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-6">
          {log.error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
              <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Error</p>
              <p className="text-sm text-red-200">{log.error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2 text-zinc-400">
                <Code size={14} />
                <span className="text-xs font-bold uppercase tracking-widest">Input Payload</span>
              </div>
              <pre className="rounded-lg bg-zinc-950 p-4 text-[11px] font-mono text-zinc-300 overflow-auto border border-zinc-800">
                {JSON.stringify(log.trace?.input || {}, null, 2)}
              </pre>
            </div>

            {log.trace?.steps && (
              <div>
                <div className="flex items-center gap-2 mb-4 text-zinc-400">
                  <span className="text-xs font-bold uppercase tracking-widest">Execution Trace</span>
                </div>
                <div className="space-y-3">
                  {log.trace.steps.map((step: any, i: number) => (
                    <div key={i} className="rounded-lg border border-zinc-800 bg-zinc-950/50 overflow-hidden">
                      <div className="flex items-center justify-between bg-zinc-900/50 px-4 py-2 border-b border-zinc-800">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase">{step.type}</span>
                          <span className="text-xs font-mono text-zinc-300">{step.stepId}</span>
                        </div>
                        <span className="text-[10px] text-zinc-500">{new Date(step.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <pre className="p-3 text-[10px] font-mono text-zinc-400 overflow-auto max-h-32">
                        {JSON.stringify(step.output, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {log.status === 'success' && (
              <div>
                <div className="flex items-center gap-2 mb-2 text-emerald-400">
                  <Code size={14} />
                  <span className="text-xs font-bold uppercase tracking-widest">Final Output</span>
                </div>
                <pre className="rounded-lg bg-zinc-950 p-4 text-[11px] font-mono text-emerald-200 overflow-auto border border-emerald-500/10">
                  {JSON.stringify(log.trace?.output || {}, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-zinc-800 bg-zinc-900/50 p-4 flex items-center justify-between text-[10px] text-zinc-500 uppercase font-mono">
          <div>Started: {new Date(log.startedAt).toLocaleString()}</div>
          {log.finishedAt && (
            <div>Duration: {Math.round((new Date(log.finishedAt).getTime() - new Date(log.startedAt).getTime()))}ms</div>
          )}
        </div>
      </div>
    </div>
  )
}
