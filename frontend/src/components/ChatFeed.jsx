import { useEffect, useRef } from 'react'
import TypingIndicator from './TypingIndicator'
import { getWidget } from './widgets/WidgetRegistry'

const BOT_AVATAR = (
  <div
    className="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5"
    style={{
      background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(168,85,247,0.2))',
      border: '1px solid rgba(6,182,212,0.25)',
      color: '#22d3ee',
      boxShadow: '0 0 10px rgba(6,182,212,0.1)',
    }}
  >
    AI
  </div>
)

export default function ChatFeed({ messages, isTyping }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
      {messages.map((msg) => {
        const Widget = getWidget(msg.type)
        const isUser = msg.sender === 'user'

        return (
          <div
            key={msg.id}
            className={`flex items-end gap-3 animate-fade-in-up ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            {!isUser && BOT_AVATAR}

            <div className={isUser ? 'max-w-sm' : 'max-w-2xl flex-1 min-w-0'}>
              {!isUser && (
                <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5 ml-1">
                  Andrzej Ludkiewicz · AI
                </p>
              )}
              <Widget payload={msg.payload} sender={msg.sender} />
            </div>
          </div>
        )
      })}

      {isTyping && (
        <div className="flex items-end gap-3 animate-fade-in-up">
          {BOT_AVATAR}
          <div>
            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5 ml-1">
              Andrzej Ludkiewicz · AI
            </p>
            <TypingIndicator />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
