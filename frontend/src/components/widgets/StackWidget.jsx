const CATEGORY_STYLES = {
  'ML & Vision': {
    dot: '#06b6d4', // Cyan
    from: 'rgba(6,182,212,0.12)',
    to: 'rgba(2,132,199,0.08)',
    border: 'rgba(6,182,212,0.22)',
    glow: 'rgba(6,182,212,0.08)',
  },
  'Edge & Mobile': {
    dot: '#a855f7', // Purple
    from: 'rgba(168,85,247,0.12)',
    to: 'rgba(124,58,237,0.08)',
    border: 'rgba(168,85,247,0.22)',
    glow: 'rgba(168,85,247,0.08)',
  },
  'MLOps & Data': {
    dot: '#ec4899', // Pink
    from: 'rgba(236,72,153,0.12)',
    to: 'rgba(219,39,119,0.08)',
    border: 'rgba(236,72,153,0.22)',
    glow: 'rgba(236,72,153,0.08)',
  },
  'Backend & Infra': {
    dot: '#f59e0b', // Amber
    from: 'rgba(245,158,11,0.12)',
    to: 'rgba(217,119,6,0.08)',
    border: 'rgba(245,158,11,0.22)',
    glow: 'rgba(245,158,11,0.08)',
  },
  'Tools & AI Workflow': {
    dot: '#22c55e', // Green
    from: 'rgba(34,197,94,0.12)',
    to: 'rgba(21,128,61,0.08)',
    border: 'rgba(34,197,94,0.22)',
    glow: 'rgba(34,197,94,0.08)',
  },
}

const DEFAULT_STYLE = CATEGORY_STYLES['ML & Vision']

export default function StackWidget({ payload = {} }) {
  // Guard against empty payload
  const categories = Object.keys(payload).length > 0 ? payload : {}
  const totalSkills = Object.values(categories).flat().length

  return (
    <div
      className="rounded-2xl rounded-tl-sm p-6 space-y-6 relative overflow-hidden group"
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Decorative background flare */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-cyan-500/10 transition-colors duration-700" />

      {/* --- HEADER --- */}
      <div className="flex items-center gap-3 relative z-10">
        <div
          className="w-1 h-6 rounded-full flex-shrink-0"
          style={{ background: 'linear-gradient(to bottom, #06b6d4, #a855f7)' }}
        />
        <h3 className="text-sm font-semibold tracking-wider text-zinc-100 uppercase">
          Technology Stack
        </h3>
        <div className="ml-auto">
          <span
            className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wide"
            style={{
              background: 'rgba(6,182,212,0.1)',
              border: '1px solid rgba(6,182,212,0.2)',
              color: '#22d3ee',
            }}
          >
            {totalSkills} technologies
          </span>
        </div>
      </div>

      {/* --- CATEGORIES --- */}
      <div className="space-y-5 relative z-10">
        {Object.entries(categories).map(([category, skills]) => {
          const style = CATEGORY_STYLES[category] || DEFAULT_STYLE

          return (
            <div key={category} className="group/category">
              {/* Category Header */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    background: style.dot,
                    boxShadow: `0 0 8px ${style.dot}`,
                  }}
                />
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover/category:text-zinc-300 transition-colors">
                  {category}
                </span>
                <div className="flex-1 h-px bg-white/5 ml-2" />
              </div>

              {/* Skills Grid */}
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-default transition-all duration-300 hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${style.from}, ${style.to})`,
                      border: `1px solid ${style.border}`,
                      color: '#e4e4e7',
                      boxShadow: `0 2px 8px ${style.glow}`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 4px 16px ${style.glow}, 0 0 12px ${style.glow}`
                      e.currentTarget.style.color = '#fff'
                      e.currentTarget.style.borderColor = style.dot
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = `0 2px 8px ${style.glow}`
                      e.currentTarget.style.color = '#e4e4e7'
                      e.currentTarget.style.borderColor = style.border
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}