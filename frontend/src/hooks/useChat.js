import { useState, useCallback, useRef } from 'react'
import { WELCOME_MESSAGE } from '../data/mockData'

let idCounter = 1
const genId = () => `msg_${idCounter++}_${Date.now()}`

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3234'

export function useChat() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [isTyping, setIsTyping] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const abortRef = useRef(null)

  const pushMessage = useCallback((msg) => {
    const id = genId()
    const full = { id, ...msg }
    setMessages((prev) => [...prev, full])
    return id
  }, [])

  // Sidebar nav click — instant widget response after short typing delay
  const handleNavClick = useCallback(
    (navItem) => {
      if (isTyping || isStreaming) return

      pushMessage({
        sender: 'user',
        type: 'TextBubble',
        payload: { text: navItem.userMsg, isStreaming: false },
      })

      setIsTyping(true)

      setTimeout(
        () => {
          setIsTyping(false)
          pushMessage({
            sender: 'bot',
            type: navItem.botType,
            payload: navItem.getBotPayload(),
          })
        },
        700 + Math.random() * 400,
      )
    },
    [isTyping, isStreaming, pushMessage],
  )

  // Free-text send — streams from FastAPI backend via SSE
  const handleSend = useCallback(
    async (text) => {
      if (!text.trim() || isTyping || isStreaming) return

      pushMessage({
        sender: 'user',
        type: 'TextBubble',
        payload: { text, isStreaming: false },
      })

      setIsStreaming(true)

      const streamId = genId()
      setMessages((prev) => [
        ...prev,
        {
          id: streamId,
          sender: 'bot',
          type: 'TextBubble',
          payload: { text: '', isStreaming: true },
        },
      ])

      const updateStream = (accumulated) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamId ? { ...m, payload: { text: accumulated, isStreaming: true } } : m,
          ),
        )
      }

      const finalizeStream = (accumulated) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamId ? { ...m, payload: { text: accumulated, isStreaming: false } } : m,
          ),
        )
      }

      try {
        const controller = new AbortController()
        abortRef.current = controller

        const response = await fetch(`${BACKEND_URL}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text }),
          signal: controller.signal,
        })

        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let accumulated = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const events = buffer.split('\n\n')
          buffer = events.pop() ?? ''

          for (const event of events) {
            const line = event.trim()
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6)
            if (data === '[DONE]') {
              finalizeStream(accumulated)
              setIsStreaming(false)
              return
            }
            accumulated += data
            updateStream(accumulated)
          }
        }

        finalizeStream(accumulated)
      } catch (err) {
        if (err.name !== 'AbortError') {
          finalizeStream(
            `I can't reach the backend right now. Make sure the FastAPI server is running at ${BACKEND_URL} (\`uvicorn main:app --reload\` in the \`/backend\` folder).`,
          )
        }
      } finally {
        setIsStreaming(false)
        abortRef.current = null
      }
    },
    [isTyping, isStreaming, pushMessage],
  )

  return { messages, isTyping, isStreaming, handleNavClick, handleSend }
}
