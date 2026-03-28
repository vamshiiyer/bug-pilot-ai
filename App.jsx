import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are Bug Pilot — an elite AI-powered security assistant. Your mission:
- Analyze code for security vulnerabilities (XSS, SQLi, CSRF, IDOR, RCE, SSRF, etc.)
- Explain CVEs and security advisories in plain English
- Suggest secure coding practices and patches
- Perform threat modeling on architecture descriptions
- Help with CTF challenges and penetration testing concepts (ethically)
- Review dependencies for known vulnerabilities

Response style:
- Lead with severity: 🔴 CRITICAL | 🟠 HIGH | 🟡 MEDIUM | 🟢 LOW | ℹ️ INFO
- Be concise but thorough
- Always provide remediation steps
- Use code blocks for examples
- If no vulnerability found, confirm safety and suggest hardening tips`;

const QUICK_PROMPTS = [
  { label: "Scan Code", icon: "🔍", text: "Analyze this code for security vulnerabilities:\n\n```\n// paste your code here\n```" },
  { label: "Explain CVE", icon: "📋", text: "Explain CVE-" },
  { label: "Threat Model", icon: "🗺️", text: "Perform a threat model for this system: " },
  { label: "SQL Injection", icon: "💉", text: "What are the top SQL injection prevention techniques with code examples?" },
  { label: "JWT Security", icon: "🔐", text: "What are common JWT security vulnerabilities and how to fix them?" },
  { label: "OWASP Top 10", icon: "📊", text: "Give me a summary of OWASP Top 10 2021 with one example each." },
];

