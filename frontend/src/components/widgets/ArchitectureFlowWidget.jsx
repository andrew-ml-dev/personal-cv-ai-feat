import {
  Monitor, Server, BrainCircuit,
  ArrowDown, ArrowUp, Zap,
  ShieldCheck, Activity, Search,
  Hash, BarChart2, Layers, History,
} from 'lucide-react'
import {
  DIAGRAM_POST_CHAT_LABEL,
  DIAGRAM_RAG_EMBEDDING_MODEL,
  DIAGRAM_RAG_PHASE_TEXT,
  DIAGRAM_RAG_SUBTITLE,
  DIAGRAM_RAG_TOP_CHUNKS_LABEL,
  DIAGRAM_LLM_SUBTITLE,
  ragChunkLabels,
} from '../../config/env'

// ─── CSS injected once ───────────────────────────────────────────────────────
const ANIM_CSS = `
  @keyframes flowDown {
    0%   { top: -4px;   opacity: 0; }
    15%  { opacity: 1; }
    85%  { opacity: 1; }
    100% { top: 100%;   opacity: 0; }
  }
  @keyframes flowUp {
    0%   { bottom: -4px; opacity: 0; }
    15%  { opacity: 1; }
    85%  { opacity: 1; }
    100% { bottom: 100%; opacity: 0; }
  }
  @keyframes vecPulse {
    0%,100% { opacity: .35; transform: scaleY(1); }
    50%      { opacity:  .9; transform: scaleY(1.15); }
  }
  @keyframes scanLine {
    0%   { transform: translateY(-100%); opacity: .7; }
    100% { transform: translateY(500%);  opacity: 0;  }
  }
  @keyframes chipIn {
    from { opacity: 0; transform: translateX(-6px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes glow {
    0%,100% { opacity:.5; }
    50%      { opacity:1;  }
  }
  .dot-down {
    position:absolute; left:-1.5px;
    width:4px; height:4px; border-radius:50%;
    animation: flowDown linear infinite;
  }
  .dot-up {
    position:absolute; left:-1.5px;
    width:4px; height:4px; border-radius:50%;
    animation: flowUp linear infinite;
  }
  .scan { position:absolute; left:0; right:0; height:1px;
    background: linear-gradient(90deg,transparent,rgba(251,191,36,.55),transparent);
    animation: scanLine 2.2s ease-in-out infinite;
  }
  .vec-bar { animation: vecPulse ease-in-out infinite; }
  .rag-badge { animation: glow 2.5s ease-in-out infinite; }
`

// ─── Small reusable pieces ────────────────────────────────────────────────────
function Chip({ icon, label, colorClass = 'text-zinc-500' }) {
  return (
    <div className="flex flex-col items-center gap-1 p-1.5 rounded bg-black/25">
      <span className={colorClass}>{icon}</span>
      <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-tighter">{label}</span>
    </div>
  )
}

