/**
 * SABUJ // CYBERSPACE - Animations & Visual FX Engine
 * Handles Canvas Matrix Rain with dynamic theming, speed control, CRT filters,
 * typewriter effects, and performance optimizations.
 */

class CyberAnimations {
  constructor() {
    this.canvas = document.getElementById('matrixCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.animationFrameId = null;
    this.isPaused = false;
    this.fontSize = 14;
    this.columns = 0;
    this.drops = [];
    this.lastWidth = window.innerWidth;

    // SPEED CONTROL: Higher = slower rain, Lower = faster rain
    // Recommended: 50ms (smooth cinematic ~20fps), 75ms (slow/ambient), 25ms (turbo)
    this.speedInterval = 50;
    this.lastFrameTime = 0;
    this.accentColor = '#00FF88';

    this.charSets = {
      matrix: 'অআইঈউঊঋএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহড়ঢ়য়ৎংঃঁABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789<>/{};:*#%&=+~',
      binary: '010101010101001101000001010000100101010101001010',
      hex: '0123456789ABCDEF0xDEAD0xBEEF0x7F0x900xCC0xAA0xFF'
    };
    this.currentCharSet = 'matrix';
    this.chars = this.charSets.matrix;

    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.tiltEnabled = localStorage.getItem('cyber_tilt_enabled') !== 'false';

    this.init();
  }

  init() {
    this.updateAccentColor();
    if (this.canvas && this.ctx && !this.prefersReducedMotion) {
      this.setupMatrixCanvas();
      this.startMatrixLoop();
      this.attachVisibilityListeners();
    }

    this.setupScrollReveal();
    this.setupTypewriter();
    this.setup3DCardTilt();
  }

  updateAccentColor() {
    const computed = getComputedStyle(document.documentElement).getPropertyValue('--accent-green').trim();
    if (computed) {
      this.accentColor = computed;
    }
  }

  setupMatrixCanvas() {
    this.lastHeight = window.innerHeight;

    const resize = () => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;
      const widthDiff = Math.abs(currentWidth - this.lastWidth);
      const heightDiff = Math.abs(currentHeight - this.lastHeight);

      // On mobile, ignore small vertical height changes caused by URL bar collapsing
      if (this.drops.length === 0 || widthDiff > 15 || heightDiff > 120) {
        this.canvas.width = currentWidth;
        this.canvas.height = currentHeight;
        this.lastWidth = currentWidth;
        this.lastHeight = currentHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = Array.from({ length: this.columns }, () => Math.floor(Math.random() * -50));
      }
    };

    resize();
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 150);
    }, { passive: true });

    // Apply blur effect directly to canvas DOM element to guarantee visibility across all pages
    const isSharp = localStorage.getItem('cyber_rain_blur') === 'off';
    if (!isSharp) {
      this.canvas.style.filter = 'blur(3px) contrast(1.3) brightness(1.2)';
      this.canvas.style.webkitFilter = 'blur(3px) contrast(1.3) brightness(1.2)';
      this.canvas.style.transform = 'scale(1.03)';
      this.canvas.style.opacity = '0.55';
    } else {
      this.canvas.style.filter = 'none';
      this.canvas.style.webkitFilter = 'none';
      this.canvas.style.transform = 'none';
      this.canvas.style.opacity = '0.65';
    }
  }

  drawMatrix(timestamp = 0) {
    if (this.isPaused || this.prefersReducedMotion) return;

    this.animationFrameId = requestAnimationFrame((ts) => this.drawMatrix(ts));

    // Frame throttle
    if (timestamp - this.lastFrameTime < this.speedInterval) {
      return;
    }
    this.lastFrameTime = timestamp;

    // Trailing darkness
    this.ctx.fillStyle = 'rgba(8, 13, 11, 0.08)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = `${this.fontSize}px "JetBrains Mono", monospace`;

    for (let i = 0; i < this.drops.length; i++) {
      const char = this.chars[Math.floor(Math.random() * this.chars.length)];
      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;

      // Leading character is brighter white / primary accent
      const isLeader = Math.random() > 0.88;
      this.ctx.fillStyle = isLeader ? '#ffffff' : this.accentColor;
      this.ctx.shadowBlur = isLeader ? 8 : 0;
      this.ctx.shadowColor = this.accentColor;
      this.ctx.fillText(char, x, y);
      this.ctx.shadowBlur = 0;

      if (y > this.canvas.height && Math.random() > 0.985) {
        this.drops[i] = 0;
      }
      this.drops[i]++;
    }
  }

  startMatrixLoop() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    this.isPaused = false;
    this.lastFrameTime = performance.now();
    this.animationFrameId = requestAnimationFrame((ts) => this.drawMatrix(ts));
  }

  pauseMatrixLoop() {
    this.isPaused = true;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  setSpeed(intervalMs) {
    const parsed = parseInt(intervalMs, 10);
    if (!isNaN(parsed) && parsed >= 10 && parsed <= 300) {
      this.speedInterval = parsed;
      if (this.isPaused) this.startMatrixLoop();
      return true;
    }
    return false;
  }

  togglePause() {
    if (this.isPaused) {
      this.startMatrixLoop();
    } else {
      this.pauseMatrixLoop();
    }
    return this.isPaused;
  }

  setCharSet(type) {
    if (this.charSets[type]) {
      this.currentCharSet = type;
      this.chars = this.charSets[type];
      return true;
    }
    return false;
  }

  toggleScanlines(force) {
    const scanlines = document.querySelector('.cyber-scanlines');
    if (!scanlines) return false;
    const shouldShow = force !== undefined ? force : scanlines.style.display === 'none';
    scanlines.style.display = shouldShow ? 'block' : 'none';
    return shouldShow;
  }

  attachVisibilityListeners() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseMatrixLoop();
      } else {
        this.startMatrixLoop();
      }
    });

    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.prefersReducedMotion = e.matches;
      if (this.prefersReducedMotion) {
        this.pauseMatrixLoop();
        if (this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      } else {
        this.startMatrixLoop();
      }
    });
  }

  setupScrollReveal() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.cyber-reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }

    if (!this.scrollObserver) {
      this.scrollObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px'
      });
    }

    const revealElements = document.querySelectorAll('.cyber-reveal:not(.is-visible)');
    revealElements.forEach(el => this.scrollObserver.observe(el));
  }

  setupTypewriter() {
    const elements = document.querySelectorAll('[data-typewriter]');
    elements.forEach(el => {
      const text = el.getAttribute('data-typewriter') || el.textContent;
      el.textContent = '';
      el.classList.add('typing-active');

      let i = 0;
      const speed = parseInt(el.getAttribute('data-type-speed'), 10) || 40;

      const typeNext = () => {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          i++;
          setTimeout(typeNext, speed);
        } else {
          el.classList.remove('typing-active');
        }
      };

      const delay = parseInt(el.getAttribute('data-type-delay'), 10) || 200;
      setTimeout(typeNext, delay);
    });
  }

  setup3DCardTilt() {
    if (this.tiltListenersAttached) return;
    this.tiltListenersAttached = true;

    const tiltSelector = '.project-card, .lab-card, .cert-card, .writeup-card, .sim-workbench-card, .skill-category-card, .hero-hud-card';

    let activeCard = null;

    document.addEventListener('mousemove', (e) => {
      if (this.prefersReducedMotion || !this.tiltEnabled) return;
      if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
      if (window.innerWidth <= 992) return;

      const card = e.target.closest(tiltSelector);

      if (card) {
        // Automatically inject sheen element if missing
        if (!card.querySelector('.card-sheen')) {
          const sheen = document.createElement('div');
          sheen.className = 'card-sheen';
          card.prepend(sheen);
        }

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6.5;
        const rotateY = ((x - centerX) / centerX) * 6.5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px) scale3d(1.02, 1.02, 1.02)`;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        if (activeCard && activeCard !== card) {
          activeCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)';
        }
        activeCard = card;
      } else if (activeCard) {
        activeCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)';
        activeCard = null;
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      if (activeCard) {
        activeCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)';
        activeCard = null;
      }
    });

    document.addEventListener('mouseout', (e) => {
      const card = e.target.closest(tiltSelector);
      if (card && (!e.relatedTarget || !card.contains(e.relatedTarget))) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)';
        if (activeCard === card) activeCard = null;
      }
    }, { passive: true });
  }

  toggle3DTilt(enabled) {
    this.tiltEnabled = enabled;
    localStorage.setItem('cyber_tilt_enabled', enabled ? 'true' : 'false');
    const tiltSelector = '.project-card, .lab-card, .cert-card, .writeup-card, .sim-workbench-card, .skill-category-card, .hero-hud-card';
    const cards = document.querySelectorAll(tiltSelector);
    if (!enabled) {
      cards.forEach(card => {
        card.style.transform = 'none';
      });
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.cyberAnimations = new CyberAnimations();
  });
} else {
  window.cyberAnimations = new CyberAnimations();
}