export default function BugPilotAI() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `**Bug Pilot AI** online. 🛡️\n\nI'm your AI-powered security co-pilot. I can:\n- **Analyze code** for vulnerabilities (XSS, SQLi, RCE, SSRF...)\n- **Explain CVEs** and security advisories\n- **Threat model** your architecture\n- **Guide remediation** with concrete code fixes\n\nPaste your code or describe your security concern to get started.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setScanCount((c) => c + 1);

    try {
      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      });

      const data = await res.json();
      const reply = data.content?.map((b) => b.text || "").join("") || "No response received.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Connection error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderContent = (text) => {
    // Parse markdown-like formatting
    const lines = text.split("\n");
    return lines.map((line, i) => {
      // Code blocks
      if (line.startsWith("```")) return <div key={i} className="code-fence" />;
      // Bold
      line = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      // Inline code
      line = line.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
      // Severity icons already in text
      return <p key={i} dangerouslySetInnerHTML={{ __html: line || "&nbsp;" }} />;
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;600;700&family=Syne:wght@400;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #050a0f; }

        .app {
          font-family: 'JetBrains Mono', monospace;
          background: #050a0f;
          color: #c8d8e8;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        /* Grid background */
        .app::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,255,136,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }

        /* Glow orbs */
        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
        }
        .orb-1 { width: 500px; height: 500px; background: rgba(0,255,136,0.04); top: -100px; right: -100px; }
        .orb-2 { width: 400px; height: 400px; background: rgba(255,60,60,0.03); bottom: 100px; left: -100px; }

        /* Header */
        .header {
          position: relative;
          z-index: 10;
          padding: 16px 24px;
          border-bottom: 1px solid rgba(0,255,136,0.1);
          background: rgba(5,10,15,0.9);
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #00ff88, #00cc6a);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 0 20px rgba(0,255,136,0.4);
        }

        .logo-text {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 18px;
          color: #fff;
          letter-spacing: -0.5px;
        }

        .logo-text span { color: #00ff88; }

        .status-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(0,255,136,0.08);
          border: 1px solid rgba(0,255,136,0.2);
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 11px;
          color: #00ff88;
        }

        .status-dot {
          width: 6px; height: 6px;
          background: #00ff88;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .header-stats {
          margin-left: auto;
          display: flex;
          gap: 16px;
          font-size: 11px;
          color: #4a6a7a;
        }

        .stat { display: flex; flex-direction: column; align-items: flex-end; }
        .stat-val { color: #00ff88; font-weight: 700; font-size: 14px; }

        /* Quick prompts */
        .quick-bar {
          position: relative;
          z-index: 10;
          padding: 10px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          background: rgba(5,10,15,0.7);
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .quick-bar::-webkit-scrollbar { display: none; }

        .quick-btn {
          flex-shrink: 0;
          background: rgba(0,255,136,0.05);
          border: 1px solid rgba(0,255,136,0.15);
          border-radius: 6px;
          padding: 6px 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #7a9aaa;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .quick-btn:hover {
          background: rgba(0,255,136,0.1);
          border-color: rgba(0,255,136,0.4);
          color: #00ff88;
          transform: translateY(-1px);
        }

        /* Messages */
        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          position: relative;
          z-index: 5;
          scrollbar-width: thin;
          scrollbar-color: rgba(0,255,136,0.2) transparent;
        }

        .msg {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          animation: fadeUp 0.3s ease;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .msg.user { flex-direction: row-reverse; }

        .avatar {
          width: 32px; height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }

        .avatar.ai {
          background: linear-gradient(135deg, #00ff88, #00cc6a);
          box-shadow: 0 0 12px rgba(0,255,136,0.3);
        }

        .avatar.user-av {
          background: rgba(100,120,180,0.2);
          border: 1px solid rgba(100,120,180,0.3);
        }

        .bubble {
          max-width: 75%;
          padding: 14px 18px;
          border-radius: 12px;
          font-size: 13px;
          line-height: 1.7;
        }

        .bubble.ai {
          background: rgba(0,255,136,0.04);
          border: 1px solid rgba(0,255,136,0.12);
          border-top-left-radius: 2px;
        }

        .bubble.user-b {
          background: rgba(60,100,200,0.12);
          border: 1px solid rgba(60,100,200,0.2);
          border-top-right-radius: 2px;
          color: #d0e0ff;
          text-align: right;
        }

        .bubble p { margin-bottom: 4px; }
        .bubble strong { color: #fff; }
        .inline-code {
          background: rgba(0,255,136,0.1);
          border: 1px solid rgba(0,255,136,0.2);
          padding: 1px 6px;
          border-radius: 4px;
          color: #00ff88;
          font-size: 12px;
        }
        .code-fence {
          height: 1px;
          background: rgba(0,255,136,0.1);
          margin: 8px 0;
        }

        /* Typing indicator */
        .typing {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 14px 18px;
        }
        .typing-dot {
          width: 6px; height: 6px;
          background: #00ff88;
          border-radius: 50%;
          animation: bounce 1.2s infinite;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-8px); opacity: 1; }
        }

        /* Input area */
        .input-area {
          position: relative;
          z-index: 10;
          padding: 16px 24px;
          background: rgba(5,10,15,0.95);
          border-top: 1px solid rgba(0,255,136,0.08);
        }

        .input-wrapper {
          display: flex;
          gap: 10px;
          align-items: flex-end;
          background: rgba(0,255,136,0.03);
          border: 1px solid rgba(0,255,136,0.15);
          border-radius: 10px;
          padding: 12px 14px;
          transition: border-color 0.2s;
        }

        .input-wrapper:focus-within {
          border-color: rgba(0,255,136,0.4);
          box-shadow: 0 0 0 3px rgba(0,255,136,0.05);
        }

        textarea {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #c8d8e8;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          resize: none;
          min-height: 22px;
          max-height: 160px;
          line-height: 1.6;
          placeholder-color: #3a5a6a;
        }

        textarea::placeholder { color: #3a5a6a; }

        .send-btn {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #00ff88, #00cc6a);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          transition: all 0.2s;
          flex-shrink: 0;
          box-shadow: 0 0 16px rgba(0,255,136,0.3);
        }

        .send-btn:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 0 24px rgba(0,255,136,0.5);
        }

        .send-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
        }

        .hint {
          font-size: 10px;
          color: #2a4a5a;
          margin-top: 8px;
          text-align: center;
        }
      `}</style>

      <div className="app">
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        {/* Header */}
        <div className="header">
          <div className="logo">
            <div className="logo-icon">🛡️</div>
            <div className="logo-text">Bug<span>Pilot</span> AI</div>
          </div>
          <div className="status-pill">
            <div className="status-dot" />
            ACTIVE · NO API KEY NEEDED
          </div>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-val">{scanCount}</span>
              <span>scans</span>
            </div>
            <div className="stat">
              <span className="stat-val">Claude</span>
              <span>engine</span>
            </div>
          </div>
        </div>

        {/* Quick prompts */}
        <div className="quick-bar">
          {QUICK_PROMPTS.map((q) => (
            <button key={q.label} className="quick-btn" onClick={() => { setInput(q.text); textareaRef.current?.focus(); }}>
              {q.icon} {q.label}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role === "user" ? "user" : ""}`}>
              <div className={`avatar ${m.role === "user" ? "user-av" : "ai"}`}>
                {m.role === "user" ? "👤" : "🛡️"}
              </div>
              <div className={`bubble ${m.role === "user" ? "user-b" : "ai"}`}>
                {renderContent(m.content)}
              </div>
            </div>
          ))}

          {loading && (
            <div className="msg">
              <div className="avatar ai">🛡️</div>
              <div className="bubble ai">
                <div className="typing">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="input-area">
          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Paste code, describe a vulnerability, or ask about CVEs..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
              }}
              onKeyDown={handleKey}
            />
            <button className="send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
              {loading ? "⏳" : "⚡"}
            </button>
          </div>
          <div className="hint">Shift+Enter for new line · Enter to scan · Powered by Claude (no API key required)</div>
        </div>
      </div>
    </>
  );
}
