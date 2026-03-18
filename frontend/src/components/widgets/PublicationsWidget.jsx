import { useState } from 'react'
import { BookOpen, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'

export default function PublicationsWidget({ payload = [] }) {
  const [index, setIndex] = useState(0)

  if (!payload.length) return null

  const article = payload[index]

  const next = () => setIndex((i) => (i + 1) % payload.length)
  const prev = () => setIndex((i) => (i - 1 + payload.length) % payload.length)

  return (
    <div
      className="rounded-2xl p-6 relative overflow-hidden"
      style={{
        background:
          'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-zinc-400">
          <BookOpen size={16} />
        </div>
        <h3 className="text-sm font-semibold text-zinc-100 uppercase">
          Publications
        </h3>
      </div>

      {/* SLIDE */}
      <div className="relative">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-5 rounded-xl transition-all duration-300 group"
          style={{
            background: 'rgba(6,182,212,0.04)',
            border: '1px solid rgba(6,182,212,0.2)',
          }}
        >
          {/* TAG */}
          <span className="text-[9px] px-2 py-0.5 font-mono text-cyan-400 bg-cyan-400/10 rounded">
            {article.tag}
          </span>

          {/* TITLE */}
          <h4 className="mt-3 text-lg font-semibold text-white">
            {article.title}
          </h4>

          {/* INSIGHT */}
          {article.insight && (
            <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
              {article.insight}
            </p>
          )}

          {/* PROBLEM / SOLUTION */}
          {(article.problem || article.solution) && (
            <div className="mt-4 text-xs text-zinc-400">
              {article.problem && (
                <div>
                  <span className="text-red-400">Problem:</span>{' '}
                  {article.problem}
                </div>
              )}
              {article.solution && (
                <div>
                  <span className="text-green-400">Solution:</span>{' '}
                  {article.solution}
                </div>
              )}
            </div>
          )}

          {/* FOOTER */}
          <div className="mt-4 flex justify-between items-center text-xs text-zinc-500 font-mono">
            <span>{article.readTime}</span>
            <ExternalLink className="group-hover:text-cyan-400 transition" size={16} />
          </div>
        </a>

        {/* NAV BUTTONS */}
        <button
          onClick={prev}
          className="absolute left-[-10px] top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 border border-white/10 hover:bg-white/10"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          onClick={next}
          className="absolute right-[-10px] top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 border border-white/10 hover:bg-white/10"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* DOTS */}
      <div className="flex justify-center gap-2 mt-5">
        {payload.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className="w-2 h-2 rounded-full cursor-pointer transition-all"
            style={{
              background: i === index ? '#22d3ee' : '#3f3f46',
              transform: i === index ? 'scale(1.3)' : 'scale(1)',
            }}
          />
        ))}
      </div>
    </div>
  )
}