// ─── Simulated CV camera feed with live bounding boxes ───────────────────────
function CVDemo() {
  return (
    <div
      className="relative w-full rounded-xl overflow-hidden"
      style={{
        height: '200px',
        background: '#050608',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Grid background — simulates sensor/camera grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(6,182,212,0.07) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(6,182,212,0.07) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* ── Primary detection box (cyan) ── */}
      <div
        className="absolute"
        style={{
          top: '18%',
          left: '12%',
          width: '44%',
          height: '48%',
          border: '1.5px solid #06b6d4',
          boxShadow:
            '0 0 10px rgba(6,182,212,0.55), inset 0 0 12px rgba(6,182,212,0.06)',
        }}
      >
        {/* Corner brackets */}
        {[
          { top: '-3px', left: '-3px', borderTop: '2px solid #06b6d4', borderLeft: '2px solid #06b6d4' },
          { top: '-3px', right: '-3px', borderTop: '2px solid #06b6d4', borderRight: '2px solid #06b6d4' },
          { bottom: '-3px', left: '-3px', borderBottom: '2px solid #06b6d4', borderLeft: '2px solid #06b6d4' },
          { bottom: '-3px', right: '-3px', borderBottom: '2px solid #06b6d4', borderRight: '2px solid #06b6d4' },
        ].map((s, idx) => (
          <div
            key={idx}
            className="absolute w-3 h-3"
            style={s}
          />
        ))}

        {/* Label chip */}
        <div
          className="absolute -top-6 left-0 flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold"
          style={{ background: '#06b6d4', color: '#050608', whiteSpace: 'nowrap' }}
        >
          scratch_defect · 0.94
        </div>

        {/* Inner crosshair */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-20"
          style={{ pointerEvents: 'none' }}
        >
          <div className="w-full h-px bg-cyan-400" />
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center opacity-20"
          style={{ pointerEvents: 'none' }}
        >
          <div className="h-full w-px bg-cyan-400" />
        </div>
      </div>

      {/* ── Secondary detection box (magenta) ── */}
      <div
        className="absolute"
        style={{
          top: '28%',
          left: '62%',
          width: '22%',
          height: '28%',
          border: '1.5px solid #e879f9',
          boxShadow:
            '0 0 8px rgba(232,121,249,0.5), inset 0 0 8px rgba(232,121,249,0.05)',
        }}
      >
        <div
          className="absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold"
          style={{ background: '#e879f9', color: '#0a0010', whiteSpace: 'nowrap' }}
        >
          chip_missing · 0.87
        </div>
      </div>

      {/* ── Animated scan line ── */}
      <div
        className="absolute left-0 right-0 h-px cv-scan-line"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.6) 30%, rgba(6,182,212,0.9) 50%, rgba(6,182,212,0.6) 70%, transparent 100%)',
        }}
      />

      {/* ── Corner HUD decorations ── */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5">
        <div className="w-2 h-2 border-t border-l border-cyan-400/40" />
        <span className="text-[9px] font-mono text-cyan-400/50 tracking-wider">REC ●</span>
      </div>
      <div className="absolute top-2 right-2">
        <div className="w-2 h-2 border-t border-r border-cyan-400/40 ml-auto" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5 flex items-center justify-between"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
        }}
      >
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[9px] font-mono text-green-400">PROCESSING</span>
        </div>
        <div className="flex items-center gap-3 text-[9px] font-mono text-zinc-500">
          <span>Frame: 12,847</span>
          <span className="text-cyan-400">83 FPS</span>
          <span>12ms</span>
        </div>
      </div>
    </div>
  )
}

// ─── Single project card ──────────────────────────────────────────────────────
function ProjectCard({ project }) {
  return (
    <div
      className="rounded-xl p-4 transition-all duration-200"
      style={{
        background: project.featured
          ? 'rgba(6,182,212,0.03)'
          : 'rgba(255,255,255,0.02)',
        border: project.featured
          ? '1px solid rgba(6,182,212,0.15)'
          : '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {project.featured && (
        <div className="mb-4">
          <CVDemo />
        </div>
      )}

      {/* Title */}
      <div className="flex justify-between mb-1">
        <h4 className="text-sm font-semibold text-zinc-100">
          {project.title}
        </h4>
        {project.featured && (
          <span className="text-[9px] text-cyan-400">Featured</span>
        )}
      </div>

      {/* Model */}
      <div className="text-[10px] text-zinc-500 font-mono mb-2">
        {project.model}
      </div>

      {/* Description */}
      <p className="text-xs text-zinc-400 mb-3">
        {project.description}
      </p>

      {/* Evolution */}
      {project.evolution && (
        <div className="text-[9px] font-mono text-zinc-600 mb-2">
          {project.evolution.join(' → ')}
        </div>
      )}

      {/* Pipeline */}
      {project.pipeline && (
        <div className="text-[10px] font-mono text-cyan-400 mb-2">
          {project.pipeline}
        </div>
      )}

      {/* Metrics */}
      <div className="text-[10px] font-mono text-cyan-400 mb-2">
        {project.metrics}
      </div>

      {/* Problem / Solution */}
      {(project.problem || project.solution) && (
        <div className="text-[10px] text-zinc-500 mb-2">
          {project.problem && (
            <div>
              <span className="text-red-400">Problem:</span>{' '}
              {project.problem}
            </div>
          )}
          {project.solution && (
            <div>
              <span className="text-green-400">Solution:</span>{' '}
              {project.solution}
            </div>
          )}
        </div>
      )}

      {/* Scale */}
      {project.scale && (
        <div className="text-[9px] text-purple-400 mb-2">
          {project.scale}
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-[10px] text-zinc-400 border border-zinc-700 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Widget root ─────────────────────────────────────────────────────────────
export default function ProjectVisionWidget({ payload }) {
  const projects = Array.isArray(payload) ? payload : [payload]

  return (
    <div
      className="rounded-2xl rounded-tl-sm p-5 space-y-4"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-1 h-5 rounded-full flex-shrink-0"
          style={{ background: 'linear-gradient(to bottom, #06b6d4, #a855f7)' }}
        />
        <h3 className="text-sm font-semibold text-zinc-100">Projects</h3>
        <span className="ml-auto text-[10px] text-zinc-600">
          {projects.length} featured
        </span>
      </div>

      <div className="space-y-3">
        {projects.map((project, i) => (
          <ProjectCard key={i} project={project} />
        ))}
      </div>
    </div>
  )
}
