import { useState, useEffect } from "react";
import { Message } from "../types/chat.types";
import { api } from "../services/api";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(
    localStorage.getItem("chat_session_id"),
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      api
        .fetchHistory(sessionId)
        .then((history) => {
          setMessages(history);
        })
        .catch((err) => {
          console.warn("Could not load history:", err.message);
          localStorage.removeItem("chat_session_id");
          setSessionId(null);
        });
    }
  }, [sessionId]);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isSending) return;

    setError(null);
    setIsSending(true);

    const tempUserMsg: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      text: trimmed,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setInputText("");

    try {
      const data = await api.sendMessage(trimmed, sessionId);

      if (!sessionId && data.sessionId) {
        localStorage.setItem("chat_session_id", data.sessionId);
        setSessionId(data.sessionId);
      }

      const newAiMsg: Message = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: data.reply,
        timestamp: new Date().toISOString(),
        isNew: true,
      };
      setMessages((prev) => [...prev, newAiMsg]);
    } catch (err: any) {
      console.error("Error sending message:", err);
      setError(err.message || "Unable to connect to the chat server.");
    } finally {
      setIsSending(false);
    }
  };

  const resetSession = () => {
    if (window.confirm("Are you sure you want to clear this conversation history?")) {
      localStorage.removeItem("chat_session_id");
      setSessionId(null);
      setMessages([]);
      setError(null);
    }
  };

  return {
    messages,
    inputText,
    setInputText,
    isSending,
    sessionId,
    error,
    setError,
    sendMessage,
    resetSession,
  };
}
