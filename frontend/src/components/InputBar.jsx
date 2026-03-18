import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles } from 'lucide-react'

export default function InputBar({ onSend, isLoading }) {
  const [value, setValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef(null)

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 128) + 'px'
  }, [value])

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const canSend = value.trim().length > 0 && !isLoading

  return (
    <div className="px-5 pb-4 pt-3 flex-shrink-0">
      <div
        className="relative flex items-end gap-3 rounded-2xl px-4 py-3 transition-all duration-300"
        style={{
          background: 'rgba(24,24,27,0.85)',
          backdropFilter: 'blur(20px)',
          border: isFocused
            ? '1px solid rgba(6,182,212,0.35)'
            : '1px solid rgba(255,255,255,0.08)',
          boxShadow: isFocused
            ? '0 0 0 1px rgba(6,182,212,0.1), 0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(6,182,212,0.08)'
            : '0 4px 24px rgba(0,0,0,0.3)',
        }}
      >
        {/* Sparkle icon */}
        <Sparkles
          size={16}
          className="flex-shrink-0 mb-0.5 transition-colors duration-200"
          style={{ color: isFocused ? 'rgba(6,182,212,0.7)' : 'rgba(113,113,122,0.6)' }}
        />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isLoading}
          placeholder="Ask about Andrew's experience, skills, or projects…"
          rows={1}
          className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-600 resize-none outline-none leading-relaxed"
          style={{ minHeight: '24px', maxHeight: '128px' }}
        />

        {/* Send button */}
        <button
          onClick={submit}
          disabled={!canSend}
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
          style={
            canSend
              ? {
                  background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                  color: '#0c1012',
                  boxShadow: '0 0 16px rgba(6,182,212,0.45)',
                  transform: 'scale(1)',
                }
              : {
                  background: 'rgba(39,39,42,0.8)',
                  color: 'rgba(113,113,122,0.5)',
                }
          }
          onMouseEnter={(e) => canSend && (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => canSend && (e.currentTarget.style.transform = 'scale(1)')}
        >
          {isLoading ? (
            <div
              className="w-4 h-4 rounded-full border-2 border-current animate-spin"
              style={{ borderTopColor: 'transparent' }}
            />
          ) : (
            <Send size={15} />
          )}
        </button>
      </div>

      <p className="text-center text-[10px] text-zinc-700 mt-2 tracking-wide">
        FastAPI + SSE streaming · Edge deployed on Raspberry Pi 5 · Press{' '}
        <kbd className="font-mono text-zinc-600">Enter</kbd> to send
      </p>
    </div>
  )
}
