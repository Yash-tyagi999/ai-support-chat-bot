import { Message } from "../types/chat.types";
import MessageBubbleText from "./MessageBubbleText";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user";
  const timeString = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`message-wrapper ${message.sender}`}>
      <div className="message-bubble">
        <MessageBubbleText text={message.text} animate={!!message.isNew} />
      </div>
      <div className="message-meta">
        {isUser ? "You" : "Agent"} &bull; {timeString}
      </div>
    </div>
  );
}
