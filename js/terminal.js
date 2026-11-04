/**
 * SABUJ // CYBERSPACE - Interactive Terminal System
 * Secure, sandboxed, client-side terminal simulator with history, autocomplete,
 * shell commands (ls, cat, neofetch, clear), themes, port scanner, and audio SFX.
 */

class CyberTerminal {
  constructor() {
    this.container = document.getElementById('cyberTerminal') || document.getElementById('terminal');
    this.outputElement = document.getElementById('terminalOutput');
    this.inputElement = document.getElementById('terminalInput');
    this.promptElement = document.getElementById('terminalPrompt');
    this.windowElement = document.getElementById('terminalWindow');
    this.quickButtons = document.querySelectorAll('.term-quick-btn');

    this.history = [];
    this.historyIndex = -1;
    this.tempInputBuffer = '';
    this.isMaximized = false;
    this.isMinimized = false;

    this.commands = {
      help: () => this.cmdHelp(),
      whoami: () => this.cmdWhoami(),
      about: () => this.cmdAbout(),
      skills: () => this.cmdSkills(),
      projects: () => this.cmdProjects(),
      education: () => this.cmdEducation(),
      certifications: () => this.cmdCertifications(),
      contact: () => this.cmdContact(),
      github: () => this.cmdGithub(),
      linkedin: () => this.cmdLinkedin(),
      clear: () => this.cmdClear(),
      cls: () => this.cmdClear(),
      date: () => this.cmdDate(),
      history: () => this.cmdHistory(),
      neofetch: () => this.cmdNeofetch(),
      ls: (args) => this.cmdLs(args),
      dir: (args) => this.cmdLs(args),
      cat: (args) => this.cmdCat(args),
      exit: () => this.cmdExit(),
      quit: () => this.cmdExit(),
      theme: (args) => this.cmdTheme(args),
      matrix: (args) => this.cmdMatrix(args),
      scan: (args) => this.cmdScan(args),
      sudo: (args) => this.cmdSudo(args),
      cowsay: (args) => this.cmdCowsay(args),
      sfx: (args) => this.cmdSfx(args),
      flag: () => this.cmdFlag()
    };

    this.init();
  }

  init() {
    if (!this.inputElement || !this.outputElement) return;

    this.setupEventListeners();
    this.printMotd();
  }

