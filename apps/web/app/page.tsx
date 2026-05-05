import Link from 'next/link'
import { ArrowRight, Zap, Shield, Cpu, Github } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Background Glows */}
      <div className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="absolute -right-20 bottom-0 h-[500px] w-[500px] rounded-full bg-emerald-600/10 blur-[120px]" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white shadow-lg shadow-indigo-600/20">
            F
          </div>
          <span className="text-xl font-bold tracking-tight">FlowCore</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-zinc-400">
          <a href="https://github.com/harmenx/flowcore" className="hover:text-zinc-100 transition-colors flex items-center gap-2">
            <Github size={18} />
            GitHub
          </a>
          <Link href="/login" className="rounded-full bg-zinc-800 px-5 py-2 text-zinc-100 hover:bg-zinc-700 transition-all active:scale-95">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center px-4 pt-32 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-xs font-medium text-zinc-400 backdrop-blur-sm mb-8">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Self-hostable v1.0 is now live
        </div>
        
        <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-7xl">
          Automate your world with <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            AI-Powered Workflows
          </span>
        </h1>
        
        <p className="mt-8 max-w-2xl text-lg text-zinc-400 leading-relaxed">
          The open-source alternative to Zapier, built for developers who need full control, 
          privacy, and the power of Large Language Models.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-95"
          >
            Launch App
            <ArrowRight size={18} />
          </Link>
          <a 
            href="#features" 
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-8 py-4 text-sm font-bold backdrop-blur-sm hover:bg-zinc-800 transition-all active:scale-95"
          >
            View Features
          </a>
        </div>

        {/* Feature Grid */}
        <section id="features" className="mt-40 grid w-full max-w-6xl grid-cols-1 gap-8 px-4 sm:grid-cols-3">
          {[
            {
              icon: Zap,
              title: "Lightning Fast",
              desc: "Built on Bun and Fastify for near-instant execution and UI responsiveness.",
              color: "text-indigo-400"
            },
            {
              icon: Cpu,
              title: "AI Distributed",
              desc: "Offload complex tasks to GPT-4 with our distributed worker architecture.",
              color: "text-emerald-400"
            },
            {
              icon: Shield,
              title: "Total Privacy",
              desc: "Self-host on your own infrastructure. Your data never leaves your control.",
              color: "text-purple-400"
            }
          ].map((f, i) => (
            <div key={i} className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 text-left backdrop-blur-sm transition-all hover:border-zinc-700">
              <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 ${f.color} group-hover:scale-110 transition-transform`}>
                <f.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer className="mt-40 w-full border-t border-zinc-800/50 py-12 text-center text-zinc-600 text-sm">
          <p>© 2026 FlowCore Automation. MIT Licensed.</p>
        </footer>
      </main>
    </div>
  )
}
