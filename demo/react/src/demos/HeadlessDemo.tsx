import React, { useRef, useEffect } from "react";
import { ChatbotProvider, useChatbot } from "@typetechit/chatbot-react";
import type { ChatMessage } from "@typetechit/chatbot-types";

const API_KEY = import.meta.env["VITE_CHATBOT_API_KEY"] ?? "";
const BASE_URL = "https://api.chatbot.typetechit.com";

// ─── Custom chat UI built on useChatbot() ─────────────────────────────────────

function CustomChat() {
  const { messages, sendMessage, isLoading, error } = useChatbot();
  const [input, setInput] = React.useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    await sendMessage(text);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: 520,
        background: "#fff",
        border: "1px solid var(--gray-200)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        boxShadow: "var(--shadow)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 20px",
          borderBottom: "1px solid var(--gray-200)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "var(--gray-50)",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            background: "var(--brand)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
          </svg>
        </div>
        <div>
          <div
            style={{ fontWeight: 600, fontSize: 14, color: "var(--gray-900)" }}
          >
            TypeTechIT Assistant
          </div>
          <div style={{ fontSize: 11, color: "#22C55E", fontWeight: 500 }}>
            ● Online
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {messages.length === 0 && !isLoading && <EmptyState />}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isLoading && <TypingIndicator />}

        {error && (
          <div
            style={{
              alignSelf: "center",
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#DC2626",
              borderRadius: 8,
              padding: "8px 14px",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--gray-200)",
          display: "flex",
          gap: 10,
          background: "#fff",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void handleSend();
            }
          }}
          placeholder="Type a message…"
          disabled={isLoading}
          style={{
            flex: 1,
            border: "1px solid var(--gray-200)",
            borderRadius: 24,
            padding: "10px 18px",
            fontSize: 14,
            outline: "none",
            background: isLoading ? "var(--gray-50)" : "#fff",
            color: "var(--gray-900)",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--brand)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--gray-200)";
          }}
        />
        <button
          onClick={() => void handleSend()}
          disabled={isLoading || !input.trim()}
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            border: "none",
            background: "var(--brand)",
            color: "#fff",
            cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
            opacity: isLoading || !input.trim() ? 0.5 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "opacity 0.15s",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isHuman = message.message.type === "human";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isHuman ? "flex-end" : "flex-start",
        gap: 4,
      }}
    >
      <div
        style={{
          maxWidth: "78%",
          padding: "10px 15px",
          borderRadius: isHuman ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isHuman ? "var(--brand)" : "var(--gray-100)",
          color: isHuman ? "#fff" : "var(--gray-900)",
          fontSize: 14,
          lineHeight: 1.5,
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
        }}
      >
        {message.message.content}
      </div>
      <span style={{ fontSize: 11, color: "var(--gray-500)" }}>
        {isHuman ? "You" : "Assistant"}
      </span>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
      <div
        style={{
          background: "var(--gray-100)",
          borderRadius: "18px 18px 18px 4px",
          padding: "12px 16px",
          display: "flex",
          gap: 4,
          alignItems: "center",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 7,
              height: 7,
              background: "var(--gray-400)",
              borderRadius: "50%",
              animation: `bounce 1.2s ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        color: "var(--gray-500)",
        paddingTop: 40,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          background: "var(--brand-light)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="var(--brand)">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
        </svg>
      </div>
      <p style={{ fontWeight: 600, color: "var(--gray-700)" }}>
        Start a conversation
      </p>
      <p style={{ fontSize: 13 }}>
        Type a message below to chat with the assistant.
      </p>
    </div>
  );
}

// ─── Page wrapper ─────────────────────────────────────────────────────────────

export function HeadlessDemo() {
  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--brand)",
              background: "var(--brand-light)",
              padding: "2px 8px",
              borderRadius: 4,
              letterSpacing: "0.08em",
            }}
          >
            HEADLESS
          </span>
          <h2
            style={{ fontSize: 20, fontWeight: 700, color: "var(--gray-900)" }}
          >
            Custom UI with <code>useChatbot()</code>
          </h2>
        </div>
        <p style={{ color: "var(--gray-500)", fontSize: 14 }}>
          Use the <code>useChatbot()</code> hook to build any UI you want —
          complete control over layout, styling, and behaviour. No Shadow DOM,
          no built-in widget.
        </p>
      </div>

      {!API_KEY ? (
        <div
          style={{
            background: "#FFFBEB",
            border: "1px solid #FCD34D",
            color: "#92400E",
            borderRadius: "var(--radius)",
            padding: "16px 20px",
            fontSize: 13,
            fontWeight: 500,
            marginBottom: 32,
          }}
        >
          Copy <code>.env.local.example</code> → <code>.env.local</code> and set{" "}
          <code>VITE_CHATBOT_API_KEY</code> to try the live chat.
        </div>
      ) : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
          alignItems: "start",
        }}
      >
        {/* Live UI */}
        <div>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--gray-700)",
              marginBottom: 12,
            }}
          >
            Live preview
          </h3>
          {API_KEY ? (
            <ChatbotProvider
              apiKey={API_KEY}
              apiBaseUrl={BASE_URL}
              chatbotName="TypeTechIT Assistant"
              welcomeMessage="Hello! How can I help you today?"
            >
              <CustomChat />
            </ChatbotProvider>
          ) : (
            <div
              style={{
                height: 520,
                background: "#fff",
                border: "1px solid var(--gray-200)",
                borderRadius: "var(--radius)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--gray-300)",
                fontSize: 14,
              }}
            >
              No API key configured
            </div>
          )}
        </div>

        {/* Code */}
        <div>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--gray-700)",
              marginBottom: 12,
            }}
          >
            Source code
          </h3>
          <pre
            style={{
              fontSize: 12,
              lineHeight: 1.65,
              borderRadius: "var(--radius)",
            }}
          >
            <code>{CODE_SNIPPET}</code>
          </pre>

          <div
            style={{
              marginTop: 20,
              background: "#fff",
              border: "1px solid var(--gray-200)",
              borderRadius: "var(--radius)",
              padding: 20,
            }}
          >
            <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
              Hook return values
            </h4>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
              }}
            >
              <tbody>
                {HOOK_FIELDS.map(([name, type, desc]) => (
                  <tr
                    key={name}
                    style={{ borderBottom: "1px solid var(--gray-100)" }}
                  >
                    <td style={{ padding: "7px 0", fontFamily: "monospace" }}>
                      <code>{name}</code>
                    </td>
                    <td
                      style={{
                        padding: "7px 8px",
                        color: "var(--gray-500)",
                        fontFamily: "monospace",
                        fontSize: 11,
                      }}
                    >
                      {type}
                    </td>
                    <td
                      style={{
                        padding: "7px 0",
                        color: "var(--gray-700)",
                        paddingLeft: 8,
                      }}
                    >
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const HOOK_FIELDS: [string, string, string][] = [
  ["messages", "ChatMessage[]", "All messages in the session"],
  ["isLoading", "boolean", "True while waiting for AI response"],
  ["isOpen", "boolean", "Widget open state"],
  ["error", "string | null", "Last error message"],
  ["sessionId", "string | null", "Current session UUID"],
  ["sendMessage", "(text) => Promise", "Send a message to the API"],
  ["open / close / toggle", "() => void", "Control the built-in widget"],
];

const CODE_SNIPPET = `import { ChatbotProvider, useChatbot }
  from '@typetechit/chatbot-react';

function MyChatUI() {
  const {
    messages,
    sendMessage,
    isLoading,
    error,
  } = useChatbot();

  const [input, setInput] = useState('');

  return (
    <div className="chat-window">
      {messages.map(msg => (
        <Bubble key={msg.id} message={msg} />
      ))}
      {isLoading && <TypingDots />}

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter')
            sendMessage(input).then(() => setInput(''));
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ChatbotProvider
      apiKey="ak_your_key"
      apiBaseUrl="https://api.chatbot.typetechit.com"
    >
      <MyChatUI />
    </ChatbotProvider>
  );
}`;
