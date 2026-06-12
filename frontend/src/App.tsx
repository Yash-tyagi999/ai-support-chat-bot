import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatPanel from "./components/ChatPanel";
import { useChat } from "./hooks/useChat";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    messages,
    inputText,
    setInputText,
    isSending,
    sessionId,
    error,
    setError,
    sendMessage,
    resetSession,
  } = useChat();

  const handleQuickAsk = (questionText: string) => {
    sendMessage(questionText);
    setIsSidebarOpen(false);
  };

  return (
    <div className={`app-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
      {isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
      )}

      <Sidebar
        onQuickAsk={handleQuickAsk}
        isSending={isSending}
        isMobileOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />

      <ChatPanel
        messages={messages}
        inputText={inputText}
        setInputText={setInputText}
        isSending={isSending}
        sessionId={sessionId}
        error={error}
        setError={setError}
        onSend={sendMessage}
        onReset={resetSession}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
    </div>
  );
}
