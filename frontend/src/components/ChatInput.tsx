import React from "react";

interface ChatInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  onSend: (text: string) => void;
  isSending: boolean;
}

export default function ChatInput({ inputText, setInputText, onSend, isSending }: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isSending) {
      onSend(inputText);
    }
  };

  return (
    <footer className="chat-footer">
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chat-input"
          placeholder={isSending ? "Agent is typing..." : "Type your question here..."}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          maxLength={1000}
          disabled={isSending}
          aria-label="Message Input"
        />
        {inputText.length > 800 && (
          <span className={`char-counter ${inputText.length > 950 ? "warning" : ""}`}>
            {inputText.length}/1000
          </span>
        )}
        <button
          type="submit"
          className="btn-send"
          disabled={isSending || !inputText.trim()}
          title="Send Message"
          aria-label="Send Button"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </footer>
  );
}
