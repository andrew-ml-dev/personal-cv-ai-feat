import { useState } from 'react'
import { Download, ExternalLink, FileText, FileDown, Loader2, Check } from 'lucide-react'

function toRawGithubUrl(url) {
  if (!url) return '#'
  return url
    .replace('github.com', 'raw.githubusercontent.com')
    .replace('/blob/', '/')
}

function DocPreview() {
  return (
    <div className="relative w-[88px] h-[120px] flex-shrink-0 select-none">
      {/* Shadow stack layers */}
      <div className="absolute top-2 left-2 w-full h-full rounded bg-white/5 border border-white/5" />
      <div className="absolute top-1 left-1 w-full h-full rounded bg-white/8 border border-white/8" />

      {/* Main doc card */}
      <div className="relative w-full h-full bg-zinc-50 rounded shadow-xl overflow-hidden border border-zinc-200/20 group-hover:scale-105 transition-transform duration-500">
        {/* Header stripe */}
        <div className="h-7 bg-gradient-to-r from-cyan-500 to-blue-600 flex items-end px-2 pb-1 gap-1">
          <div className="w-3 h-3 rounded-full bg-white/30" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
        </div>

        {/* Content lines */}
        <div className="px-2 pt-2 space-y-1.5">
          <div className="w-3/4 h-[3px] bg-zinc-700 rounded-full" />
          <div className="w-1/2 h-[2px] bg-zinc-400 rounded-full" />
          <div className="mt-2 w-full h-[1.5px] bg-zinc-200 rounded-full" />
          <div className="w-5/6 h-[1.5px] bg-zinc-200 rounded-full" />
          <div className="w-4/6 h-[1.5px] bg-zinc-200 rounded-full" />
          <div className="mt-1 w-full h-[1.5px] bg-zinc-100 rounded-full" />
          <div className="w-full h-[1.5px] bg-zinc-100 rounded-full" />
          <div className="w-3/4 h-[1.5px] bg-zinc-100 rounded-full" />
          <div className="mt-1 w-full h-[1px] bg-zinc-100 rounded-full" />
          <div className="w-5/6 h-[1px] bg-zinc-100 rounded-full" />
        </div>

        {/* PDF badge */}
        <div className="absolute bottom-1.5 right-1.5 bg-red-500/90 text-white text-[7px] font-bold px-1 py-0.5 rounded-sm tracking-wide">
          PDF
        </div>
      </div>
    </div>
  )
}

function DownloadButton({ onClick, loading, done, icon: Icon, label, sublabel, accent }) {
  return (
    <button
      onClick={onClick}
      disabled={loading || done}
      className={`
        relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-left w-full transition-all duration-200
        ${accent === 'cyan'
          ? 'bg-cyan-500 hover:bg-cyan-400 active:scale-[.98] text-black shadow-lg shadow-cyan-500/25'
          : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white active:scale-[.98]'
        }
        disabled:opacity-70 disabled:cursor-default
      `}
    >
      <span className={`flex-shrink-0 ${accent === 'cyan' ? 'text-black/70' : 'text-zinc-400'}`}>
        {loading ? (
          <Loader2 size={15} className="animate-spin" />
        ) : done ? (
          <Check size={15} className={accent === 'cyan' ? 'text-black' : 'text-cyan-400'} />
        ) : (
          <Icon size={15} />
        )}
      </span>
      <div className="min-w-0">
        <div className={`text-xs font-bold leading-tight ${accent === 'cyan' ? 'text-black' : 'text-white'}`}>
          {done ? 'Downloaded!' : label}
        </div>
        <div className={`text-[10px] leading-tight mt-0.5 ${accent === 'cyan' ? 'text-black/60' : 'text-zinc-500'}`}>
          {sublabel}
        </div>
      </div>
    </button>
  )
}

export default function ResumeWidget({ payload = {} }) {
  const {
    fileName = 'Resume_Andrew.md',
    githubUrl = '',
    pdfUrl = '',
  } = payload

  const rawUrl = toRawGithubUrl(githubUrl)

  const [mdState, setMdState] = useState('idle')
  const [pdfState, setPdfState] = useState('idle')

  const downloadFile = async ({ url, name, type, setStatus }) => {
    if (!url) return
    setStatus('loading')
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const objectUrl = window.URL.createObjectURL(new Blob([blob], { type }))
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = name
      a.click()
      window.URL.revokeObjectURL(objectUrl)
      setStatus('done')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (e) {
      console.error('Download failed', e)
      setStatus('idle')
    }
  }

  return (
    <div
      className="rounded-2xl rounded-tl-sm p-5 relative overflow-hidden group"
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(24px)',
      }}
    >
      {/* Ambient glow */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-cyan-500/10 blur-[70px] rounded-full pointer-events-none group-hover:bg-cyan-500/18 transition-colors duration-700" />
      <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-blue-600/8 blur-[60px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex gap-5 items-start">
        <DocPreview />

        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="mb-0.5 flex items-center gap-2">
            <FileText size={13} className="text-cyan-400 flex-shrink-0" />
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Curriculum Vitae</span>
          </div>
          <h3 className="text-base font-bold text-white leading-tight mb-0.5">
            Andrew Ludkiewicz
          </h3>
          <p className="text-[10px] text-zinc-500 font-mono mb-4 truncate">
            {fileName}
          </p>

          {/* Download buttons */}
          <div className="space-y-2">
            {pdfUrl && (
              <DownloadButton
                icon={FileDown}
                label="Download PDF"
                sublabel="Best for sharing & ATS"
                accent="cyan"
                loading={pdfState === 'loading'}
                done={pdfState === 'done'}
                onClick={() => downloadFile({
                  url: pdfUrl,
                  name: fileName.replace('.md', '.pdf'),
                  type: 'application/pdf',
                  setStatus: setPdfState,
                })}
              />
            )}
            <DownloadButton
              icon={Download}
              label="Download Markdown"
              sublabel="Raw source, easy to edit"
              accent="ghost"
              loading={mdState === 'loading'}
              done={mdState === 'done'}
              onClick={() => downloadFile({
                url: rawUrl,
                name: fileName,
                type: 'text/markdown',
                setStatus: setMdState,
              })}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-4 pt-3.5 border-t border-white/5 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {['GitHub Hosted', 'ATS Friendly', 'Always Up-to-Date'].map((tag) => (
            <span key={tag} className="flex items-center gap-1 text-[10px] text-zinc-500">
              <span className="w-1 h-1 rounded-full bg-cyan-500/50 inline-block" />
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={() => window.open(githubUrl, '_blank')}
          className="flex items-center gap-1.5 text-[10px] text-zinc-400 hover:text-cyan-400 transition-colors flex-shrink-0"
        >
          <ExternalLink size={11} />
          View on GitHub
        </button>
      </div>
    </div>
  )
}
