/**
 * SABUJ // CYBERSPACE - Multi-Palette Theme Engine
 * Controls dynamic theme switching across Matrix Green, Amber CRT, Ghost Cyan, and Red Team.
 */

class CyberThemeEngine {
  constructor() {
    this.themes = ['green', 'amber', 'cyan', 'red'];
    this.currentTheme = localStorage.getItem('cyber_theme') || 'green';

    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme, false);
    this.setupUIListeners();
  }

  applyTheme(themeName, playSound = true) {
    if (!this.themes.includes(themeName)) return false;

    this.currentTheme = themeName;
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('cyber_theme', themeName);

    // Update animations accent color
    if (window.cyberAnimations) {
      window.cyberAnimations.updateAccentColor();
    }

    // Update HUD buttons active states
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-theme-set') === themeName);
    });

    if (playSound && window.cyberAudio) {
      window.cyberAudio.playChirp();
    }

    return true;
  }

  setupUIListeners() {
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme-set');
        if (theme) this.applyTheme(theme);
      });
    });

    // Control drawer toggle
    const drawerToggle = document.getElementById('hudDrawerToggle');
    const hudDrawer = document.getElementById('cyberControlHud');
    const drawerClose = document.getElementById('hudDrawerClose');

    if (drawerToggle && hudDrawer) {
      drawerToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        hudDrawer.classList.toggle('is-open');
        if (window.cyberAudio) window.cyberAudio.playKeyClick();
      });
    }

    if (drawerClose && hudDrawer) {
      drawerClose.addEventListener('click', (e) => {
        e.stopPropagation();
        hudDrawer.classList.remove('is-open');
      });
    }

    // Close HUD on click outside or Escape
    document.addEventListener('click', (e) => {
      if (hudDrawer && hudDrawer.classList.contains('is-open')) {
        if (!hudDrawer.contains(e.target) && !drawerToggle.contains(e.target)) {
          hudDrawer.classList.remove('is-open');
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && hudDrawer && hudDrawer.classList.contains('is-open')) {
        hudDrawer.classList.remove('is-open');
      }
    });

    // Matrix Speed Buttons in HUD
    document.querySelectorAll('.matrix-speed-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const speed = btn.getAttribute('data-speed');
        document.querySelectorAll('.matrix-speed-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (window.cyberAnimations) {
          if (speed === 'pause') {
            window.cyberAnimations.pauseMatrixLoop();
          } else {
            window.cyberAnimations.setSpeed(parseInt(speed, 10));
          }
        }
        if (window.cyberAudio) window.cyberAudio.playKeyClick();
      });
    });

    // CRT Scanlines Toggle
    const crtToggle = document.getElementById('toggleCrtScanlines');
    if (crtToggle) {
      crtToggle.addEventListener('change', (e) => {
        if (window.cyberAnimations) {
          window.cyberAnimations.toggleScanlines(e.target.checked);
        }
        const labelSpan = crtToggle.parentElement ? crtToggle.parentElement.querySelector('span') : null;
        if (labelSpan) {
          labelSpan.textContent = e.target.checked ? 'ON' : 'OFF';
          labelSpan.style.color = e.target.checked ? 'var(--accent-green)' : 'var(--text-muted)';
        }
        if (window.cyberAudio) window.cyberAudio.playKeyClick();
      });
    }

    // Audio SFX Toggle in Nav and HUD
    document.querySelectorAll('.cyber-sfx-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.cyberAudio) {
          window.cyberAudio.toggle();
        }
      });
    });
  }
}

// Global Theme Engine Instance
window.cyberTheme = new CyberThemeEngine();
