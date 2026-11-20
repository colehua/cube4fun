// =========================================================================
// 🧊 LEARN CUBE 4 FUN - THEME SYSTEM (DARK / LIGHT MODE)
// Synchronous initialization to prevent flashing, persistent localStorage,
// animated toggle buttons, and floating quick-switch support.
// =========================================================================

(function() {
    'use strict';

    // 1. Synchronously apply theme before DOM renders
    try {
        const savedTheme = localStorage.getItem('cube_theme');
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark-mode');
        } else if (savedTheme === 'light') {
            document.documentElement.classList.remove('dark-mode');
        } else {
            // Check system preferences if no choice is saved
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                document.documentElement.classList.add('dark-mode');
            }
        }
    } catch (e) {
        console.warn('Unable to access localStorage for theme:', e);
    }

    // Helper to get current theme state
    function isDarkMode() {
        return document.documentElement.classList.contains('dark-mode') || 
               (document.body && document.body.classList.contains('dark-mode'));
    }

    // Update all button states on the page
    function updateThemeButtons() {
        const dark = isDarkMode();
        const icon = dark ? '☀️' : '🌙';
        const text = dark ? 'Light Mode' : 'Dark Mode';
        const title = dark ? 'Switch to Light Mode ☀️' : 'Switch to Dark Mode 🌙';

        // Update all buttons with theme toggle classes or IDs
        const buttons = document.querySelectorAll('#theme-toggle, .theme-toggle-btn, .floating-theme-toggle');
        buttons.forEach(btn => {
            btn.setAttribute('title', title);
            btn.setAttribute('aria-label', title);
            const iconSpan = btn.querySelector('.theme-toggle-icon');
            const textSpan = btn.querySelector('.theme-toggle-text');
            if (iconSpan) iconSpan.textContent = icon;
            if (textSpan) textSpan.textContent = text;
            if (!iconSpan && !textSpan) {
                btn.innerHTML = `<span class="theme-toggle-icon">${icon}</span> <span class="theme-toggle-text">${text}</span>`;
            }
        });
    }

    // Main Toggle Function
    window.toggleTheme = function() {
        const makeDark = !isDarkMode();
        
        if (makeDark) {
            document.documentElement.classList.add('dark-mode');
            if (document.body) document.body.classList.add('dark-mode');
            try { localStorage.setItem('cube_theme', 'dark'); } catch (e) {}
        } else {
            document.documentElement.classList.remove('dark-mode');
            if (document.body) document.body.classList.remove('dark-mode');
            try { localStorage.setItem('cube_theme', 'light'); } catch (e) {}
        }

        updateThemeButtons();

        // Dispatch event for any other components
        try {
            window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: makeDark ? 'dark' : 'light' } }));
        } catch (e) {}
    };

    // Ensure body syncs with documentElement and floating toggle exists
    function initThemeUI() {
        const dark = document.documentElement.classList.contains('dark-mode');
        if (document.body) {
            if (dark) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }

        // Check if theme toggle button already exists
        let existingBtn = document.querySelector('#theme-toggle, .theme-toggle-btn');
        if (!existingBtn) {
            // Find top navigation bar to integrate cleanly into the layout without blocking any UI elements
            const navContainer = document.querySelector('.cs-site-nav, .nav-buttons, .nav-group-right, nav');
            if (navContainer) {
                const toggleBtn = document.createElement('button');
                toggleBtn.id = 'theme-toggle';
                toggleBtn.className = 'nav-button theme-toggle-btn';
                toggleBtn.setAttribute('aria-label', 'Toggle Dark/Light Mode');
                toggleBtn.setAttribute('title', dark ? 'Switch to Light Mode ☀️' : 'Switch to Dark Mode 🌙');
                toggleBtn.onclick = window.toggleTheme;
                toggleBtn.style.cursor = 'pointer';
                toggleBtn.innerHTML = `
                    <span class="theme-toggle-icon">${dark ? '☀️' : '🌙'}</span>
                    <span class="theme-toggle-text">${dark ? 'Light Mode' : 'Dark Mode'}</span>
                `;
                navContainer.appendChild(toggleBtn);
            }
        }

        // Cleanly remove any floating toggle elements so they never block or overlap screen content
        document.querySelectorAll('.floating-theme-toggle').forEach(el => el.remove());

        updateThemeButtons();
        ensureHomeButton();
        initSecretRocketPortal();
    }

    // Universal Secret Rocket Button & Game Mode Launch Portal
    function initSecretRocketPortal() {
        document.querySelectorAll('.secret-rocket-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const path = window.location.pathname.toLowerCase();
                if (path.endsWith('/games.html') || path.endsWith('\\games.html') || path.includes('games.html')) {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();

                // 1. Synthesize rocket blast-off sound
                try {
                    const AudioCtx = window.AudioContext || window.webkitAudioContext;
                    if (AudioCtx) {
                        const ctx = new AudioCtx();
                        const now = ctx.currentTime;
                        // Noise thruster
                        const sampleRate = ctx.sampleRate;
                        const buffer = ctx.createBuffer(1, sampleRate * 0.4, sampleRate);
                        const data = buffer.getChannelData(0);
                        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
                        const noise = ctx.createBufferSource();
                        noise.buffer = buffer;
                        const filter = ctx.createBiquadFilter();
                        filter.type = 'lowpass';
                        filter.frequency.setValueAtTime(400, now);
                        filter.frequency.exponentialRampToValueAtTime(2800, now + 0.35);
                        const gain = ctx.createGain();
                        gain.gain.setValueAtTime(0.3, now);
                        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
                        noise.connect(filter);
                        filter.connect(gain);
                        gain.connect(ctx.destination);
                        noise.start(now);
                        noise.stop(now + 0.4);

                        // Ascending rocket pitch
                        const osc = ctx.createOscillator();
                        const oscGain = ctx.createGain();
                        osc.type = 'sawtooth';
                        osc.frequency.setValueAtTime(180, now);
                        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.35);
                        oscGain.gain.setValueAtTime(0.2, now);
                        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
                        osc.connect(oscGain);
                        oscGain.connect(ctx.destination);
                        osc.start(now);
                        osc.stop(now + 0.4);
                    }
                } catch(err) {}

                // 2. Show rocket launch transition overlay
                let overlay = document.getElementById('rocket-launch-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.id = 'rocket-launch-overlay';
                    overlay.innerHTML = `
                        <div class="rocket-blast-icon">🚀 💨 ✨</div>
                        <h2 class="rocket-launch-title">Entering Game Mode!</h2>
                        <p class="rocket-launch-subtitle">BLASTING INTO AGENT COLE'S CUBE ARCADE...</p>
                    `;
                    document.body.appendChild(overlay);
                }

                overlay.classList.add('active');

                // 3. Navigate to games.html
                setTimeout(() => {
                    window.location.href = 'games.html';
                }, 220);
            });
        });
    }

    // Automatic Home button for any sub-page or upcoming little pages
    function ensureHomeButton() {
        try {
            const path = window.location.pathname.toLowerCase();
            const isMainHome = path.endsWith('/index.html') || path.endsWith('/cube4fun/') || path === '/' || path.endsWith('\\index.html');
            const isSecretHome = path.endsWith('/secret.html') || path.endsWith('\\secret.html') || path.includes('secret.html');
            // When on main home page, no home button is needed
            if (isMainHome) return;

            // Check if page already has a link to index.html
            const existingHome = document.querySelector('a[href*="index.html"], a[href="./"], a[href="/"], .btn-return-home, .floating-home-pill');
            if (!existingHome) {
                const nav = document.querySelector('.cs-site-nav, .nav-buttons, nav, .secret-nav');
                if (nav) {
                    const btn = document.createElement('a');
                    btn.href = 'index.html';
                    btn.className = 'btn-return-home';
                    btn.innerHTML = '🏠 Home Page';
                    btn.title = 'Return to Main Home Page';
                    nav.insertBefore(btn, nav.firstChild);
                } else {
                    const bar = document.createElement('div');
                    bar.className = 'universal-floating-home';
                    bar.innerHTML = '<a href="index.html" class="floating-home-pill" title="Return to Main Home Page">🏠 Home Page</a>';
                    document.body.appendChild(bar);
                }
            }
        } catch (err) {}
    }

    // Keyboard shortcut (Alt + T or Ctrl + Shift + D) to quickly toggle theme
    window.addEventListener('keydown', function(e) {
        if ((e.altKey && (e.key === 't' || e.key === 'T')) || 
            (e.ctrlKey && e.shiftKey && (e.key === 'd' || e.key === 'D'))) {
            e.preventDefault();
            window.toggleTheme();
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThemeUI);
    } else {
        initThemeUI();
    }
})();
