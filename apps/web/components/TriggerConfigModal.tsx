'use client'

import { X, Zap, Clock } from 'lucide-react'
import { useState } from 'react'

interface TriggerConfigModalProps {
  trigger: any
  onClose: () => void
  onSave: (trigger: any) => void
}

export function TriggerConfigModal({ trigger, onClose, onSave }: TriggerConfigModalProps) {
  const [type, setType] = useState(trigger?.type || 'webhook')
  const [cron, setCron] = useState(trigger?.cron || '0 * * * *')

  const handleSave = () => {
    onSave({ type, cron: type === 'schedule' ? cron : undefined })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <h2 className="text-lg font-semibold text-zinc-100">Workflow Trigger</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setType('webhook')}
              className={`flex flex-col items-center gap-3 rounded-xl border p-4 transition-all ${
                type === 'webhook' ? 'border-indigo-500 bg-indigo-500/5 text-indigo-400' : 'border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-zinc-700'
              }`}
            >
              <Zap size={24} />
              <span className="text-xs font-bold uppercase tracking-wider">Webhook</span>
            </button>
            <button
              onClick={() => setType('schedule')}
              className={`flex flex-col items-center gap-3 rounded-xl border p-4 transition-all ${
                type === 'schedule' ? 'border-indigo-500 bg-indigo-500/5 text-indigo-400' : 'border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-zinc-700'
              }`}
            >
              <Clock size={24} />
              <span className="text-xs font-bold uppercase tracking-wider">Schedule</span>
            </button>
          </div>

          <div className="space-y-4">
            {type === 'webhook' ? (
              <div className="rounded-lg bg-zinc-950 p-4 border border-zinc-800">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Triggers immediately when a POST request is sent to the unique webhook URL for this workflow.
                </p>
              </div>
            ) : (
              <div>
                <label className="mb-2 block text-xs font-medium text-zinc-500 uppercase tracking-wider">CRON Expression</label>
                <input
                  type="text"
                  value={cron}
                  onChange={e => setCron(e.target.value)}
                  className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-300 focus:border-indigo-500 focus:outline-none"
                  placeholder="0 * * * * (Every hour)"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    { label: 'Every Minute', val: '* * * * *' },
                    { label: 'Every Hour', val: '0 * * * *' },
                    { label: 'Daily', val: '0 0 * * *' },
                  ].map(p => (
                    <button
                      key={p.val}
                      onClick={() => setCron(p.val)}
                      className="text-[10px] text-zinc-500 hover:text-zinc-300 bg-zinc-800 px-2 py-1 rounded transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-zinc-800 p-4 flex justify-end gap-3 bg-zinc-900/50">
          <button onClick={onClose} className="text-sm font-medium text-zinc-400 hover:text-zinc-200">Cancel</button>
          <button 
            onClick={handleSave}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
          >
            Save Trigger
          </button>
        </div>
      </div>
    </div>
  )
}
