import { useEffect, useRef } from "react";
import { Message } from "../types/chat.types";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  isSending: boolean;
}

export default function MessageList({ messages, isSending }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on new messages or typing status changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  if (messages.length === 0) {
    return (
      <div className="messages-container" style={{ justifyContent: "center" }}>
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <h3 style={{ color: "var(--text-title)" }}>Start a conversation</h3>
          <p style={{ fontSize: "0.875rem" }}>
            Ask me about our products, shipping, returns, or support hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-container">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {isSending && (
        <div className="typing-indicator">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
