import { Mail, Linkedin, Github, MapPin, ExternalLink } from 'lucide-react'

const ICON_MAP = { mail: Mail, linkedin: Linkedin, github: Github, mapPin: MapPin }

const LINK_COLORS = {
  mail: { color: '#22d3ee', bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.2)' },
  linkedin: { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.2)' },
  github: { color: '#e4e4e7', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' },
  mapPin: { color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)' },
}

function parseMarkdown(str) {
  return str
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-zinc-300">$1</em>')
}

export default function ContactWidget({ payload }) {
  const { text = '', links = [] } = payload

  return (
    <div
      className="rounded-2xl rounded-tl-sm p-5 space-y-4"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div
          className="w-1 h-5 rounded-full flex-shrink-0"
          style={{ background: 'linear-gradient(to bottom, #06b6d4, #a855f7)' }}
        />
        <h3 className="text-sm font-semibold text-zinc-100">Get in Touch</h3>
      </div>

      {/* Body text */}
      <p
        className="text-sm text-zinc-300 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: parseMarkdown(text) }}
      />

      {/* Contact links */}
      <div className="space-y-2 pt-1">
        {links.map((link, i) => {
          const Icon = ICON_MAP[link.icon] || Mail
          const style = LINK_COLORS[link.icon] || LINK_COLORS.github

          return (
            <a
              key={i}
              href={link.href ?? undefined}
              target={link.href ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 group"
              style={{
                background: style.bg,
                border: `1px solid ${style.border}`,
                cursor: link.href ? 'pointer' : 'default',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                if (link.href) {
                  e.currentTarget.style.filter = 'brightness(1.15)'
                  e.currentTarget.style.transform = 'translateX(2px)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'brightness(1)'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              <Icon size={15} style={{ color: style.color, flexShrink: 0 }} />
              <span className="text-sm text-zinc-200 flex-1">{link.label}</span>
              {link.href && (
                <ExternalLink size={11} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
              )}
            </a>
          )
        })}
      </div>
    </div>
  )
}
