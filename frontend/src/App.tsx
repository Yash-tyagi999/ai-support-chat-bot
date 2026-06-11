import Sidebar from "./components/Sidebar";
import ChatPanel from "./components/ChatPanel";
import { useChat } from "./hooks/useChat";

export default function App() {
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

  return (
    <div className="app-container">
      <Sidebar onQuickAsk={sendMessage} isSending={isSending} />

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
      />
    </div>
  );
}