  setupEventListeners() {
    // Key handling for Enter, Up/Down history, Tab autocomplete, Audio key clack
    this.inputElement.addEventListener('keydown', (e) => {
      if (window.cyberAudio && e.key.length === 1) {
        window.cyberAudio.playKeyClick();
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        const rawCmd = this.inputElement.value.trim();
        if (rawCmd) {
          this.executeCommand(rawCmd);
        } else {
          this.renderPromptLine('');
          this.appendBlankLine();
          this.scrollToBottom();
        }
        this.inputElement.value = '';
        this.historyIndex = -1;
        this.tempInputBuffer = '';
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.history.length === 0) return;
        if (this.historyIndex === -1) {
          this.tempInputBuffer = this.inputElement.value;
          this.historyIndex = this.history.length - 1;
        } else if (this.historyIndex > 0) {
          this.historyIndex--;
        }
        this.inputElement.value = this.history[this.historyIndex] || '';
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex !== -1) {
          if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.inputElement.value = this.history[this.historyIndex];
          } else {
            this.historyIndex = -1;
            this.inputElement.value = this.tempInputBuffer;
          }
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.handleTabAutocomplete();
      }
    });

    // Focus input on terminal click
    if (this.windowElement) {
      this.windowElement.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
          this.inputElement.focus();
        }
      });
    }

    // Quick action buttons
    this.quickButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.isMinimized) {
          this.toggleMinimize();
        }

        const cmd = btn.getAttribute('data-cmd');
        if (cmd) {
          this.executeCommand(cmd);
          this.inputElement.focus();
        }
      });
    });

    // Window control buttons
    const btnClose = document.getElementById('termBtnClose');
    const btnMin = document.getElementById('termBtnMin');
    const btnMax = document.getElementById('termBtnMax');

    if (btnClose) {
      btnClose.addEventListener('click', () => {
        this.cmdClear();
        this.appendOutput('Terminal buffer reset to initial state.', 'term-muted');
        this.appendBlankLine();
      });
    }

    if (btnMin) {
      btnMin.addEventListener('click', () => {
        this.toggleMinimize();
      });
    }

    if (btnMax) {
      btnMax.addEventListener('click', () => {
        this.toggleMaximize();
      });
    }
  }

  handleTabAutocomplete() {
    const val = this.inputElement.value.trim().toLowerCase();
    if (!val) return;

    const matches = Object.keys(this.commands).filter(c => c.startsWith(val));
    if (matches.length === 1) {
      this.inputElement.value = matches[0];
    } else if (matches.length > 1) {
      this.renderPromptLine(val);
      this.appendOutput(`Suggestions: ${matches.join('  ')}`, 'term-cyan');
      this.scrollToBottom();
    }
  }

  toggleMinimize() {
    if (!this.windowElement) return;
    this.isMinimized = !this.isMinimized;
    this.windowElement.classList.toggle('is-minimized', this.isMinimized);
  }

  toggleMaximize() {
    if (!this.windowElement) return;
    this.isMaximized = !this.isMaximized;
    this.windowElement.classList.toggle('is-maximized', this.isMaximized);
    document.body.classList.toggle('terminal-maximized', this.isMaximized);
    const maxBtn = document.getElementById('termBtnMax');
    if (maxBtn) {
      maxBtn.setAttribute('title', this.isMaximized ? 'Restore Terminal' : 'Maximize Terminal');
    }
    this.scrollToBottom();
  }

  printMotd() {
    if (!CONFIG.terminal || !CONFIG.terminal.motd) return;
    CONFIG.terminal.motd.forEach(line => {
      this.appendOutput(line, 'term-accent');
    });
    this.appendOutput("Type 'help' to view available commands, or click any quick pill above.", 'term-muted');
    this.appendBlankLine();
  }

  executeCommand(raw) {
    const sanitized = raw.trim();
    if (!sanitized) return;

    if (this.history[this.history.length - 1] !== sanitized) {
      this.history.push(sanitized);
    }

    this.renderPromptLine(sanitized);

    const args = sanitized.split(/\s+/);
    const commandName = args[0].toLowerCase();

    if (this.commands[commandName]) {
      try {
        if (window.cyberAudio) window.cyberAudio.playChirp(false);
        this.commands[commandName](args.slice(1));
        if (commandName === 'clear' || commandName === 'cls') {
          this.scrollToBottom();
          return;
        }
      } catch (err) {
        if (window.cyberAudio) window.cyberAudio.playChirp(true);
        this.appendOutput(`Error executing '${commandName}': ${err.message}`, 'term-error');
      }
    } else {
      if (window.cyberAudio) window.cyberAudio.playChirp(true);
      this.appendOutput(`Command not found: '${commandName}'. Type 'help' for a list of valid commands.`, 'term-error');
    }

    this.appendBlankLine();
    this.scrollToBottom();
  }

  renderPromptLine(cmd) {
    const line = document.createElement('div');
    line.className = 'term-line term-prompt-echo';

    const promptSpan = document.createElement('span');
    promptSpan.className = 'term-prompt-label';
    promptSpan.textContent = `${CONFIG.terminal.user}@${CONFIG.terminal.hostname}:~$ `;

    const cmdSpan = document.createElement('span');
    cmdSpan.className = 'term-cmd-text';
    cmdSpan.textContent = cmd;

    line.appendChild(promptSpan);
    line.appendChild(cmdSpan);
    this.outputElement.appendChild(line);
  }

  appendOutput(text, className = '') {
    const line = document.createElement('div');
    line.className = `term-line ${className}`;
    line.textContent = text;
    this.outputElement.appendChild(line);
  }

  appendBlankLine() {
    const line = document.createElement('div');
    line.className = 'term-line term-blank';
    this.outputElement.appendChild(line);
  }

  scrollToBottom() {
    if (this.outputElement) {
      this.outputElement.scrollTop = this.outputElement.scrollHeight;
    }
  }

  /* ================= COMMAND IMPLEMENTATIONS ================= */

  cmdHelp() {
    this.appendOutput("SABUJ // CYBERSPACE - Terminal Commands Reference:", "term-accent term-bold");
    this.appendOutput("----------------------------------------------------------------", "term-muted");
    const doc = [
      ["whoami", "Display basic operator identity and clearance"],
      ["about", "Read detailed biography, education and objectives"],
      ["skills", "List technical capabilities across 4 cyber domains"],
      ["projects", "Display featured technical cybersecurity projects"],
      ["education", "Show university, degree, specialization & academic score"],
      ["certifications", "Inspect verified technical credentials & coursework"],
      ["contact", "Show official communication channels & contact info"],
      ["github", "Display GitHub profile link"],
      ["linkedin", "Display LinkedIn professional profile link"],
      ["neofetch", "Render ASCII banner and system hardware telemetry"],
      ["theme <val>", "Change color scheme: green | amber | cyan | red"],
      ["matrix <val>", "Matrix speed control: slow | normal | turbo | pause"],
      ["scan <target>", "Simulate SYN port scan on IP or hostname"],
      ["sfx <on|off>", "Toggle synthesized Web Audio keystroke sound effects"],
      ["flag", "Inspect system flag (CTF Easter Egg)"],
      ["sudo <cmd>", "Run command with root supervisor privileges"],
      ["cowsay <text>", "Display classic ASCII cow message"],
      ["ls / dir", "List virtual cyberspace directories and documents"],
      ["cat <file>", "Inspect virtual document contents (e.g. 'cat about.txt')"],
      ["date", "Show current system timestamp (ISO / UTC)"],
      ["history", "Show commands executed in current terminal session"],
      ["clear / cls", "Clear terminal screen buffer"]
    ];

    doc.forEach(([cmd, desc]) => {
      const line = document.createElement('div');
      line.className = 'term-line term-help-line';
      line.innerHTML = `<span class="term-cyan">${cmd.padEnd(16, ' ')}</span> <span class="term-muted"># ${desc}</span>`;
      this.outputElement.appendChild(line);
    });
  }

  cmdWhoami() {
    this.appendOutput(`User:        ${CONFIG.profile.name} [${CONFIG.profile.callsign}]`, 'term-white');
    this.appendOutput(`Role:        ${CONFIG.profile.role}`, 'term-accent');
    this.appendOutput(`Education:   ${CONFIG.profile.education.degree} (${CONFIG.profile.education.specialization})`, 'term-muted');
    this.appendOutput(`Institution: ${CONFIG.profile.education.institution} (Class of ${CONFIG.profile.education.graduation})`, 'term-muted');
    this.appendOutput(`Status:      ${CONFIG.profile.status}`, 'term-accent');
  }

  cmdAbout() {
    this.appendOutput(CONFIG.profile.bio, 'term-white');
    this.appendBlankLine();
    this.appendOutput("Core Technical Interests:", "term-cyan");
    CONFIG.profile.interests.forEach(interest => {
      this.appendOutput(`  * ${interest}`, 'term-muted');
    });
  }

  cmdSkills() {
    this.appendOutput("=== TECHNICAL CAPABILITIES MATRIX ===", "term-accent term-bold");
    
    this.appendOutput("\n[PROGRAMMING & SCRIPTING]", "term-cyan");
    CONFIG.skills.programming.forEach(s => {
      this.appendOutput(`  • ${s.name.padEnd(14)} : ${s.level}`, 'term-white');
    });

    this.appendOutput("\n[NETWORKING & INFRASTRUCTURE]", "term-cyan");
    CONFIG.skills.networking.forEach(s => {
      this.appendOutput(`  • ${s.name.padEnd(25)} : ${s.desc}`, 'term-white');
    });

    this.appendOutput("\n[CYBERSECURITY & DEFENSE]", "term-cyan");
    CONFIG.skills.cybersecurity.forEach(s => {
      this.appendOutput(`  • ${s.name.padEnd(28)} : ${s.desc}`, 'term-white');
    });

    this.appendOutput("\n[TOOLS & ENVIRONMENTS]", "term-cyan");
    CONFIG.skills.tools.forEach(s => {
      this.appendOutput(`  • ${s.name.padEnd(25)} : [${s.category}]`, 'term-white');
    });
  }

  cmdProjects() {
    this.appendOutput("=== FEATURED SECURITY & SOFTWARE PROJECTS ===", "term-accent term-bold");
    CONFIG.projects.forEach((proj, idx) => {
      this.appendBlankLine();
      this.appendOutput(`[${idx + 1}] ${proj.title} (${proj.badge})`, "term-cyan term-bold");
      this.appendOutput(`    Summary: ${proj.summary}`, "term-white");
      this.appendOutput(`    Stack:   ${proj.technologies.join(', ')}`, "term-muted");
      this.appendOutput(`    Link:    ${proj.github}`, "term-accent");
    });
  }

  cmdEducation() {
    const edu = CONFIG.profile.education;
    this.appendOutput("=== ACADEMIC CREDENTIALS ===", "term-accent term-bold");
    this.appendOutput(`Institution:    ${edu.institution}`, "term-white");
    this.appendOutput(`Degree:         ${edu.degree}`, "term-white");
    this.appendOutput(`Specialization: ${edu.specialization}`, "term-cyan");
    this.appendOutput(`Graduation:     ${edu.graduation}`, "term-muted");
    this.appendOutput(`Academic CGPA:  ${edu.cgpa} / 10.0`, "term-accent");
  }

  cmdCertifications() {
    this.appendOutput("=== VERIFIED CERTIFICATIONS & STUDY ===", "term-accent term-bold");
    CONFIG.certifications.forEach(cert => {
      this.appendOutput(`• ${cert.title}`, "term-white");
      this.appendOutput(`  Issuer: ${cert.issuer} | Status: ${cert.status}`, "term-muted");
      this.appendOutput(`  URL:    ${cert.credentialUrl}`, "term-cyan");
    });
  }

  cmdContact() {
    this.appendOutput("=== SECURE COMMS DIRECTORY ===", "term-accent term-bold");
    this.appendOutput(`Email:    ${CONFIG.profile.social.email}`, "term-white");
    this.appendOutput(`GitHub:   ${CONFIG.profile.social.github}`, "term-cyan");
    this.appendOutput(`LinkedIn: ${CONFIG.profile.social.linkedin}`, "term-cyan");
    this.appendOutput("Tip: You can also use the interactive contact form on the dashboard.", "term-muted");
  }

  cmdGithub() {
    this.appendOutput(`Opening GitHub: ${CONFIG.profile.social.github}`, "term-cyan");
    window.open(CONFIG.profile.social.github, '_blank', 'noopener,noreferrer');
  }

  cmdLinkedin() {
    this.appendOutput(`Opening LinkedIn: ${CONFIG.profile.social.linkedin}`, "term-cyan");
    window.open(CONFIG.profile.social.linkedin, '_blank', 'noopener,noreferrer');
  }

  cmdClear() {
    this.outputElement.innerHTML = '';
  }

  cmdDate() {
    const now = new Date();
    this.appendOutput(`Local Time: ${now.toString()}`, "term-white");
    this.appendOutput(`UTC Time:   ${now.toISOString()}`, "term-muted");
  }

  cmdHistory() {
    if (this.history.length === 0) {
      this.appendOutput("Command history buffer is empty.", "term-muted");
      return;
    }
    this.appendOutput("=== SESSION COMMAND HISTORY ===", "term-accent");
    this.history.forEach((h, i) => {
      this.appendOutput(`  ${(i + 1).toString().padStart(3, ' ')}  ${h}`, "term-muted");
    });
  }

  cmdLs() {
    this.appendOutput("total 52", "term-muted");
    this.appendOutput("drwxr-xr-x 2 sabuj cyber 4096 Nov 03 21:00 about.txt", "term-cyan");
    this.appendOutput("drwxr-xr-x 2 sabuj cyber 4096 Nov 03 21:00 skills.md", "term-cyan");
    this.appendOutput("drwxr-xr-x 2 sabuj cyber 4096 Nov 03 21:00 projects.json", "term-cyan");
    this.appendOutput("drwxr-xr-x 2 sabuj cyber 4096 Nov 03 21:00 education.log", "term-cyan");
    this.appendOutput("drwxr-xr-x 2 sabuj cyber 4096 Nov 03 21:00 certifications.pem", "term-cyan");
    this.appendOutput("-rwxr-xr-x 1 sabuj cyber 8192 Nov 03 21:00 neofetch.bin", "term-accent");
    this.appendOutput("-rw-r--r-- 1 sabuj cyber 1024 Nov 03 21:00 contact.pub", "term-white");
    this.appendOutput("-r-------- 1 root  root    64 Nov 03 21:00 .secret_flag.txt", "term-muted");
    this.appendOutput("Tip: Run 'cat about.txt' or 'cat .secret_flag.txt' to view file contents.", "term-muted");
  }

  cmdCat(args) {
    if (!args || args.length === 0) {
      this.appendOutput("usage: cat <filename>", "term-error");
      return;
    }
    const target = args[0].toLowerCase();
    if (target === 'about.txt' || target === 'about') {
      this.cmdAbout();
    } else if (target === 'skills.md' || target === 'skills') {
      this.cmdSkills();
    } else if (target === 'projects.json' || target === 'projects') {
      this.cmdProjects();
    } else if (target === 'education.log' || target === 'education') {
      this.cmdEducation();
    } else if (target === 'certifications.pem' || target === 'certifications' || target === 'certs') {
      this.cmdCertifications();
    } else if (target === 'contact.pub' || target === 'contact') {
      this.cmdContact();
    } else if (target === '.secret_flag.txt' || target === 'secret_flag.txt' || target === 'flag') {
      this.cmdFlag();
    } else {
      this.appendOutput(`cat: ${args[0]}: No such file or directory. Try 'ls' to view directory contents.`, "term-error");
    }
  }

  cmdExit() {
    this.appendOutput("Process 'cyberspace-shell' cannot be terminated in browser session.", "term-muted");
    this.appendOutput("Type 'clear' to reset terminal screen buffer.", "term-cyan");
  }

  cmdTheme(args) {
    const available = ['green', 'amber', 'cyan', 'red'];
    if (!args || args.length === 0) {
      this.appendOutput(`Current theme: ${window.cyberTheme ? window.cyberTheme.currentTheme : 'green'}`, "term-white");
      this.appendOutput(`Available themes: ${available.join(', ')}`, "term-cyan");
      this.appendOutput("Usage: theme <green|amber|cyan|red>", "term-muted");
      return;
    }
    const chosen = args[0].toLowerCase();
    if (available.includes(chosen)) {
      if (window.cyberTheme) {
        window.cyberTheme.applyTheme(chosen);
        this.appendOutput(`Theme successfully switched to [${chosen.toUpperCase()}].`, "term-accent");
      }
    } else {
      this.appendOutput(`Unknown theme '${chosen}'. Available: ${available.join(', ')}`, "term-error");
    }
  }

  cmdMatrix(args) {
    if (!args || args.length === 0) {
      this.appendOutput("Usage: matrix <slow | normal | turbo | pause | resume>", "term-muted");
      return;
    }
    const opt = args[0].toLowerCase();
    if (window.cyberAnimations) {
      if (opt === 'pause') {
        window.cyberAnimations.pauseMatrixLoop();
        this.appendOutput("Matrix rain background PAUSED.", "term-white");
      } else if (opt === 'resume' || opt === 'play') {
        window.cyberAnimations.startMatrixLoop();
        this.appendOutput("Matrix rain background RESUMED.", "term-accent");
      } else if (opt === 'slow') {
        window.cyberAnimations.setSpeed(80);
        this.appendOutput("Matrix rain speed set to SLOW (80ms).", "term-accent");
      } else if (opt === 'normal') {
        window.cyberAnimations.setSpeed(50);
        this.appendOutput("Matrix rain speed set to NORMAL (50ms).", "term-accent");
      } else if (opt === 'turbo' || opt === 'fast') {
        window.cyberAnimations.setSpeed(25);
        this.appendOutput("Matrix rain speed set to TURBO (25ms).", "term-accent");
      } else {
        const custom = parseInt(opt, 10);
        if (!isNaN(custom)) {
          window.cyberAnimations.setSpeed(custom);
          this.appendOutput(`Matrix rain interval set to ${custom}ms.`, "term-accent");
        } else {
          this.appendOutput("Invalid option. Usage: matrix <slow|normal|turbo|pause|resume>", "term-error");
        }
      }
    }
  }

  cmdScan(args) {
    if (this.activeScanInterval) {
      clearInterval(this.activeScanInterval);
      this.activeScanInterval = null;
    }

    const target = args && args[0] ? args[0] : '192.168.10.1';
    this.appendOutput(`Starting CyberSYN Port Scan against target: [${target}]...`, "term-cyan");
    this.appendOutput("Initiating half-open SYN packets across common infrastructure ports...", "term-muted");

    const ports = [
      { port: 21, service: "ftp", state: "FILTERED (Firewall rule active)" },
      { port: 22, service: "ssh", state: "OPEN [OpenSSH 8.9p1 Ubuntu hardened]" },
      { port: 53, service: "domain", state: "OPEN [Internal DNS Responder]" },
      { port: 80, service: "http", state: "OPEN [Nginx reverse-proxy]" },
      { port: 443, service: "https", state: "OPEN [TLS 1.3 / AES-256-GCM]" },
      { port: 3306, service: "mysql", state: "FILTERED [Internal subnet only]" }
    ];

    let i = 0;
    this.activeScanInterval = setInterval(() => {
      if (i < ports.length) {
        const p = ports[i];
        const color = p.state.startsWith('OPEN') ? 'term-accent' : 'term-muted';
        this.appendOutput(`PORT ${p.port.toString().padEnd(5)} /tcp  ${p.service.padEnd(8)}  --> ${p.state}`, color);
        if (window.cyberAudio) window.cyberAudio.playPacketBlip();
        this.scrollToBottom();
        i++;
      } else {
        clearInterval(this.activeScanInterval);
        this.activeScanInterval = null;
        this.appendOutput(`\nScan finished for ${target}: 4 open ports discovered. Zero vulnerabilities exploited.`, "term-white");
        this.appendBlankLine();
        this.scrollToBottom();
      }
    }, 280);
  }

  cmdSudo(args) {
    this.appendOutput("Password for operator sabuj: [PROTECTED]", "term-muted");
    setTimeout(() => {
      this.appendOutput("sabuj is not in the sudoers file. This incident will be reported to network security.", "term-error");
      this.scrollToBottom();
    }, 400);
  }

  cmdCowsay(args) {
    const msg = (args && args.length > 0) ? args.join(' ') : "Cyber security is not a product, but a process.";
    const border = '-'.repeat(msg.length + 2);
    const cow = [
      ` ${border}`,
      `< ${msg} >`,
      ` ${border}`,
      "        \\   ^__^",
      "         \\  (oo)\\_______",
      "            (__)\\       )\\/\\",
      "                ||----w |",
      "                ||     ||"
    ];
    cow.forEach(line => this.appendOutput(line, 'term-accent'));
  }

  cmdSfx(args) {
    if (!window.cyberAudio) return;
    if (args && args[0] === 'off') {
      window.cyberAudio.disable();
      this.appendOutput("Synthesized Web Audio SFX disabled.", "term-muted");
    } else if (args && args[0] === 'on') {
      window.cyberAudio.enable();
      this.appendOutput("Synthesized Web Audio SFX enabled! Try typing commands to hear mechanical clicks.", "term-accent");
    } else {
      const active = window.cyberAudio.toggle();
      this.appendOutput(`Audio SFX toggled: [${active ? 'ENABLED' : 'DISABLED'}].`, "term-accent");
    }
  }

  cmdFlag() {
    this.appendOutput("==================================================", "term-accent");
    this.appendOutput("🚩 CONGRATULATIONS! CTF CHALLENGE SOLVED!", "term-cyan term-bold");
    this.appendOutput("FLAG: flag{s4buj_cxb3rsp4c3_0x2026_w1n}", "term-accent term-bold");
    this.appendOutput("Authorization: LEVEL-4 WHITE-HAT OPERATOR GRANTED", "term-white");
    this.appendOutput("==================================================", "term-accent");

    // Upgrade HUD clearance badge
    const clearanceBadge = document.querySelector('.hud-value.cyan');
    if (clearanceBadge) {
      clearanceBadge.textContent = "LEVEL-4 OPERATOR (CTF SOLVED)";
      clearanceBadge.classList.add('accent');
    }
  }

  cmdNeofetch() {
    const neo = CONFIG.terminal.neofetch;
    const art = [
      "  /\\_-_/\\   sabuj@cyberspace",
      " ( o   o )  ----------------",
      "  >  ^  <   OS: " + neo.os,
      "   /   \\    Host: " + neo.host,
      "  (|   |)   Kernel: " + neo.kernel,
      "   || ||    Uptime: " + neo.uptime,
      "   ^^ ^^    Shell: " + neo.shell,
      "            Terminal: " + neo.terminal,
      "            CPU: " + neo.cpu,
      "            RAM: " + neo.memory,
      "            Degree: " + neo.degree,
      "            CGPA: " + neo.cgpa
    ];

    art.forEach(line => {
      this.appendOutput(line, 'term-accent');
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.cyberTerminal = new CyberTerminal();
  });
} else {
  window.cyberTerminal = new CyberTerminal();
}
