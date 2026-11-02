document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle & Navigation Accessibility
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    function closeMobileNav() {
        if (!navLinks || !navToggle) return;
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        const icon = navToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isOpening = !navLinks.classList.contains('active');
            navLinks.classList.toggle('active', isOpening);
            navToggle.setAttribute('aria-expanded', isOpening ? 'true' : 'false');
            
            const icon = navToggle.querySelector('i');
            if (icon) {
                if (isOpening) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Close mobile menu when a nav link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileNav);
        });

        // Close on clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                closeMobileNav();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMobileNav();
            }
        });
    }

    // 2. Dynamic Typing Effect (Smooth start without initial text snapping)
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        const phrases = [
            'modern web experiences',
            'responsive user interfaces',
            'clean & performant code',
            'interactive web applications'
        ];

        let phraseIndex = 0;
        let charIndex = phrases[0].length;
        let isDeleting = true;
        let typingSpeed = 100;

        function type() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 45;
            } else {
                typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 90;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                // Pause at end of phrase
                isDeleting = true;
                typingSpeed = 2200;
            } else if (isDeleting && charIndex === 0) {
                // Move to next phrase
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 400;
            }

            setTimeout(type, typingSpeed);
        }

        // Start deleting after user has had time to read the initial rendered phrase
        setTimeout(type, 2200);
    }

    // 3. Copy Email to Clipboard with Safe Fallback and Toast Debounce
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const toast = document.getElementById('toast');
    let toastTimeout = null;

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            toastTimeout = null;
        }, 3000);
    }

    function fallbackCopy(text) {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.setAttribute('readonly', '');
            textArea.style.position = 'absolute';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            if (successful) {
                showToast('Email address copied to clipboard!');
            } else {
                showToast('Press Ctrl+C to copy: ' + text);
            }
        } catch {
            showToast('Email: ' + text);
        }
    }

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const email = '31.sabuj.biswas@gmail.com';
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(email)
                    .then(() => showToast('Email address copied to clipboard!'))
                    .catch(() => fallbackCopy(email));
            } else {
                fallbackCopy(email);
            }
        });
    }

    // 4. Dynamic Year in Footer
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }
});