function VConnector({ downColor, upColor, downLabel, upLabel, downSpeed = '2s', upSpeed = '2.5s', downDelay = '0s', upDelay = '1s' }) {
  const dc = {
    cyan:   { line: 'bg-cyan-500/20',   dot: 'bg-cyan-400   shadow-[0_0_7px_#22d3ee]',  arrow: 'text-cyan-500/40',   lbl: 'text-cyan-400/60' },
    amber:  { line: 'bg-amber-500/20',  dot: 'bg-amber-400  shadow-[0_0_7px_#f59e0b]',  arrow: 'text-amber-500/40',  lbl: 'text-amber-400/70' },
    orange: { line: 'bg-orange-500/20', dot: 'bg-orange-400 shadow-[0_0_7px_#f97316]',  arrow: 'text-orange-500/40', lbl: 'text-orange-400/70' },
    green:  { line: 'bg-green-500/20',  dot: 'bg-green-400  shadow-[0_0_7px_#4ade80]',  arrow: 'text-green-500/40',  lbl: 'text-green-400/60' },
    purple: { line: 'bg-purple-500/20', dot: 'bg-purple-400 shadow-[0_0_7px_#a855f7]',  arrow: 'text-purple-500/40', lbl: 'text-purple-400/60' },
  }
  const D = dc[downColor]; const U = dc[upColor]
  return (
    <div className="w-full max-w-[200px] h-9 flex justify-between items-stretch relative">
      {/* down */}
      <div className="relative flex flex-col items-center ml-8">
        <div className={`flex-1 w-[1px] ${D.line} relative`}>
          <div className={`dot-down ${D.dot}`} style={{ animationDuration: downSpeed, animationDelay: downDelay }} />
          <ArrowDown size={9} className={`absolute -bottom-2 -left-[4px] ${D.arrow}`} />
        </div>
        {downLabel && (
          <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[8px] font-mono font-bold uppercase tracking-widest whitespace-nowrap ${D.lbl}`}>
            {downLabel}
          </span>
        )}
      </div>
      {/* up */}
      <div className="relative flex flex-col items-center mr-8">
        <div className={`flex-1 w-[1px] ${U.line} relative`}>
          <div className={`dot-up ${U.dot}`} style={{ animationDuration: upSpeed, animationDelay: upDelay }} />
          <ArrowUp size={9} className={`absolute -top-2 -left-[4px] ${U.arrow}`} />
        </div>
        {upLabel && (
          <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-mono font-bold uppercase tracking-widest whitespace-nowrap ${U.lbl}`}>
            {upLabel}
          </span>
        )}
      </div>
    </div>
  )
}

function OneWayDown({ color, label, speed = '1.8s' }) {
  const dc = {
    amber:  { line: 'bg-amber-500/20',  dot: 'bg-amber-400  shadow-[0_0_7px_#f59e0b]',  arrow: 'text-amber-500/40',  lbl: 'text-amber-400/70' },
    orange: { line: 'bg-orange-500/20', dot: 'bg-orange-400 shadow-[0_0_7px_#f97316]',  arrow: 'text-orange-500/40', lbl: 'text-orange-400/70' },
  }
  const C = dc[color]
  return (
    <div className="w-full max-w-[200px] h-8 flex justify-center relative">
      <div className={`h-full w-[1px] ${C.line} relative`}>
        <div className={`dot-down ${C.dot}`} style={{ animationDuration: speed }} />
        <ArrowDown size={9} className={`absolute -bottom-2 -left-[4px] ${C.arrow}`} />
      </div>
      {label && (
        <span className={`absolute left-[calc(50%+10px)] top-1/2 -translate-y-1/2 text-[8px] font-mono font-bold uppercase tracking-widest whitespace-nowrap ${C.lbl}`}>
          {label}
        </span>
      )}
    </div>
  )
}

// ─── Vector bars mini-chart ───────────────────────────────────────────────────
const BAR_HEIGHTS = [0.55, 0.80, 0.35, 0.95, 0.45, 0.70, 0.60, 0.85, 0.40, 0.75, 0.50, 0.90]

function VecBars() {
  return (
    <div className="flex gap-[2px] items-end h-6 mt-2">
      {BAR_HEIGHTS.map((h, i) => (
        <div
          key={i}
          className="vec-bar flex-1 rounded-sm bg-amber-400/65"
          style={{ height: `${h * 100}%`, animationDelay: `${i * 0.12}s`, animationDuration: '1.8s' }}
        />
      ))}
    </div>
  )
}

