import { useState } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import ChatFeed from './components/ChatFeed'
import InputBar from './components/InputBar'
import { useChat } from './hooks/useChat'

export default function App() {
  const [activeSection, setActiveSection] = useState(null)
  const { messages, isTyping, isStreaming, handleNavClick, handleSend } = useChat()

  const onNavClick = (item) => {
    setActiveSection(item.id)
    handleNavClick(item)
  }

  return (
    <div className="h-screen w-screen flex overflow-hidden font-sans bg-zinc-950 relative">
      {/* Ambient background gradients */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 50% at 10% 0%, rgba(6,182,212,0.05) 0%, transparent 55%), ' +
            'radial-gradient(ellipse 70% 40% at 90% 100%, rgba(168,85,247,0.05) 0%, transparent 55%)',
        }}
      />

      {/* Sidebar */}
      <Sidebar onNavClick={onNavClick} activeSection={activeSection} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <TopBar />
        <ChatFeed messages={messages} isTyping={isTyping} />
        <InputBar onSend={handleSend} isLoading={isStreaming} />
      </div>
    </div>
  )
}
