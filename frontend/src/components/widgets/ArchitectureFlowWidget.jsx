import { Monitor, Server, BrainCircuit, ArrowDown, ArrowUp, Zap, ShieldCheck, Database, Activity } from 'lucide-react'

const LOGIC_ICONS = {
  Guardrails: ShieldCheck,
  Cache: Database,
  Stats: Activity,
}

export default function ArchitectureFlowWidget({ payload = {} }) {
  const { title = 'AI Data Lifecycle', subtitle = '', flow = [] } = payload

  return (
    <div
      className="rounded-2xl rounded-tl-sm p-6 overflow-hidden relative"
      style={{
        background: 'linear-gradient(145deg, rgba(9,9,11,0.9) 0%, rgba(9,9,11,0.5) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Inject animation styles directly into the component */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes flowDown {
          0% { top: -4px; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes flowUp {
          0% { bottom: -4px; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { bottom: 100%; opacity: 0; }
        }
        .data-dot-down {
          position: absolute;
          left: -1.5px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          animation: flowDown 2s linear infinite;
        }
        .data-dot-up {
          position: absolute;
          left: -1.5px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          animation: flowUp 2.5s linear infinite;
        }
      `}} />

      {/* --- HEADER --- */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-semibold tracking-wider text-zinc-100 uppercase flex items-center gap-2">
            <Zap size={15} className="text-green-400" />
            {title}
          </h3>
          {subtitle && <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>}
        </div>
      </div>

      {/* --- FLOW CONTAINER --- */}
      <div className="flex flex-col items-center w-full my-6 px-2">
        
        {/* 1. BROWSER */}
        <div className="w-full max-w-[240px] flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)] z-10">
          <Monitor size={20} className="text-cyan-400" />
          <div className="flex-1">
            <div className="text-xs font-bold text-zinc-200">User Browser</div>
            <div className="text-[9px] text-zinc-500 font-mono uppercase tracking-tight">React / SSE Client</div>
          </div>
        </div>

        {/* LINK 1: Browser <-> FastAPI */}
        <div className="w-full max-w-[180px] h-10 flex justify-between relative">
          {/* Downward line (Request) */}
          <div className="h-full w-[1px] bg-cyan-500/20 relative ml-8">
            <div className="data-dot-down bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            <ArrowDown size={10} className="absolute -bottom-2 -left-[4.5px] text-cyan-500/50" />
          </div>
          {/* Upward line (Response Stream) */}
          <div className="h-full w-[1px] bg-green-500/20 relative mr-8">
            <div className="data-dot-up bg-green-400 shadow-[0_0_8px_#4ade80]" style={{ animationDelay: '1s' }} />
            <ArrowUp size={10} className="absolute -top-2 -left-[4.5px] text-green-500/50" />
            <div className="absolute top-1/2 -right-14 -translate-y-1/2 text-[8px] text-green-500/60 font-mono font-bold uppercase tracking-widest">
              Stream
            </div>
          </div>
        </div>

        {/* 2. FASTAPI */}
        <div className="w-full p-4 rounded-xl bg-white/5 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.05)] z-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 px-2 py-0.5 bg-purple-500/20 rounded-bl-lg text-[9px] font-mono text-purple-300">
            FastAPI Container
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Server size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-200 uppercase tracking-wide">Logic Engine</div>
              <div className="text-[10px] text-zinc-500 font-mono">Process & Routing</div>
            </div>
          </div>

          {/* Logic Chips */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5">
            <div className="flex flex-col items-center gap-1.5 p-1.5 rounded bg-black/20">
              <ShieldCheck size={12} className="text-cyan-500/70" />
              <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-tighter">Guardrails</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-1.5 rounded bg-black/20">
              <Database size={12} className="text-purple-500/70" />
              <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-tighter">Context</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-1.5 rounded bg-black/20">
              <Activity size={12} className="text-green-500/70" />
              <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-tighter">Metrics</span>
            </div>
          </div>
        </div>

        {/* LINK 2: FastAPI <-> Llama.cpp */}
        <div className="w-full max-w-[180px] h-10 flex justify-between relative">
          <div className="h-full w-[1px] bg-purple-500/20 relative ml-8">
            <div className="data-dot-down bg-purple-400 shadow-[0_0_8px_#a855f7]" style={{ animationDuration: '1.5s' }} />
            <ArrowDown size={10} className="absolute -bottom-2 -left-[4.5px] text-purple-500/50" />
          </div>
          <div className="h-full w-[1px] bg-purple-500/20 relative mr-8">
            <div className="data-dot-up bg-purple-400 shadow-[0_0_8px_#a855f7]" style={{ animationDelay: '0.5s', animationDuration: '1.5s' }} />
            <ArrowUp size={10} className="absolute -top-2 -left-[4.5px] text-purple-500/50" />
            <div className="absolute top-1/2 -right-12 -translate-y-1/2 text-[8px] text-purple-400/60 font-mono font-bold uppercase">
              UDS/TCP
            </div>
          </div>
        </div>

        {/* 3. LLAMA.CPP ENGINE */}
        <div className="w-full max-w-[240px] flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.1)] z-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 px-2 py-0.5 bg-orange-500/20 rounded-bl-lg text-[9px] font-mono text-orange-300">
             RPi 5 HW
          </div>
          <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400">
            <BrainCircuit size={18} />
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-200 uppercase tracking-wide">Llama.cpp Inference</div>
            <div className="text-[10px] text-zinc-500 font-mono">GGUF Quantization (INT4)</div>
          </div>
        </div>

      </div>

      {/* --- STEP LOG (Simple version) --- */}
      <div className="grid grid-cols-2 gap-3 border-t border-white/[0.04] pt-5">
        <div className="text-[10px] leading-relaxed">
          <span className="text-zinc-500 font-mono block mb-1">PROMPT PHASE:</span>
          <p className="text-zinc-400 italic">Messages filtered, history context retrieved, and injected into KV-Cache.</p>
        </div>
        <div className="text-[10px] leading-relaxed border-l border-white/5 pl-3">
          <span className="text-zinc-500 font-mono block mb-1">STREAM PHASE:</span>
          <p className="text-zinc-400 italic">Direct token-by-token streaming via SSE to minimize TTFT latency.</p>
        </div>
      </div>
    </div>
  )
}