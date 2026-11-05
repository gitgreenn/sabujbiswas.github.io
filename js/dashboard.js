/**
 * SABUJ // CYBERSPACE - Dashboard HUD & Content Rendering
 * Handles dynamic rendering of projects, labs, writeups, telemetry clocks,
 * modal dialogs, and interactive widgets.
 */

class CyberDashboard {
  constructor() {
    this.startTime = Date.now();
    this.packetCount = 1420;
    this.activeModal = null;

    this.init();
  }

  init() {
    this.startSystemClock();
    this.renderSkills();
    this.renderProjects();
    this.renderSecurityLabs();
    this.renderCertifications();
    this.renderWriteups();
    this.setupModals();
    this.setupCopyEmail();
    this.setupSimulatedTelemetry();
    this.setupInteractiveSimulators();
    if (window.cyberAnimations && window.cyberAnimations.setupScrollReveal) {
      window.cyberAnimations.setupScrollReveal();
    }
  }

  startSystemClock() {
    const clockEl = document.getElementById('dashLocalClock');
    const uptimeEl = document.getElementById('dashUptime');

    const tick = () => {
      const now = new Date();
      if (clockEl) {
        clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false }) + ' LOCAL';
      }

      if (uptimeEl) {
        const diff = Math.floor((Date.now() - this.startTime) / 1000);
        const hrs = Math.floor(diff / 3600).toString().padStart(2, '0');
        const mins = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
        const secs = (diff % 60).toString().padStart(2, '0');
        uptimeEl.textContent = `${hrs}h:${mins}m:${secs}s`;
      }
    };

    tick();
    setInterval(tick, 1000);
  }

  setupSimulatedTelemetry() {
    const packetEl = document.getElementById('telemetryPackets');
    const cpuEl = document.getElementById('dashCpuLoad');
    const latencyEl = document.getElementById('dashLatency');
    const btnDiag = document.getElementById('btnRunDiagnostics');
    const btnHeroHud = document.getElementById('btnOpenHudFromHero');
    const hudDrawer = document.getElementById('cyberControlHud');
    const heroCard = document.getElementById('heroTelemetryCard');

    // Button to open HUD directly from Hero section
    if (btnHeroHud && hudDrawer) {
      btnHeroHud.addEventListener('click', (e) => {
        e.stopPropagation();
        hudDrawer.classList.toggle('is-open');
        if (window.cyberAudio) window.cyberAudio.playChirp(false);
      });
    }

    // Interactive Diagnostic Ping button
    if (btnDiag) {
      btnDiag.addEventListener('click', () => {
        btnDiag.disabled = true;
        btnDiag.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Pinging Subsystems...';
        if (window.cyberAudio) window.cyberAudio.playPacketBlip();

        if (heroCard) {
          heroCard.style.borderColor = 'var(--accent-green)';
          heroCard.style.boxShadow = '0 0 30px var(--accent-green-glow)';
        }

        setTimeout(() => {
          this.packetCount += Math.floor(Math.random() * 80) + 40;
          if (packetEl) packetEl.textContent = `${this.packetCount.toLocaleString()} pkts`;

          const newLat = Math.floor(Math.random() * 8) + 12;
          if (latencyEl) latencyEl.textContent = `${newLat}ms (Optimal)`;

          const newCpu = Math.floor(Math.random() * 15) + 8;
          if (cpuEl) cpuEl.textContent = `${newCpu}% (Nominal)`;

          btnDiag.disabled = false;
          btnDiag.innerHTML = '<i class="fa-solid fa-circle-check"></i> Ping Complete: All Systems 100%';

          if (window.cyberAudio) window.cyberAudio.playChirp(false);

          setTimeout(() => {
            btnDiag.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> Ping Live Telemetry Diagnostics';
            if (heroCard) {
              heroCard.style.borderColor = '';
              heroCard.style.boxShadow = '';
            }
          }, 2400);
        }, 600);
      });
    }

    // Background live simulation intervals
    setInterval(() => {
      this.packetCount += Math.floor(Math.random() * 14) + 4;
      if (packetEl) packetEl.textContent = `${this.packetCount.toLocaleString()} pkts`;
    }, 2200);

    setInterval(() => {
      const lat = Math.floor(Math.random() * 10) + 14;
      if (latencyEl) latencyEl.textContent = `${lat}ms (${lat < 18 ? 'Optimal' : 'Nominal'})`;
    }, 3500);

    setInterval(() => {
      const cpu = Math.floor(Math.random() * 12) + 10;
      if (cpuEl) cpuEl.textContent = `${cpu}% (Active)`;
    }, 4500);
  }

  /* ================= CONTENT RENDERERS ================= */

  renderSkills() {
    const progContainer = document.getElementById('skillsProgramming');
    const netContainer = document.getElementById('skillsNetworking');
    const cyberContainer = document.getElementById('skillsCybersecurity');
    const toolsContainer = document.getElementById('skillsTools');

    if (progContainer && progContainer.children.length === 0 && CONFIG.skills.programming) {
      progContainer.innerHTML = CONFIG.skills.programming.map(s => `
        <div class="skill-item">
          <div class="skill-header">
            <span class="skill-name"><i class="${s.icon}"></i> ${s.name}</span>
            <span class="skill-badge">${s.level}</span>
          </div>
        </div>
      `).join('');
    }

    if (netContainer && netContainer.children.length === 0 && CONFIG.skills.networking) {
      netContainer.innerHTML = CONFIG.skills.networking.map(s => `
        <div class="skill-item">
          <div class="skill-header">
            <span class="skill-name"><i class="fa-solid fa-network-wired"></i> ${s.name}</span>
          </div>
          <p class="skill-desc">${s.desc}</p>
        </div>
      `).join('');
    }

    if (cyberContainer && cyberContainer.children.length === 0 && CONFIG.skills.cybersecurity) {
      cyberContainer.innerHTML = CONFIG.skills.cybersecurity.map(s => `
        <div class="skill-item cyber-highlight">
          <div class="skill-header">
            <span class="skill-name"><i class="fa-solid fa-shield-halved"></i> ${s.name}</span>
          </div>
          <p class="skill-desc">${s.desc}</p>
        </div>
      `).join('');
    }

    if (toolsContainer && toolsContainer.children.length === 0 && CONFIG.skills.tools) {
      toolsContainer.innerHTML = CONFIG.skills.tools.map(s => `
        <div class="skill-item tool-pill">
          <i class="${s.icon}"></i>
          <div>
            <span class="tool-title">${s.name}</span>
            <span class="tool-sub">${s.category}</span>
          </div>
        </div>
      `).join('');
    }
  }

  renderProjects() {
    const container = document.getElementById('projectsGrid');
    if (!container) return;

    if (container.children.length === 0 && CONFIG.projects) {
      container.innerHTML = CONFIG.projects.map((proj, idx) => `
        <article class="project-card cyber-reveal">
          <div class="card-sheen"></div>
          <div class="project-card-thumb">
            <img src="${proj.schematic || 'assets/images/vlan-topology.svg'}" alt="${proj.title} Blueprint" class="project-thumb-img" loading="lazy">
            <span class="project-thumb-overlay"><i class="fa-solid fa-diagram-project"></i> ARCH-BLUEPRINT</span>
          </div>
          <div class="project-card-header">
            <span class="project-index">0${idx + 1} // SYS.PROJ</span>
            <span class="cyber-tag">${proj.badge}</span>
          </div>
          <h3 class="project-title">${proj.title}</h3>
          <p class="project-summary">${proj.summary}</p>
          
          <div class="project-tech-stack">
            ${proj.technologies.map(t => `<span class="tech-badge">${t}</span>`).join('')}
          </div>

          <div class="project-card-actions">
            <button class="cyber-btn cyber-btn-sm btn-project-detail" data-project-id="${proj.id}">
              <i class="fa-solid fa-terminal"></i> Architecture Deep Dive
            </button>
            <a href="${proj.github}" target="_blank" rel="noopener noreferrer" class="cyber-btn cyber-btn-ghost cyber-btn-sm" title="View Source on GitHub">
              <i class="fa-brands fa-github"></i> Source
            </a>
          </div>
        </article>
      `).join('');
    }

    container.querySelectorAll('.btn-project-detail').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-project-id');
        this.openProjectModal(id);
      });
    });

    if (window.cyberAnimations && window.cyberAnimations.setup3DCardTilt) {
      window.cyberAnimations.setup3DCardTilt();
    }
  }

  renderSecurityLabs() {
    const container = document.getElementById('securityLabsGrid');
    if (!container) return;

    if (container.children.length === 0 && CONFIG.securityLabs) {
      container.innerHTML = CONFIG.securityLabs.map(lab => {
        const isCompleted = lab.status === 'COMPLETED';
        return `
          <div class="lab-card cyber-reveal">
            <div class="card-sheen"></div>
            <div class="lab-header">
              <span class="lab-category"><i class="fa-solid fa-flask"></i> ${lab.category}</span>
              <span class="lab-status-badge ${isCompleted ? 'status-completed' : 'status-progress'}">
                <span class="status-dot"></span> ${isCompleted ? 'COMPLETED' : 'IN RESEARCH'}
              </span>
            </div>
            <h4 class="lab-title">${lab.title}</h4>
            <p class="lab-env"><strong>Environment:</strong> <code>${lab.environment}</code></p>
            <p class="lab-obj">${lab.objective}</p>
            <div class="lab-takeaway">
              <span class="takeaway-label">Key Competency:</span>
              <p>${lab.keyLearnings}</p>
            </div>
          </div>
        `;
      }).join('');
    }

    if (window.cyberAnimations && window.cyberAnimations.setup3DCardTilt) {
      window.cyberAnimations.setup3DCardTilt();
    }
  }

  renderCertifications() {
    const container = document.getElementById('certificationsGrid');
    if (!container) return;

    if (container.children.length === 0 && CONFIG.certifications) {
      container.innerHTML = CONFIG.certifications.map(cert => `
        <div class="cert-card cyber-reveal">
          <div class="card-sheen"></div>
          <div class="cert-icon-wrapper">
            <i class="fa-solid fa-certificate"></i>
          </div>
          <div class="cert-body">
            <span class="cert-badge">${cert.status}</span>
            <h4 class="cert-title">${cert.title}</h4>
            <span class="cert-issuer">${cert.issuer}</span>
            <p class="cert-desc">${cert.description}</p>
            <a href="${cert.credentialUrl}" target="_blank" rel="noopener noreferrer" class="cert-link">
              Verify Curriculum / Institution <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>
        </div>
      `).join('');
    }

    if (window.cyberAnimations && window.cyberAnimations.setup3DCardTilt) {
      window.cyberAnimations.setup3DCardTilt();
    }
  }

  renderWriteups() {
    const container = document.getElementById('writeupsGrid');
    if (!container) return;

    if (container.children.length === 0 && CONFIG.writeups) {
      container.innerHTML = CONFIG.writeups.map(w => `
        <article class="writeup-card cyber-reveal">
          <div class="card-sheen"></div>
          <div class="writeup-meta">
            <span class="writeup-cat">${w.category}</span>
            <span class="writeup-date">${w.date} • ${w.readTime}</span>
          </div>
          <h3 class="writeup-title">${w.title}</h3>
          <p class="writeup-excerpt">${w.excerpt}</p>
          <button class="cyber-link-btn btn-read-writeup" data-writeup-id="${w.id}">
            Read Technical Note <i class="fa-solid fa-chevron-right"></i>
          </button>
        </article>
      `).join('');
    }

    container.querySelectorAll('.btn-read-writeup').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-writeup-id');
        this.openWriteupModal(id);
      });
    });

    if (window.cyberAnimations && window.cyberAnimations.setup3DCardTilt) {
      window.cyberAnimations.setup3DCardTilt();
    }
  }

  /* ================= MODAL LOGIC ================= */

  setupModals() {
    const modal = document.getElementById('cyberModal');
    const closeBtn = document.getElementById('modalCloseBtn');
    const overlay = document.getElementById('modalBackdrop');

    if (!modal) return;

    const closeModal = () => {
      modal.classList.remove('is-active');
      document.body.classList.remove('modal-open');
      this.activeModal = null;
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-active')) {
        closeModal();
      }
    });
  }

  openProjectModal(projectId) {
    const proj = CONFIG.projects.find(p => p.id === projectId);
    if (!proj) return;

    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modal = document.getElementById('cyberModal');

    if (modalTitle) modalTitle.textContent = proj.title;

    if (modalBody) {
      modalBody.innerHTML = `
        <div class="modal-project-view">
          <div class="modal-badge-row">
            <span class="cyber-tag">${proj.badge}</span>
            <span class="term-muted">ID: ${proj.id}</span>
          </div>

          ${proj.schematic ? `
            <div class="modal-schematic-wrapper">
              <img src="${proj.schematic}" alt="${proj.title} Architecture Blueprint" class="modal-schematic-img">
            </div>
          ` : ''}

          <h4 class="modal-section-heading">Executive Summary</h4>
          <p class="modal-text">${proj.description}</p>

          <h4 class="modal-section-heading">Key Engineering & Security Features</h4>
          <ul class="modal-feature-list">
            ${proj.features.map(f => `<li><i class="fa-solid fa-angle-right"></i> ${f}</li>`).join('')}
          </ul>

          <h4 class="modal-section-heading">Implemented Technology Stack</h4>
          <div class="modal-tags">
            ${proj.technologies.map(t => `<span class="tech-badge">${t}</span>`).join('')}
          </div>

          <div class="modal-actions-footer">
            <a href="${proj.github}" target="_blank" rel="noopener noreferrer" class="cyber-btn">
              <i class="fa-brands fa-github"></i> Inspect Repository on GitHub
            </a>
          </div>
        </div>
      `;
    }

    if (modal) {
      modal.classList.add('is-active');
      document.body.classList.add('modal-open');
    }
  }

  parseMarkdownContent(md) {
    let text = (md || '').trim();

    // 1. Isolate code blocks first to protect code syntax
    const codeBlocks = [];
    text = text.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const escaped = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      const placeholder = `__CYBER_CODE_BLOCK_${codeBlocks.length}__`;
      codeBlocks.push(`<pre class="modal-code-block"><code>${escaped.trim()}</code></pre>`);
      return placeholder;
    });

    // 2. Headings
    text = text.replace(/^### (.*$)/gim, '<h4 class="modal-section-heading">$1</h4>');
    text = text.replace(/^## (.*$)/gim, '<h3 class="modal-section-heading">$1</h3>');

    // 3. Bold
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // 4. Inline code
    text = text.replace(/`([^`\n]+)`/g, '<code>$1</code>');

    // 5. Unordered List Items
    text = text.replace(/^\s*-\s+(.*$)/gim, '<li class="modal-list-item"><i class="fa-solid fa-angle-right"></i> $1</li>');
    text = text.replace(/(<li class="modal-list-item">[\s\S]*?<\/li>)/g, '<ul class="modal-feature-list">$1</ul>');
    text = text.replace(/<\/ul>\s*<ul class="modal-feature-list">/g, '');

    // 6. Restore preserved code blocks
    codeBlocks.forEach((block, index) => {
      text = text.replace(`__CYBER_CODE_BLOCK_${index}__`, block);
    });

    // 7. Structured Paragraphs
    const blocks = text.split(/\n\s*\n/).map(b => {
      b = b.trim();
      if (!b) return '';
      if (b.startsWith('<h') || b.startsWith('<pre') || b.startsWith('<ul')) return b;
      return `<p class="modal-text">${b.replace(/\n/g, '<br>')}</p>`;
    });

    return blocks.filter(Boolean).join('');
  }

  openWriteupModal(writeupId) {
    const w = CONFIG.writeups.find(item => item.id === writeupId);
    if (!w) return;

    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modal = document.getElementById('cyberModal');

    if (modalTitle) modalTitle.textContent = w.title;

    if (modalBody) {
      const formattedHtml = this.parseMarkdownContent(w.content);

      modalBody.innerHTML = `
        <div class="modal-writeup-view">
          <div class="modal-meta-row">
            <span class="cyber-tag">${w.category}</span>
            <span class="term-muted">${w.date} • ${w.readTime}</span>
          </div>
          <div class="modal-article-body">
            ${formattedHtml}
          </div>
        </div>
      `;
    }

    if (modal) {
      modal.classList.add('is-active');
      document.body.classList.add('modal-open');
    }
  }

  /* ================= COPY EMAIL HELPER ================= */

  setupCopyEmail() {
    const copyBtns = document.querySelectorAll('.btn-copy-email');
    copyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const email = CONFIG.profile.social.email;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email).then(() => {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied to Clipboard!';
            btn.classList.add('btn-success');
            setTimeout(() => {
              btn.innerHTML = originalText;
              btn.classList.remove('btn-success');
            }, 2500);
          }).catch(() => {
            prompt("Sabuj's Email:", email);
          });
        } else {
          prompt("Sabuj's Email:", email);
        }
      });
    });
  }
  /* ================= INTERACTIVE SECURITY SIMULATORS ================= */

  setupInteractiveSimulators() {
    this.setupPortScannerSimulator();
    this.setupVlanFlowSimulator();
    this.setupRadarSweep();
  }

  setupRadarSweep() {
    const canvas = document.getElementById('radarSweepCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let angle = 0;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const radius = w / 2 - 2;

    const blips = [
      { r: radius * 0.42, angle: 1.1, alpha: 0 },
      { r: radius * 0.72, angle: 3.2, alpha: 0 },
      { r: radius * 0.58, angle: 4.9, alpha: 0 }
    ];

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Radar background circle
      ctx.fillStyle = '#020704';
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Range grid rings
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.22)';
      ctx.lineWidth = 1;
      [0.35, 0.7, 1.0].forEach(ratio => {
        ctx.beginPath();
        ctx.arc(cx, cy, radius * ratio, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Axis crosshairs
      ctx.beginPath();
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.stroke();

      // Sweeping radar phosphor beam
      const beamArc = 0.55;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, 'rgba(0, 255, 136, 0.35)');
      grad.addColorStop(1, 'rgba(0, 255, 136, 0.04)');

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle - beamArc, angle);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Leading beam ray
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.9)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Radar Blips
      blips.forEach(blip => {
        const diff = Math.abs((angle % (Math.PI * 2)) - blip.angle);
        if (diff < 0.07) {
          blip.alpha = 1.0;
        } else {
          blip.alpha = Math.max(0, blip.alpha - 0.016);
        }

        if (blip.alpha > 0.05) {
          const bx = cx + Math.cos(blip.angle) * blip.r;
          const by = cy + Math.sin(blip.angle) * blip.r;
          ctx.beginPath();
          ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 255, 136, ${blip.alpha})`;
          ctx.shadowColor = '#00FF88';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      angle = (angle + 0.038) % (Math.PI * 2);
      requestAnimationFrame(draw);
    };

    draw();
  }

  setupPortScannerSimulator() {
    const scanBtn = document.getElementById('btnRunPortScan');
    const targetInput = document.getElementById('scanTargetInput');
    const logOutput = document.getElementById('scannerLogOutput');
    const progressBar = document.getElementById('scannerProgress');

    if (!scanBtn || !targetInput || !logOutput) return;

    scanBtn.addEventListener('click', () => {
      const target = targetInput.value.trim() || '192.168.10.1';
      scanBtn.disabled = true;
      scanBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Probing...';
      logOutput.innerHTML = '';
      if (progressBar) progressBar.style.width = '0%';

      const scanPorts = [
        { port: 21, proto: 'tcp', service: 'ftp', status: 'FILTERED', banner: 'Drop rule active' },
        { port: 22, proto: 'tcp', service: 'ssh', status: 'OPEN', banner: 'OpenSSH 8.9p1 (Secured Key Auth)' },
        { port: 53, proto: 'udp', service: 'dns', status: 'OPEN', banner: 'Internal DNS Resolver' },
        { port: 80, proto: 'tcp', service: 'http', status: 'OPEN', banner: 'Nginx Reverse Proxy' },
        { port: 443, proto: 'tcp', service: 'https', status: 'OPEN', banner: 'TLS 1.3 Strict-Transport' },
        { port: 3306, proto: 'tcp', service: 'mysql', status: 'BLOCKED', banner: 'Isolated DB Subnet' }
      ];

      this.appendScanLog(logOutput, `Initiating TCP SYN stealth scan on ${target}...`, 'term-cyan');
      if (window.cyberAudio) window.cyberAudio.playPacketBlip();

      let step = 0;
      const interval = setInterval(() => {
        if (step < scanPorts.length) {
          const p = scanPorts[step];
          const isOpen = p.status === 'OPEN';
          const line = `[PORT ${p.port}/${p.proto}]  ${p.service.toUpperCase().padEnd(6)} --> ${p.status} (${p.banner})`;
          this.appendScanLog(logOutput, line, isOpen ? 'term-accent' : 'term-muted');
          if (window.cyberAudio) window.cyberAudio.playPacketBlip();

          step++;
          const percent = Math.floor((step / scanPorts.length) * 100);
          if (progressBar) progressBar.style.width = `${percent}%`;
        } else {
          clearInterval(interval);
          this.appendScanLog(logOutput, `Scan complete: 3 open endpoints verified. Firewall rules active.`, 'term-white');
          scanBtn.disabled = false;
          scanBtn.innerHTML = '<i class="fa-solid fa-radar"></i> Run SYN Scan';
          if (window.cyberAudio) window.cyberAudio.playChirp();
        }
      }, 320);
    });
  }

  appendScanLog(container, text, className) {
    const div = document.createElement('div');
    div.className = `sim-log-line ${className}`;
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  setupVlanFlowSimulator() {
    const dispatchBtn = document.getElementById('btnDispatchPacket');
    const srcSelect = document.getElementById('vlanSrcSelect');
    const dstSelect = document.getElementById('vlanDstSelect');
    const animCanvas = document.getElementById('vlanPacketAnim');
    const statusResult = document.getElementById('vlanResultStatus');

    if (!dispatchBtn || !srcSelect || !dstSelect || !statusResult) return;

    dispatchBtn.addEventListener('click', () => {
      const src = srcSelect.value;
      const dst = dstSelect.value;

      dispatchBtn.disabled = true;
      statusResult.className = 'vlan-result-box vlan-processing';
      statusResult.innerHTML = '<i class="fa-solid fa-arrows-spin fa-spin"></i> Encapsulating 802.1Q packet across trunk...';

      if (window.cyberAudio) window.cyberAudio.playPacketBlip();

      setTimeout(() => {
        dispatchBtn.disabled = false;

        // Ruleset:
        // VLAN 10 (Engineering) can access VLAN 30 (Servers)
        // VLAN 20 (Guest) is BLOCKED from VLAN 30 (Servers) by Extended ACL 101
        // Same VLAN always allowed
        if (src === dst) {
          statusResult.className = 'vlan-result-box vlan-allowed';
          statusResult.innerHTML = `<i class="fa-solid fa-circle-check"></i> <strong>PACKET PERMITTED (Local L2 Switching)</strong><br>Intra-VLAN broadcast domain communication. No Layer 3 routing required.`;
          if (window.cyberAudio) window.cyberAudio.playChirp(false);
        } else if (src === 'vlan20' && dst === 'vlan30') {
          statusResult.className = 'vlan-result-box vlan-denied';
          statusResult.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <strong>PACKET DROPPED BY EXTENDED ACL 101</strong><br>Rule: <code>deny ip 192.168.20.0 0.0.0.255 192.168.30.0 0.0.0.255</code> enforced at Router sub-interface.`;
          if (window.cyberAudio) window.cyberAudio.playChirp(true);
        } else {
          statusResult.className = 'vlan-result-box vlan-allowed';
          statusResult.innerHTML = `<i class="fa-solid fa-shield-halved"></i> <strong>PACKET ROUTED (IEEE 802.1Q ROAS)</strong><br>Permitted through Router Sub-interface. Extended ACL verified.`;
          if (window.cyberAudio) window.cyberAudio.playChirp(false);
        }
      }, 750);
    });
  }
}

// Robust Instant Initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.cyberDashboard = new CyberDashboard();
  });
} else {
  window.cyberDashboard = new CyberDashboard();
}