// ─── Chunk list with reveal animation ────────────────────────────────────────
function ChunkList() {
  const chunks = ragChunkLabels()
  return (
    <div className="space-y-1 mt-1.5 relative">
      <div className="scan" />
      {chunks.map((c, i) => (
        <div
          key={i}
          className="text-[8px] text-zinc-300 bg-amber-500/10 rounded px-2 py-0.5 flex items-center gap-1.5"
          style={{ animation: 'chipIn .4s ease both', animationDelay: `${i * 0.35}s` }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
          {c}
        </div>
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ArchitectureFlowWidget({ payload = {} }) {
  const { title = 'AI Data Lifecycle', subtitle = '' } = payload

  return (
    <div
      className="rounded-2xl rounded-tl-sm p-5 overflow-hidden relative"
      style={{
        background: 'linear-gradient(145deg,rgba(9,9,11,.9) 0%,rgba(9,9,11,.5) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: ANIM_CSS }} />

      {/* ── HEADER ── */}
      <div className="mb-5 flex justify-between items-start">
        <div>
          <h3 className="text-sm font-semibold tracking-wider text-zinc-100 uppercase flex items-center gap-2">
            <Zap size={14} className="text-green-400" />
            {title}
          </h3>
          {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
        </div>
        <span className="rag-badge text-[9px] font-mono text-amber-400 border border-amber-500/30 rounded px-2 py-0.5 bg-amber-500/5 mt-0.5">
          RAG · EDGE
        </span>
      </div>

      {/* ── FLOW ── */}
      <div className="flex flex-col items-center w-full">

        {/* 1. BROWSER */}
        <div className="w-full max-w-[260px] flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-cyan-500/30 shadow-[0_0_14px_rgba(6,182,212,0.08)] z-10">
          <Monitor size={18} className="text-cyan-400 flex-shrink-0" />
          <div>
            <div className="text-xs font-bold text-zinc-200">User Browser</div>
            <div className="text-[9px] text-zinc-500 font-mono uppercase tracking-tight">React · SSE Client</div>
          </div>
        </div>

        {/* LINK 1: Browser ↔ FastAPI */}
        <VConnector
          downColor="cyan" downLabel={DIAGRAM_POST_CHAT_LABEL} downSpeed="2s"
          upColor="green"  upLabel="SSE stream"       upSpeed="2.5s" upDelay="1s"
        />

        {/* 2. FASTAPI */}
        <div className="w-full p-4 rounded-xl bg-white/[0.04] border border-purple-500/30 shadow-[0_0_18px_rgba(168,85,247,0.06)] z-10 relative">
          <div className="absolute top-0 right-0 px-2 py-0.5 bg-purple-500/20 rounded-bl-lg text-[9px] font-mono text-purple-300">
            FastAPI · Python 3.11
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Server size={16} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-zinc-200 uppercase tracking-wide">Logic Engine</div>
              <div className="text-[9px] text-zinc-500 font-mono">Uvicorn · slowapi · CORS</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5 pt-2.5 border-t border-white/[0.05]">
            <Chip icon={<ShieldCheck size={10} />} label="Guardrails" colorClass="text-cyan-400/80" />
            <Chip icon={<History    size={10} />} label="History"    colorClass="text-purple-400/80" />
            <Chip icon={<Activity   size={10} />} label="Metrics"    colorClass="text-green-400/80" />
          </div>
        </div>

        {/* LINK 2: FastAPI → RAG */}
        <OneWayDown color="amber" label="user query" speed="1.6s" />

        {/* 3. RAG LAYER ── the new piece ── */}
        <div className="w-full p-4 rounded-xl border border-amber-500/35 shadow-[0_0_22px_rgba(245,158,11,0.10)] z-10 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,rgba(120,53,15,.18) 0%,rgba(9,9,11,.7) 100%)' }}
        >
          <div className="absolute top-0 right-0 px-2 py-0.5 bg-amber-500/20 rounded-bl-lg text-[9px] font-mono text-amber-300">
            RAG · Vector Retrieval
          </div>

          {/* Title row */}
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400">
              <Search size={14} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-zinc-200 uppercase tracking-wide">Semantic Search</div>
              <div className="text-[9px] text-zinc-500 font-mono">{DIAGRAM_RAG_SUBTITLE}</div>
            </div>
          </div>

          {/* Two panels: Embed | Search */}
          <div className="grid grid-cols-2 gap-2">

            {/* fastembed panel */}
            <div className="rounded-lg bg-black/35 border border-amber-500/20 p-3">
              <div className="flex items-center gap-1 mb-1">
                <Hash size={9} className="text-amber-400/80" />
                <span className="text-[9px] font-mono text-amber-400/80 font-bold">fastembed</span>
              </div>
              <div className="text-[8px] text-zinc-600 font-mono mb-1">{DIAGRAM_RAG_EMBEDDING_MODEL}</div>
              <VecBars />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[8px] text-zinc-600 font-mono">384-dim vector</span>
                <span className="text-[8px] text-amber-500/60 font-mono">ONNX · CPU</span>
              </div>
            </div>

            {/* ChromaDB panel */}
            <div className="rounded-lg bg-black/35 border border-amber-500/20 p-3 overflow-hidden relative">
              <div className="flex items-center gap-1 mb-1">
                <Layers size={9} className="text-amber-400/80" />
                <span className="text-[9px] font-mono text-amber-400/80 font-bold">ChromaDB</span>
              </div>
              <div className="text-[8px] text-zinc-600 font-mono mb-0.5">persistent · embedded</div>
              <ChunkList />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[8px] text-zinc-600 font-mono">{DIAGRAM_RAG_TOP_CHUNKS_LABEL}</span>
                <span className="text-[8px] text-amber-500/60 font-mono">HNSW</span>
              </div>
            </div>
          </div>

          {/* Context reduction bar */}
          <div className="mt-3 pt-2.5 border-t border-amber-500/10">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[8px] text-zinc-500 font-mono uppercase tracking-wider">Context reduction</span>
              <span className="text-[9px] font-bold text-amber-400 font-mono">~85 %</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-500/80 to-amber-300/60"
                style={{ width: '15%' }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[7px] text-zinc-700 font-mono">relevant context</span>
              <span className="text-[7px] text-zinc-700 font-mono">full CV (not sent)</span>
            </div>
          </div>
        </div>

        {/* LINK 3: RAG → Llama.cpp */}
        <OneWayDown color="orange" label="chunks + prompt" speed="1.5s" />

        {/* 4. LLAMA.CPP */}
        <div className="w-full flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-orange-500/30 shadow-[0_0_14px_rgba(249,115,22,0.10)] z-10 relative">
          <div className="absolute top-0 right-0 px-2 py-0.5 bg-orange-500/20 rounded-bl-lg text-[9px] font-mono text-orange-300">
            RPi 5 · Container
          </div>
          <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 flex-shrink-0">
            <BrainCircuit size={18} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-zinc-200 uppercase tracking-wide">Llama.cpp Engine</div>
            <div className="text-[9px] text-zinc-500 font-mono">{DIAGRAM_LLM_SUBTITLE}</div>
          </div>
        </div>

      </div>

      {/* ── PHASE NOTES ── */}
      <div className="grid grid-cols-2 gap-3 mt-5 border-t border-white/[0.04] pt-4">
        <div className="text-[10px] leading-relaxed">
          <div className="flex items-center gap-1.5 mb-1">
            <BarChart2 size={9} className="text-amber-400/70" />
            <span className="text-amber-400/70 font-mono font-bold uppercase tracking-wider text-[8px]">RAG Phase</span>
          </div>
          <p className="text-zinc-500 italic">{DIAGRAM_RAG_PHASE_TEXT}</p>
        </div>
        <div className="text-[10px] leading-relaxed border-l border-white/[0.05] pl-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap size={9} className="text-orange-400/70" />
            <span className="text-orange-400/70 font-mono font-bold uppercase tracking-wider text-[8px]">Stream Phase</span>
          </div>
          <p className="text-zinc-500 italic">Compact context injected into LLM. Token-by-token SSE stream back to browser, minimising TTFT.</p>
        </div>
      </div>
    </div>
  )
}
