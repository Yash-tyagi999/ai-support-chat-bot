import { Message } from "../types/chat.types";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = {
  async fetchHistory(sessionId: string): Promise<Message[]> {
    const res = await fetch(`${BACKEND_URL}/chat/history/${sessionId}`);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Failed to fetch history");
    }
    const data = await res.json();
    return data.messages;
  },

  async sendMessage(
    message: string,
    sessionId: string | null,
  ): Promise<{ reply: string; sessionId: string }> {
    const res = await fetch(`${BACKEND_URL}/chat/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sessionId }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to send message");
    }
    return data;
  },
};
