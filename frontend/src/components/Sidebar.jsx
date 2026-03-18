import { User, Briefcase, Cpu, Layers, Mail, Github, MapPin, Zap, Bot, GraduationCap, BookOpen, FileText} from 'lucide-react'
import { NAV_ITEMS } from '../data/mockData'
import {
  FULL_NAME,
  INITIALS,
  JOB_TITLE,
  AVATAR_IMAGE_URL,
  AVAILABILITY,
  STATS,
  LOCATION,
  GITHUB_USERNAME,
  FOOTER_TAGLINE,
} from '../config'

const ICON_MAP = { user: User, briefcase: Briefcase, cpu: Cpu, layers: Layers, mail: Mail, library: GraduationCap, book: BookOpen, bot: Bot, file: FileText }

export default function Sidebar({ onNavClick, activeSection }) {
  return (
    <aside className="w-72 flex-shrink-0 flex flex-col h-full border-r border-white/[0.06] bg-zinc-900/50 backdrop-blur-xl relative z-10">
      {/* Subtle inner highlight */}
      <div
        className="absolute inset-y-0 right-0 w-px"
        style={{
          background:
            'linear-gradient(to bottom, transparent, rgba(6,182,212,0.15) 30%, rgba(168,85,247,0.1) 70%, transparent)',
        }}
      />

      {/* ── Profile ── */}
      <div className="p-6 pb-5">
        <div className="flex items-start gap-4 mb-5">
          {/* Avatar — photo or initials fallback */}
          <div className="relative flex-shrink-0">
            {AVATAR_IMAGE_URL ? (
              <img
                src={AVATAR_IMAGE_URL}
                alt={FULL_NAME}
                className="w-14 h-14 rounded-2xl object-cover"
                style={{ border: '1px solid rgba(6,182,212,0.25)' }}
              />
            ) : (
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold gradient-text"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(168,85,247,0.15))',
                  border: '1px solid rgba(6,182,212,0.25)',
                  boxShadow: '0 0 15px rgba(6,182,212,0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                {INITIALS}
              </div>
            )}
            {/* Online pulse */}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-400 border-2 border-zinc-900" />
            </span>
          </div>

          <div className="min-w-0">
            <h1 className="text-base font-bold text-white leading-tight">{FULL_NAME}</h1>
            <p className="text-xs text-zinc-400 mt-0.5 leading-tight">{JOB_TITLE}</p>
            {/* Availability badge */}
            {AVAILABILITY.show && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-400/10 border border-green-400/20 text-green-400 text-[10px] font-semibold tracking-wide uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                {AVAILABILITY.label}
              </div>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          {STATS.map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl p-2 text-center"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="text-sm font-bold gradient-text">{value}</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-4 h-px bg-white/[0.05]" />

      {/* ── Navigation ── */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest px-3 mb-2.5">
          Cards
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = ICON_MAP[item.icon] || User
          const isActive = activeSection === item.id

          return (
            <button
              key={item.id}
              onClick={() => onNavClick(item)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative"
              style={
                isActive
                  ? {
                      background: 'rgba(6,182,212,0.08)',
                      border: '1px solid rgba(6,182,212,0.2)',
                      color: '#67e8f9',
                      boxShadow: '0 0 15px rgba(6,182,212,0.1)',
                    }
                  : {
                      background: 'transparent',
                      border: '1px solid transparent',
                      color: '#a1a1aa',
                    }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.color = '#e4e4e7'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'transparent'
                  e.currentTarget.style.color = '#a1a1aa'
                }
              }}
            >
              <Icon
                size={16}
                className="transition-colors"
                style={{ color: isActive ? '#22d3ee' : 'inherit', opacity: isActive ? 1 : 0.7 }}
              />
              <span>{item.label}</span>
              {isActive && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"
                />
              )}
            </button>
          )
        })}
      </nav>

      <div className="mx-4 h-px bg-white/[0.05]" />

      {/* ── Footer ── */}
      <div className="p-4 space-y-2">
        {LOCATION && (
          <div className="flex items-center gap-2.5 text-xs text-zinc-500">
            <MapPin size={11} className="text-zinc-600 flex-shrink-0" />
            <span>{LOCATION}</span>
          </div>
        )}
        {GITHUB_USERNAME && (
          <div className="flex items-center gap-2.5 text-xs text-zinc-500">
            <Github size={11} className="text-zinc-600 flex-shrink-0" />
            <span>{GITHUB_USERNAME}</span>
          </div>
        )}
        <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <Bot size={12} className="text-cyan-400/60" />
          <span className="text-[10px] text-zinc-600">{FOOTER_TAGLINE}</span>
          <Zap size={9} className="text-yellow-500/50 ml-auto" />
        </div>
      </div>
    </aside>
  )
}
