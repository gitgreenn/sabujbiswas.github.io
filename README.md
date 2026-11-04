# SABUJ // CYBERSPACE — Cybersecurity Portfolio Website

> **Professional Cybersecurity Hacker Portfolio & Interactive Linux Terminal Interface**  
> Developed for **Sabuj Biswas** — Cybersecurity Enthusiast & CSE Student at The Neotia University (Class of 2026).

---

## 🛡️ Project Overview

**SABUJ // CYBERSPACE** combines an authentic Linux terminal interface with a modern cybersecurity operations dashboard. It presents Sabuj Biswas's academic background, network engineering projects, security laboratory research, and technical write-ups in a cohesive, security-first digital workspace.

---

## ⚙️ Key Technical Features

1. **Floating Cyber Control HUD & Multi-Theme Engine**
   - **4 Instant Color Themes:**
     - 🟢 **Matrix Green** (Default `#00FF88`)
     - 🟠 **Amber Phosphor CRT** (`#FFB703`)
     - 🔵 **Cyberpunk Cyan** (`#00E5FF`)
     - 🔴 **Red Team Incident Response** (`#FF3366`)
   - **Live Matrix Rain Speed Controls:** Instant switching between `Pause`, `Slow (80ms)`, `Normal (50ms)`, and `Turbo (25ms)`.
   - **Display Toggles:** Toggle CRT scanline overlays and audio sound effects on the fly.

2. **Web Audio API Synthesizer (0 KB File Downloads)**
   - Synthesizes realistic mechanical keyboard clacks on terminal typing.
   - High-tech command execution and error chirps.
   - Discreet master mute button in the navbar (`[SFX: OFF]` / `[SFX: ON]`).

3. **Full-Featured Interactive Terminal**
   - Authentic terminal window with close, minimize, and maximize buttons.
   - Command history navigation with **Arrow Up** and **Arrow Down**.
   - Tab autocomplete for available commands.
   - Quick command buttons for mobile and touch devices.
   - **Supported commands:** `help`, `whoami`, `about`, `skills`, `projects`, `education`, `certifications`, `contact`, `github`, `linkedin`, `theme <val>`, `matrix <val>`, `scan <ip>`, `sfx <on|off>`, `flag`, `sudo`, `cowsay`, `ls`, `cat <file>`, `date`, `history`, `clear`.
   - Built with **100% safe DOM methods** (zero `eval()`, zero unescaped `innerHTML` with user inputs).

4. **Interactive Security Simulation Workbench**
   - **Stealth SYN Port Scanner:** Enter target IP (e.g. `192.168.10.1`) and launch simulated packet reconnaissance with live progress tracking and port discovery.
   - **VLAN 802.1Q & ACL Router:** Test traffic flow between departmental VLANs and observe live Extended ACL-101 packet filtering and dropping.

5. **Workspace Telemetry HUD**
   - Real-time local digital clock.
   - Session uptime counter.
   - Simulated packet telemetry counter.
   - Dynamic security clearance badge (upgraded to `LEVEL-4 OPERATOR` when CTF challenge is solved).

6. **Engineering Projects Deep Dive**
   - **Enterprise Inter-VLAN Network Design** (Cisco Packet Tracer, VLAN 802.1Q, ROAS, ACLs)
   - **Face Recognition Attendance System** (Python, OpenCV, Tkinter, SQLite3)
   - **MyLLM — Personal Language Model** (Python, Self-Attention, Tokenization, Architecture)
   - Interactive architecture deep-dive modals with code and feature breakdown.

7. **Hands-On Security Labs**
   - 6 structured laboratory experiments clearly distinguishing **Completed** from **In Research** status.

8. **Security Write-ups & Technical Notes**
   - In-depth articles covering 802.1Q trunking, Linux server hardening checklists, and transformer mechanics.
   - Markdown-rendered modal reader with protected syntax code blocks.

---

## 📁 Project Architecture

```
Portfolio/
├── index.html                  # Accessible, semantic master layout
│
├── css/
│   ├── style.css               # Core design system, multi-theme variables & HUD
│   ├── terminal.css            # Linux terminal window styling
│   ├── animations.css          # Matrix canvas, keyframes & scanlines
│   └── responsive.css          # Viewport breakpoints (1920px down to 375px)
│
├── js/
│   ├── config.js               # Central source of truth (frozen data object)
│   ├── audio.js                # Web Audio API acoustic synthesizer (zero downloads)
│   ├── animations.js           # Matrix rain engine with speed & theme reactivity
│   ├── theme.js                # Multi-palette theme manager (Green, Amber, Cyan, Red)
│   ├── terminal.js             # Sandboxed terminal simulator with custom CLI commands
│   ├── dashboard.js            # HUD telemetry, interactive simulators & modal reader
│   └── main.js                 # Boot sequence & navigation handlers
│
├── assets/
│   ├── images/                 # Project screenshots and diagrams
│   ├── icons/                  # Custom cybersecurity SVG icons
│   └── certificates/           # Verification certificate scans
│
├── projects/                   # Network topologies & code exports
├── writeups/                   # Standalone markdown research notes
├── resume/
│   └── resume.pdf              # Downloadable resume document
│
└── README.md                   # Documentation and deployment guide
```

---

## 🔒 Security Best Practices Implemented

- **Zero `eval()` or dynamic code evaluation.**
- **Safe DOM manipulation:** User command input is parsed through strictly mapped command handlers and rendered via `textContent` or controlled nodes to eliminate XSS.
- **Rel protection:** All external links enforce `target="_blank" rel="noopener noreferrer"`.
- **Honest contact form feedback:** Validates input and safely invokes the native `mailto:` handler rather than falsely claiming backend database dispatch.

---

## 🚀 Local Development & Preview

Run a lightweight local HTTP server:

```bash
# Using Python 3
python -m http.server 8000

# Or using Node.js (npx)
npx serve .
```

Open `http://localhost:8000` in your web browser.

---

## 🌐 Free Deployment (Cloudflare Pages & GitHub Pages)

```bash
git add .
git commit -m "feat: enhance portfolio with cyber HUD, multi-themes, Web Audio, and simulators"
git push origin main
```

Cloudflare Pages will automatically detect the commit, build the static assets, and update your live site within seconds!

---

## 👤 Author

**Sabuj Biswas**  
- **LinkedIn:** [linkedin.com/in/sabujbiswas-link/](https://linkedin.com/in/sabujbiswas-link/)  
- **GitHub:** [github.com/gitcolon-Sabuj](https://github.com/gitcolon-Sabuj)  
- **Specialization:** Cyber Security | B.Tech CSE, The Neotia University (Class of 2026)
