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

        // Check if floating theme toggle already exists; if not, create one
        if (!document.querySelector('.floating-theme-toggle')) {
            const floatBtn = document.createElement('button');
            floatBtn.className = 'floating-theme-toggle';
            floatBtn.setAttribute('aria-label', 'Toggle Dark/Light Mode');
            floatBtn.setAttribute('title', dark ? 'Switch to Light Mode ☀️' : 'Switch to Dark Mode 🌙');
            floatBtn.onclick = window.toggleTheme;
            floatBtn.innerHTML = `
                <span class="theme-toggle-icon">${dark ? '☀️' : '🌙'}</span>
                <span class="theme-toggle-text">${dark ? 'Light Mode' : 'Dark Mode'}</span>
            `;
            document.body.appendChild(floatBtn);
        }

        updateThemeButtons();
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
