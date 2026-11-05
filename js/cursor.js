/**
 * SABUJ // CYBERSPACE - Military-Grade Cyber Reticle Cursor
 * Dual-ring target reticle with smooth LERP trailing physics,
 * magnetic element snapping, click radar shockwaves, and mobile safety.
 */

class CyberCursor {
  constructor() {
    this.dot = null;
    this.ring = null;
    this.mouse = { x: -100, y: -100 };
    this.ringPos = { x: -100, y: -100 };
    this.lerpFactor = 0.2;
    this.isLocked = false;
    this.isEnabled = true;
    this.rafId = null;

    // Check if device has pointer/hover capabilities (desktop/laptop) or mobile width
    this.isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches || window.innerWidth <= 992;

    // Load persisted preference (default: ON for desktop)
    const saved = localStorage.getItem('cyber_cursor_enabled');
    if (saved === 'false' || this.isTouchDevice) {
      this.isEnabled = false;
    }

    this.init();
  }

  init() {
    // Mobile & Touch safety: immediately disable custom cursor on any touch interaction
    window.addEventListener('touchstart', () => {
      this.isTouchDevice = true;
      this.disable();
    }, { once: true, passive: true });

    if (this.isTouchDevice) return;

    this.createElements();
    this.setupListeners();
    if (this.isEnabled) {
      this.enable();
    }
  }

  createElements() {
    // Create laser dot
    this.dot = document.createElement('div');
    this.dot.className = 'cyber-cursor-dot';

    // Create outer target reticle
    this.ring = document.createElement('div');
    this.ring.className = 'cyber-cursor-ring';
    this.ring.innerHTML = `
      <span class="reticle-corner reticle-tl"></span>
      <span class="reticle-corner reticle-tr"></span>
      <span class="reticle-corner reticle-bl"></span>
      <span class="reticle-corner reticle-br"></span>
      <span class="reticle-label">TARGET</span>
    `;

    document.body.appendChild(this.dot);
    document.body.appendChild(this.ring);
  }

  setupListeners() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      if (this.dot && this.isEnabled) {
        this.dot.style.transform = `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0)`;
      }
    }, { passive: true });

    // Click shockwave
    window.addEventListener('mousedown', (e) => {
      if (!this.isEnabled) return;
      this.spawnClickShockwave(e.clientX, e.clientY);
      if (this.ring) {
        this.ring.classList.add('is-clicking');
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.ring) {
        this.ring.classList.remove('is-clicking');
      }
    });

    // Interactive element locking
    const interactiveSelectors = 'a, button, input, select, textarea, .project-card, .lab-card, .cert-card, .writeup-card, .sim-workbench-card, .skill-category-card, .hero-hud-card, .term-quick-btn, .hud-badge-simulated, .theme-btn, .matrix-speed-btn, .cyber-tag, .tech-badge';
    
    document.addEventListener('mouseover', (e) => {
      if (!this.isEnabled) return;
      const target = e.target.closest(interactiveSelectors);
      if (target) {
        this.isLocked = true;
        this.ring.classList.add('is-locked');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (!this.isEnabled) return;
      const target = e.target.closest(interactiveSelectors);
      if (target) {
        this.isLocked = false;
        this.ring.classList.remove('is-locked');
      }
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      if (this.dot) this.dot.style.opacity = '0';
      if (this.ring) this.ring.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      if (this.dot && this.isEnabled) this.dot.style.opacity = '1';
      if (this.ring && this.isEnabled) this.ring.style.opacity = '1';
    });
  }

  animate() {
    if (!this.isEnabled || !this.ring) return;

    // Linear interpolation for smooth trailing weight
    this.ringPos.x += (this.mouse.x - this.ringPos.x) * this.lerpFactor;
    this.ringPos.y += (this.mouse.y - this.ringPos.y) * this.lerpFactor;

    this.ring.style.transform = `translate3d(${this.ringPos.x}px, ${this.ringPos.y}px, 0)`;

    this.rafId = requestAnimationFrame(() => this.animate());
  }

  spawnClickShockwave(x, y) {
    const pulse = document.createElement('div');
    pulse.className = 'cyber-cursor-pulse';
    pulse.style.left = `${x}px`;
    pulse.style.top = `${y}px`;
    document.body.appendChild(pulse);

    setTimeout(() => pulse.remove(), 500);
  }

  enable() {
    this.isEnabled = true;
    localStorage.setItem('cyber_cursor_enabled', 'true');
    document.body.classList.add('custom-cursor-active');
    if (this.dot) this.dot.style.display = 'block';
    if (this.ring) this.ring.style.display = 'block';
    if (!this.rafId) {
      this.animate();
    }
  }

  disable() {
    this.isEnabled = false;
    localStorage.setItem('cyber_cursor_enabled', 'false');
    document.body.classList.remove('custom-cursor-active');
    if (this.dot) this.dot.style.display = 'none';
    if (this.ring) this.ring.style.display = 'none';
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  toggle() {
    if (this.isEnabled) {
      this.disable();
    } else {
      this.enable();
    }
    return this.isEnabled;
  }
}

// Global Cursor Instance
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.cyberCursor = new CyberCursor();
  });
} else {
  window.cyberCursor = new CyberCursor();
}
