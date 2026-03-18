// Renders rich markdown-lite text for both user and bot messages.
// Bold (**text**), italic (*text*), and newlines are supported.

function parseMarkdown(str) {
  return str
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-zinc-300">$1</em>')
}

export default function TextBubble({ payload, sender }) {
  const { text = '', isStreaming = false } = payload

  if (sender === 'user') {
    return (
      <div
        className="inline-block px-4 py-3 rounded-2xl rounded-tr-sm text-sm text-zinc-100 leading-relaxed"
        style={{
          background:
            'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(8,145,178,0.08) 100%)',
          border: '1px solid rgba(6,182,212,0.18)',
        }}
      >
        {text}
      </div>
    )
  }

  // Bot message
  const paragraphs = text.split('\n')

  return (
    <div
      className="px-5 py-4 rounded-2xl rounded-tl-sm text-sm text-zinc-200 leading-relaxed"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="space-y-2">
        {paragraphs.map((para, i) =>
          para === '' ? (
            <div key={i} className="h-1" />
          ) : (
            <p
              key={i}
              dangerouslySetInnerHTML={{ __html: parseMarkdown(para) }}
            />
          ),
        )}
      </div>
      {isStreaming && text !== '' && (
        <span
          className="inline-block w-0.5 h-4 bg-cyan-400 ml-0.5 animate-blink"
          style={{ verticalAlign: 'middle' }}
        />
      )}
      {isStreaming && text === '' && (
        <span className="inline-flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-typing-dot"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </span>
      )}
    </div>
  )
}
