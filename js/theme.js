/**
 * SABUJ // CYBERSPACE - Multi-Palette Theme Engine
 * Controls dynamic theme switching across Matrix Green, Amber CRT, Ghost Cyan, and Red Team.
 */

class CyberThemeEngine {
  constructor() {
    this.themes = ['green', 'amber', 'cyan', 'red'];
    const saved = localStorage.getItem('cyber_theme');
    this.currentTheme = this.themes.includes(saved) ? saved : 'green';

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

    // Custom Reticle Cursor Toggle
    const cursorToggle = document.getElementById('toggleCustomCursor');
    if (cursorToggle) {
      const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
      const savedCursor = localStorage.getItem('cyber_cursor_enabled');
      const isCursorActive = !isTouch && (savedCursor !== 'false');
      cursorToggle.checked = isCursorActive;
      const cursorLabel = cursorToggle.parentElement ? cursorToggle.parentElement.querySelector('span') : null;
      if (cursorLabel) {
        cursorLabel.textContent = isCursorActive ? 'ON' : 'OFF';
        cursorLabel.style.color = isCursorActive ? 'var(--accent-green)' : 'var(--text-muted)';
      }

      cursorToggle.addEventListener('change', (e) => {
        if (window.cyberCursor) {
          if (e.target.checked) {
            window.cyberCursor.enable();
          } else {
            window.cyberCursor.disable();
          }
        }
        if (cursorLabel) {
          cursorLabel.textContent = e.target.checked ? 'ON' : 'OFF';
          cursorLabel.style.color = e.target.checked ? 'var(--accent-green)' : 'var(--text-muted)';
        }
        if (window.cyberAudio) window.cyberAudio.playKeyClick();
      });
    }

    // 3D Card Tilt Toggle
    const tiltToggle = document.getElementById('toggle3dCardTilt');
    if (tiltToggle) {
      const savedTilt = localStorage.getItem('cyber_tilt_enabled');
      const isTiltActive = savedTilt !== 'false';
      tiltToggle.checked = isTiltActive;
      const tiltLabel = tiltToggle.parentElement ? tiltToggle.parentElement.querySelector('span') : null;
      if (tiltLabel) {
        tiltLabel.textContent = isTiltActive ? 'ON' : 'OFF';
        tiltLabel.style.color = isTiltActive ? 'var(--accent-green)' : 'var(--text-muted)';
      }

      tiltToggle.addEventListener('change', (e) => {
        if (window.cyberAnimations && window.cyberAnimations.toggle3DTilt) {
          window.cyberAnimations.toggle3DTilt(e.target.checked);
        }
        if (tiltLabel) {
          tiltLabel.textContent = e.target.checked ? 'ON' : 'OFF';
          tiltLabel.style.color = e.target.checked ? 'var(--accent-green)' : 'var(--text-muted)';
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

    // Background Rain Blur Toggle (Global across Home Page HUD & Detail Pages)
    const updateBlurUI = (isActive) => {
      const canvas = document.getElementById('matrixCanvas');
      if (isActive) {
        document.body.classList.remove('rain-sharp');
        document.documentElement.classList.remove('rain-sharp');
        localStorage.setItem('cyber_rain_blur', 'on');
        if (canvas) {
          canvas.style.filter = 'blur(3px) contrast(1.3) brightness(1.2)';
          canvas.style.webkitFilter = 'blur(3px) contrast(1.3) brightness(1.2)';
          canvas.style.transform = 'scale(1.03)';
          canvas.style.opacity = '0.55';
        }
      } else {
        document.body.classList.add('rain-sharp');
        document.documentElement.classList.add('rain-sharp');
        localStorage.setItem('cyber_rain_blur', 'off');
        if (canvas) {
          canvas.style.filter = 'none';
          canvas.style.webkitFilter = 'none';
          canvas.style.transform = 'none';
          canvas.style.opacity = '0.65';
        }
      }

      // Update button on detail pages if present
      const detailBtn = document.getElementById('toggleRainBlur');
      if (detailBtn) {
        detailBtn.innerHTML = isActive ? '<i class="fa-solid fa-eye-slash"></i> Blur: ON' : '<i class="fa-solid fa-eye"></i> Blur: OFF';
      }

      // Update HUD toggle on home page if present
      const hudInput = document.getElementById('toggleRainBlurHud');
      const hudLabel = document.getElementById('rainBlurLabel');
      if (hudInput) hudInput.checked = isActive;
      if (hudLabel) {
        hudLabel.textContent = isActive ? 'ON' : 'OFF';
        hudLabel.style.color = isActive ? 'var(--accent-green)' : 'var(--text-muted)';
      }
    };

    const savedBlur = localStorage.getItem('cyber_rain_blur');
    const isBlurActive = savedBlur !== 'off'; // default is ON (blurry) across entire project
    updateBlurUI(isBlurActive);

    // Detail page button listener
    const blurToggleBtn = document.getElementById('toggleRainBlur');
    if (blurToggleBtn) {
      blurToggleBtn.addEventListener('click', () => {
        const currentlySharp = document.body.classList.contains('rain-sharp');
        updateBlurUI(currentlySharp); // toggle: if currently sharp, make active (blurry)
        if (window.cyberAudio) window.cyberAudio.playKeyClick();
      });
    }

    // Home page HUD switch listener
    const hudBlurToggle = document.getElementById('toggleRainBlurHud');
    if (hudBlurToggle) {
      hudBlurToggle.addEventListener('change', (e) => {
        updateBlurUI(e.target.checked);
        if (window.cyberAudio) window.cyberAudio.playKeyClick();
      });
    }
  }
}

// Global Theme Engine Instance
window.cyberTheme = new CyberThemeEngine();
