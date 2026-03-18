export default function ExperienceLogWidget({ payload }) {
  return (
    <div
      className="rounded-2xl rounded-tl-sm p-5"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div
          className="w-1 h-5 rounded-full flex-shrink-0"
          style={{ background: 'linear-gradient(to bottom, #06b6d4, #a855f7)' }}
        />
        <h3 className="text-sm font-semibold text-zinc-100">Work Experience</h3>
        <span className="ml-auto text-[10px] text-zinc-600">{payload.length} positions</span>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical track */}
        <div
          className="absolute left-[6px] top-2"
          style={{
            width: '1px',
            bottom: '8px',
            background:
              'linear-gradient(to bottom, rgba(6,182,212,0.5), rgba(168,85,247,0.3), transparent)',
          }}
        />

        <div className="space-y-5">
          {payload.map((item, i) => (
            <div key={i} className="relative pl-8">
              {/* Glowing node */}
              <div
                className="absolute left-0 top-2 w-3.5 h-3.5 rounded-full border-2 border-cyan-400 bg-zinc-950 z-10"
                style={{
                  boxShadow: '0 0 8px rgba(6,182,212,0.7), 0 0 20px rgba(6,182,212,0.2)',
                }}
              />

              {/* Card */}
              <div
                className="rounded-xl p-4 transition-all duration-200 group"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(6,182,212,0.2)'
                  e.currentTarget.style.background = 'rgba(6,182,212,0.03)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.025)'
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-100 leading-tight">
                      {item.role}
                    </h4>
                    <p
                      className="text-xs font-medium mt-0.5"
                      style={{ color: '#22d3ee' }}
                    >
                      {item.company}
                    </p>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono shrink-0 mt-0.5">
                    {item.date}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed mt-2">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
