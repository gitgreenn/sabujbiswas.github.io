/**
 * SABUJ // CYBERSPACE - Main Application Orchestrator
 * Boot sequence, navigation, contact form handlers, and accessibility enhancements.
 */

function runMain() {
  initBootSequence();
  initNavigation();
  initContactForm();
  initSmoothScroll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runMain);
} else {
  runMain();
}

/* ================= LINUX BOOT SEQUENCE ================= */
function initBootSequence() {
  const bootScreen = document.getElementById('bootScreen');
  const bootLogs = document.getElementById('bootLogs');
  const bootProgress = document.getElementById('bootProgressBar');
  const bootPercent = document.getElementById('bootPercent');
  const skipBtn = document.getElementById('skipBootBtn');

  if (!bootScreen) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isReturningVisitor = sessionStorage.getItem('boot_sequence_seen');

  // Fast-path for returning visitors or reduced motion
  if (reducedMotion || isReturningVisitor) {
    document.body.classList.remove('booting');
    bootScreen.remove();
    return;
  }

  sessionStorage.setItem('boot_sequence_seen', 'true');

  const bootMessages = [
    "[ 0.000000] Linux version 6.1.0-hardened-x86_64 (root@cyberspace) #1 SMP PREEMPT",
    "[ 0.021500] Initializing Security Subsystems: AppArmor, SELinux, eBPF... [OK]",
    "[ 0.078200] ACPI: Core system tables initialized (4 Cores / 8 Threads)",
    "[ 0.143000] Mounting virtual encrypted filesystem [AES-256-GCM]... [OK]",
    "[ 0.224000] Checking Network Interfaces: eth0 up, vlan10 up, lo up... [OK]",
    "[ 0.312000] Loading CyberSpace profile: SABUJ BISWAS (Cybersecurity Enthusiast)...",
    "[ 0.450000] Spawning interactive terminal environment and telemetry HUD...",
    "[ 0.600000] SYSTEM READY // INITIALIZING GRAPHICAL WORKSPACE..."
  ];

  let currentMsgIndex = 0;
  let progress = 0;
  let isSkipped = false;

  const dismissBoot = () => {
    if (isSkipped) return;
    isSkipped = true;
    bootScreen.classList.add('fade-out');
    document.body.classList.remove('booting');
    setTimeout(() => {
      bootScreen.remove();
      const termInput = document.getElementById('terminalInput');
      if (termInput && window.innerWidth > 768) {
        termInput.focus();
      }
    }, 400);
  };

  if (skipBtn) skipBtn.addEventListener('click', dismissBoot);

  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Escape' || e.code === 'Space') && document.body.classList.contains('booting')) {
      dismissBoot();
    }
  });

  const logInterval = setInterval(() => {
    if (isSkipped) {
      clearInterval(logInterval);
      return;
    }

    if (currentMsgIndex < bootMessages.length) {
      const p = document.createElement('p');
      p.className = 'boot-log-entry';
      p.textContent = bootMessages[currentMsgIndex];
      if (bootLogs) {
        bootLogs.appendChild(p);
        bootLogs.scrollTop = bootLogs.scrollHeight;
      }
      currentMsgIndex++;

      progress = Math.min(100, Math.floor((currentMsgIndex / bootMessages.length) * 100));
      if (bootProgress) bootProgress.style.width = `${progress}%`;
      if (bootPercent) bootPercent.textContent = `${progress}%`;
    } else {
      clearInterval(logInterval);
      setTimeout(dismissBoot, 350);
    }
  }, 170);
}

/* ================= RESPONSIVE NAVIGATION ================= */
function initNavigation() {
  const toggleBtn = document.getElementById('navToggle');
  const navMenu = document.getElementById('navLinks');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.querySelector('.navbar-wrapper');

  if (toggleBtn && navMenu) {
    const toggleIcon = toggleBtn.querySelector('i');

    const setMenuState = (isOpen) => {
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navMenu.classList.toggle('is-open', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
      if (toggleIcon) {
        toggleIcon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    };

    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      setMenuState(!isExpanded);
    });

    // Close on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        setMenuState(false);
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navMenu.classList.contains('is-open')) {
        setMenuState(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        setMenuState(false);
      }
    });
  }

  // Active section spy on scroll
  const sections = document.querySelectorAll('section[id]');
  let ticking = false;

  const handleScrollSpy = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        sections.forEach(sec => {
          const top = sec.offsetTop - 120;
          const height = sec.offsetHeight;
          const id = sec.getAttribute('id');
          const navItem = document.querySelector(`.nav-link[href="#${id}"]`);

          if (navItem && scrollY >= top && scrollY < top + height) {
            navLinks.forEach(l => l.classList.remove('active'));
            navItem.classList.add('active');
          }
        });

        if (navbar) {
          if (scrollY > 40) {
            navbar.classList.add('is-scrolled');
          } else {
            navbar.classList.remove('is-scrolled');
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScrollSpy, { passive: true });
}

/* ================= CONTACT FORM HANDLER ================= */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.elements['name']?.value.trim();
    const email = form.elements['email']?.value.trim();
    const subject = form.elements['subject']?.value.trim() || 'Cybersecurity Portfolio Inquiry';
    const message = form.elements['message']?.value.trim();

    if (!name || !email || !message) {
      showFeedback('Please fill out all required fields before submitting.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFeedback('Please provide a valid email address.', 'error');
      return;
    }

    // Static site policy: Do NOT fabricate a backend success message.
    const recipient = CONFIG.profile.social.email;
    const mailtoBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n---\nSent via Sabuj Biswas CyberSpace Portfolio`
    );
    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${mailtoBody}`;

    showFeedback(
      `Static Site Notice: Serverless mail dispatch not active. Launching default email client to send to ${recipient}...`,
      'info'
    );

    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 1100);
  });

  function showFeedback(text, type) {
    if (!feedback) return;
    feedback.textContent = text;
    feedback.className = `form-status form-status-${type}`;
  }
}

/* ================= SMOOTH SCROLL ACCESSIBILITY ================= */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      try {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const navbar = document.querySelector('.navbar-wrapper');
          const navHeight = navbar ? navbar.offsetHeight : 76;
          const topPos = targetEl.getBoundingClientRect().top + window.pageYOffset - (navHeight - 10);

          window.scrollTo({
            top: topPos,
            behavior: 'smooth'
          });
        }
      } catch (err) {
        // Fallback for non-standard selector
      }
    });
  });
}
