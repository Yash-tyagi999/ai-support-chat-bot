import { FAQ } from "../types/chat.types";

interface SidebarProps {
  onQuickAsk: (questionText: string) => void;
  isSending: boolean;
}

const sampleFaqs: FAQ[] = [
  { q: "What is your shipping policy?", desc: "Check shipping times and rules." },
  { q: "What is your return/refund policy?", desc: "Read our 30-day return policy." },
  { q: "What are your support hours?", desc: "View operational customer service hours." },
  { q: "Do you ship to USA?", desc: "Confirm shipping capabilities to the US." },
];

export default function Sidebar({ onQuickAsk, isSending }: SidebarProps) {
  return (
    <aside className="info-sidebar">
      <div className="brand-header">
        <div className="brand-logo">S</div>
        <div>
          <h1 className="brand-name">Store Support</h1>
          <p className="tagline">Customer Support Portal</p>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Store Information
        </h2>
        <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: "1.6" }}>
          <p><strong>Support Hours:</strong><br />Monday – Friday, 9:00 AM – 6:00 PM EST</p>
          <p style={{ marginTop: "0.5rem" }}><strong>Email Support:</strong><br /><a href="mailto:support@example.com" style={{ color: "var(--text-link)" }}>support@example.com</a></p>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          Quick-Ask FAQs (Click to send)
        </h2>
        <div className="faq-list" style={{ marginTop: "0.75rem" }}>
          {sampleFaqs.map((faq, idx) => (
            <div
              key={idx}
              className="faq-item"
              style={{ cursor: isSending ? "not-allowed" : "pointer" }}
              onClick={() => !isSending && onQuickAsk(faq.q)}
            >
              <div
                className="faq-question"
                style={{ color: "var(--text-link)", textDecoration: "underline" }}
              >
                {faq.q}
              </div>
              <div className="faq-answer">{faq.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
