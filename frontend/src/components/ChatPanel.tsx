import { Message } from "../types/chat.types";
import ErrorToast from "./ErrorToast";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

interface ChatPanelProps {
  messages: Message[];
  inputText: string;
  setInputText: (text: string) => void;
  isSending: boolean;
  sessionId: string | null;
  error: string | null;
  setError: (error: string | null) => void;
  onSend: (text: string) => void;
  onReset: () => void;
}

export default function ChatPanel({
  messages,
  inputText,
  setInputText,
  isSending,
  sessionId,
  error,
  setError,
  onSend,
  onReset,
}: ChatPanelProps) {
  return (
    <main className="chat-panel">
      <header className="chat-header">
        <div className="chat-agent-info">
          <div className="agent-avatar">
            AI
            <div className="status-dot"></div>
          </div>
          <div className="agent-name-container">
            <div className="agent-name">AI Assistant</div>
            <div className="agent-status">Online</div>
          </div>
        </div>
        <div className="chat-actions">
          {sessionId && (
            <button
              className="btn-icon"
              title="Reset Conversation Session"
              onClick={onReset}
              aria-label="Reset Conversation"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          )}
        </div>
      </header>

      <ErrorToast error={error} onClose={() => setError(null)} />

      <MessageList messages={messages} isSending={isSending} />

      <ChatInput
        inputText={inputText}
        setInputText={setInputText}
        onSend={onSend}
        isSending={isSending}
      />
    </main>
  );
}
