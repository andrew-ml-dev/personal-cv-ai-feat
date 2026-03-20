import { Activity, Cpu, Wifi } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { TOPBAR } from '../config'
import { API_STATS_PATH, STATS_POLL_INTERVAL_MS } from '../config/env'

const STATS_ENDPOINT = API_STATS_PATH
const STATS_POLL_INTERVAL = STATS_POLL_INTERVAL_MS

const DEFAULT_STATS = {
  cpu_percent: 0,
  memory_percent: 0,
  llm_model: 'No info',
  llm_engine: 'No info',
  device_name: 'No info',
  tokens_per_second: 0,
  tokens_generated: 0,
  generation_active: false,
  active_session_id: null,
  context_tokens: 0,
}

// 🧠 Hook for fetching stats (optimized to prevent race conditions)
function useSystemStats() {
  const [stats, setStats] = useState(DEFAULT_STATS)
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    let timeoutId

    const fetchStats = async () => {
      try {
        const response = await fetch(STATS_ENDPOINT, { signal: controller.signal })
        if (!response.ok) throw new Error('Failed to load stats')

        const payload = await response.json()
        setStats((prev) => ({ ...prev, ...payload }))
        setOffline(false)
      } catch (error) {
        if (error.name === 'AbortError') return
        console.error('Unable to fetch stats', error)
        setOffline(true)
      } finally {
        if (!controller.signal.aborted) {
          timeoutId = setTimeout(fetchStats, STATS_POLL_INTERVAL)
        }
      }
    }

    fetchStats()

    return () => {
      controller.abort()
      clearTimeout(timeoutId)
    }
  }, [])

  return { stats, offline }
}

export default function TopBar() {
  const { stats, offline } = useSystemStats()
  const numberFormatter = useMemo(() => new Intl.NumberFormat('en-US'), [])

  // Prepare fallback values
  const cpuPercent = stats.cpu_percent || 0
  const memoryPercent = stats.memory_percent || 0
  const tokensPerSecond = stats.tokens_per_second || 0
  const tokensGenerated = stats.tokens_generated || 0
  const generationActive = Boolean(stats.generation_active)

  // Status logic
  const statusLabel = offline ? 'Offline' : generationActive ? 'Active' : 'Idle'
  const statusColor = offline
    ? 'text-zinc-500/60'
    : generationActive
      ? 'text-green-400'
      : 'text-amber-300'

  return (
    <header
      className="flex items-center justify-between px-5 py-2.5 border-b border-white/[0.05] flex-shrink-0"
      style={{ background: 'rgba(9,9,11,0.7)', backdropFilter: 'blur(12px)' }}
    >
      {/* Left section — LIVE indicator */}
      <div className="flex items-center gap-2.5">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{
            background: 'rgba(34,197,94,0.06)',
            border: '1px solid rgba(34,197,94,0.2)',
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          <span className="text-green-400">{TOPBAR.liveLabel}</span>
          <span className="text-green-400/60">⚡</span>
        </div>
      </div>

      {/* Right section — system metrics (layout swapped) */}
      <div className="flex items-center gap-4">
        {/* --- 🧠 Dynamic stats (left side uses fixed width + tabular numbers to avoid flicker) --- */}

        {/* CPU */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="text-zinc-400">CPU</span>
          <span className="text-green-400 font-mono font-medium tabular-nums w-[40px] text-right">
            {cpuPercent.toFixed(0)}%
          </span>
        </div>
        <div className="w-px h-3 bg-white/10" />

        {/* Mem */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="text-zinc-400">Mem</span>
          <span className="text-cyan-400 font-mono font-medium tabular-nums w-[40px] text-right">
            {memoryPercent.toFixed(0)}%
          </span>
        </div>
        <div className="w-px h-3 bg-white/10" />

        {/* Tokens/sec */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Activity size={11} className="text-zinc-600" />
          <span className="text-zinc-400">T/s</span>
          <span className="text-green-400 font-mono font-medium tabular-nums w-[48px] text-right">
            {tokensPerSecond.toFixed(1)}
          </span>
        </div>
        <div className="w-px h-3 bg-white/10" />

        {/* Total Tokens & Ctx */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="text-zinc-400">Generated</span>
          <span className="text-cyan-400 font-mono font-medium tabular-nums">
            {numberFormatter.format(tokensGenerated)}
          </span>
          <span className="text-[10px] text-zinc-500/70 font-mono pl-1">
            / {numberFormatter.format(stats.context_tokens)} ctx
          </span>
        </div>
        <div className="w-px h-3 bg-white/10" />

        {/* Network status and session */}
        <div className="flex items-center gap-1.5 text-xs">
          <Wifi size={11} className={statusColor} />
          <span className={`${statusColor} font-medium`}>{statusLabel}</span>
          {stats.active_session_id && (
            <span className="text-[10px] text-zinc-600 font-mono pl-0.5">
              #{stats.active_session_id.slice(0, 8)}
            </span>
          )}
        </div>

        {/* === 🚧 Divider between dynamic stats and static info 🚧 === */}
        <div className="w-px h-4 bg-white/15 mx-1" />

        {/* --- 🛠️ Static info (right column) --- */}

        {/* Device */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Cpu size={11} className="text-zinc-700 flex-shrink-0" />
          <span className="pl-1 text-zinc-700">Device:</span>
          <span className="text-zinc-400">{stats.device_name}</span>
        </div>

        {/* Model */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Cpu size={11} className="text-zinc-700 flex-shrink-0" />
          <span className="pl-1 text-zinc-700">Model:</span>
          <span className="text-zinc-400">{stats.llm_model}</span>
        </div>

        {/* Engine */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Cpu size={11} className="text-zinc-700 flex-shrink-0" />
          <span className="pl-1 text-zinc-700">Engine:</span>
          <span className="text-zinc-400">{stats.llm_engine}</span>
        </div>
      </div>
    </header>
  )
}