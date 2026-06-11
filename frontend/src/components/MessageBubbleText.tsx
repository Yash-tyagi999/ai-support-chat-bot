import React, { useState, useEffect } from 'react';

interface MessageBubbleTextProps {
  text: string;
  animate: boolean;
}

function parseFormat(rawText: string) {
  if (!rawText) return '';

  const lines = rawText.split('\n');

  return lines.map((line, lineIdx) => {
    const parts = line.split(
      /(\*\*.*?\*\*|https?:\/\/[^\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
    );

    const lineContent = parts.map((part, partIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={partIdx}>{part.slice(2, -2)}</strong>;
      }

      if (/^https?:\/\//.test(part)) {
        return (
          <a
            key={partIdx}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-link)', textDecoration: 'underline' }}
          >
            {part}
          </a>
        );
      }

      if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(part)) {
        return (
          <a
            key={partIdx}
            href={`mailto:${part}`}
            style={{ color: 'var(--text-link)', textDecoration: 'underline' }}
          >
            {part}
          </a>
        );
      }

      return part;
    });

    return (
      <React.Fragment key={lineIdx}>
        {lineContent}
        {lineIdx < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

export default function MessageBubbleText({ text, animate }: MessageBubbleTextProps) {
  const [displayedText, setDisplayedText] = useState(animate ? '' : text);

  useEffect(() => {
    if (!animate) {
      setDisplayedText(text);
      return;
    }

    const words = text.split(' ');
    let currentWordIdx = 0;
    setDisplayedText('');

    const timer = setInterval(() => {
      if (currentWordIdx < words.length) {
        const nextWord = words[currentWordIdx];
        setDisplayedText((prev) => 
          prev ? prev + ' ' + nextWord : nextWord
        );
        currentWordIdx++;
      } else {
        clearInterval(timer);
      }
    }, 45);

    return () => clearInterval(timer);
  }, [text, animate]);

  return <span className="chat-bubble-parsed-text">{parseFormat(displayedText)}</span>;
}
