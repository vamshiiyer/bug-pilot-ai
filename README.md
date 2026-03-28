# 🛡️ Bug Pilot AI

> AI-powered security assistant — no API key required.

Built with Claude (Anthropic) running directly in the browser. Paste code, describe a vulnerability, or ask about CVEs and get instant, severity-tagged analysis.

![Bug Pilot AI](https://img.shields.io/badge/Powered%20by-Claude%20AI-00ff88?style=flat-square&labelColor=050a0f)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&labelColor=050a0f)
![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&labelColor=050a0f)
![No API Key](https://img.shields.io/badge/API%20Key-Not%20Required-00ff88?style=flat-square&labelColor=050a0f)

---

## ✨ Features

- 🔍 **Code vulnerability scanning** — XSS, SQLi, RCE, SSRF, IDOR, and more
- 📋 **CVE explainer** — plain-English breakdowns of any CVE
- 🗺️ **Threat modeling** — describe your architecture, get risks mapped
- 🔐 **Secure coding guidance** — JWT, auth, crypto, and OWASP Top 10
- ⚡ **Severity tagging** — 🔴 CRITICAL · 🟠 HIGH · 🟡 MEDIUM · 🟢 LOW
- 🚫 **Zero API key setup** — runs via Claude's built-in API access

---

## 🚀 Quick Start

```bash
git clone https://github.com/vamshiiyer/bug-pilot-ai.git
cd bug-pilot-ai
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

> **Note:** This app uses the Anthropic API via claude.ai's session context. For standalone deployment with your own API key, update the fetch headers in `src/App.jsx`.

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Framework | React 18 + Vite |
| AI Engine | Claude (Anthropic) |
| Styling | CSS-in-JS (JetBrains Mono + Syne) |
| Deployment | Vercel / Netlify ready |

---

## 📁 Project Structure

```
bug-pilot-ai/
├── src/
│   ├── App.jsx        # Main UI + Claude API integration
│   └── main.jsx       # React entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## 🔧 Deploy to Vercel

```bash
npx vercel --prod
```

---

Built by [@vamshiiyer](https://github.com/vamshiiyer) · Powered by [Anthropic Claude](https://anthropic.com)
