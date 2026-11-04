/**
 * SABUJ // CYBERSPACE - Web Audio API Synthesizer
 * Zero external audio files. Generates realistic mechanical clicks,
 * terminal command chirps, and telemetry tones dynamically.
 */

class CyberAudio {
  constructor() {
    this.audioCtx = null;
    this.isEnabled = false;
    this.masterGain = null;

    // Load persisted sound preference (default is OFF)
    // Defer AudioContext instantiation until first user interaction per browser autoplay policy
    const saved = localStorage.getItem('cyber_sfx_enabled');
    if (saved === 'true') {
      this.isEnabled = true;
    }
  }

  ensureContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(0.08, this.audioCtx.currentTime); // gentle, unobtrusive volume
        this.masterGain.connect(this.audioCtx.destination);
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggle() {
    if (this.isEnabled) {
      this.disable();
    } else {
      this.enable();
      this.playChirp();
    }
    return this.isEnabled;
  }

  enable() {
    this.ensureContext();
    this.isEnabled = true;
    localStorage.setItem('cyber_sfx_enabled', 'true');
    this.updateUI();
  }

  disable() {
    this.isEnabled = false;
    localStorage.setItem('cyber_sfx_enabled', 'false');
    this.updateUI();
  }

  updateUI() {
    const sfxToggles = document.querySelectorAll('.cyber-sfx-toggle');
    sfxToggles.forEach(btn => {
      btn.classList.toggle('sfx-active', this.isEnabled);
      const label = btn.querySelector('.sfx-status-text');
      if (label) {
        label.textContent = this.isEnabled ? 'SFX: ON' : 'SFX: OFF';
      }
    });
  }

  /**
   * Subtle mechanical keystroke sound (short white noise burst + resonant click)
   */
  playKeyClick() {
    if (!this.isEnabled) return;
    try {
      this.ensureContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800 + Math.random() * 300, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.025);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.025);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Terminal command execution chirp (high-tech two-tone burst)
   */
  playChirp(isError = false) {
    if (!this.isEnabled) return;
    try {
      this.ensureContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = isError ? 'sawtooth' : 'sine';
      if (isError) {
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.setValueAtTime(180, now + 0.06);
      } else {
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.setValueAtTime(1160, now + 0.05);
      }

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}
  }

  /**
   * Network packet transmit sound
   */
  playPacketBlip() {
    if (!this.isEnabled) return;
    try {
      this.ensureContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200 + Math.random() * 400, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }
}

// Global Audio Instance
window.cyberAudio = new CyberAudio();
