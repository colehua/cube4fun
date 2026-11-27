// =========================================================================
// 🧊 LEARN CUBE 4 FUN - MODERN THEME SYSTEM & QUICK-JUMP NAVIGATION
// Synchronous <meta name="color-scheme"> + dark-mode sync (prevents FOUC),
// system-preference-aware two-state toggle, cross-tab storage sync,
// native <dialog> Quick-Jump palette (Ctrl+K / Cmd+K), and portal helpers.
// =========================================================================

(function() {
    'use strict';

    const STORAGE_KEY = 'cube_theme';
    const mediaQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    let sharedAudioCtx = null;

    function readStoredTheme() {
        try {
            const val = localStorage.getItem(STORAGE_KEY);
            return (val === 'dark' || val === 'light') ? val : null;
        } catch (e) {
            return null;
        }
    }

    function getSystemScheme() {
        return (mediaQuery && mediaQuery.matches) ? 'dark' : 'light';
    }

    function ensureColorSchemeMeta() {
        let meta = document.querySelector('meta[name="color-scheme"]');
        if (!meta && document.head) {
            meta = document.createElement('meta');
            meta.name = 'color-scheme';
            meta.content = 'light dark';
            document.head.appendChild(meta);
        }
        return meta;
    }

    function isDarkMode() {
        return document.documentElement.classList.contains('dark-mode') ||
               (document.body && document.body.classList.contains('dark-mode'));
    }

    function applyTheme(storedOverride) {
        const meta = ensureColorSchemeMeta();
        if (meta) {
            meta.content = storedOverride || 'light dark';
        }
        const effectiveDark = storedOverride ? (storedOverride === 'dark') : (getSystemScheme() === 'dark');
        document.documentElement.classList.toggle('dark-mode', effectiveDark);
        if (document.body) {
            document.body.classList.toggle('dark-mode', effectiveDark);
        }
        return effectiveDark;
    }

    // 1. Synchronously apply theme and <meta name="color-scheme"> before first paint
    applyTheme(readStoredTheme());

    // 2. Update all theme toggle button labels & icons
    function updateThemeButtons() {
        const dark = isDarkMode();
        const icon = dark ? '☀️' : '🌙';
        const text = dark ? 'Light Mode' : 'Dark Mode';
        const title = dark ? 'Switch to Light Mode' : 'Switch to Dark Mode';

        const buttons = document.querySelectorAll('#theme-toggle, .theme-toggle-btn, .floating-theme-toggle');
        buttons.forEach(btn => {
            btn.setAttribute('title', title);
            btn.setAttribute('aria-label', title);
            btn.setAttribute('type', 'button');
            const iconSpan = btn.querySelector('.theme-toggle-icon');
            const textSpan = btn.querySelector('.theme-toggle-text');
            if (iconSpan) {
                iconSpan.textContent = icon;
                iconSpan.setAttribute('aria-hidden', 'true');
            }
            if (textSpan) {
                textSpan.textContent = text;
            }
            if (!iconSpan && !textSpan) {
                const ic = document.createElement('span');
                ic.className = 'theme-toggle-icon';
                ic.setAttribute('aria-hidden', 'true');
                ic.textContent = icon;
                const tx = document.createElement('span');
                tx.className = 'theme-toggle-text';
                tx.textContent = text;
                btn.replaceChildren(ic, document.createTextNode(' '), tx);
            }
        });
    }

    // 3. Two-state toggle: revert to system default when target matches OS preference
    window.toggleTheme = function() {
        const target = isDarkMode() ? 'light' : 'dark';
        const systemScheme = getSystemScheme();
        let nextOverride = null;

        if (target === systemScheme) {
            try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
            nextOverride = null;
        } else {
            try { localStorage.setItem(STORAGE_KEY, target); } catch (e) {}
            nextOverride = target;
        }

        const effectiveDark = applyTheme(nextOverride);
        updateThemeButtons();

        try {
            window.dispatchEvent(new CustomEvent('themechange', {
                detail: {
                    theme: effectiveDark ? 'dark' : 'light',
                    mode: nextOverride || 'system'
                }
            }));
        } catch (e) {}
    };

    // 4. Follow OS color-scheme changes ONLY when no explicit override is stored
    if (mediaQuery) {
        const handleSystemChange = function() {
            const stored = readStoredTheme();
            if (stored === null) {
                const effectiveDark = applyTheme(null);
                updateThemeButtons();
                try {
                    window.dispatchEvent(new CustomEvent('themechange', {
                        detail: { theme: effectiveDark ? 'dark' : 'light', mode: 'system' }
                    }));
                } catch (e) {}
            }
        };
        if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', handleSystemChange);
        } else if (typeof mediaQuery.addListener === 'function') {
            mediaQuery.addListener(handleSystemChange);
        }
    }

    // 5. Cross-tab synchronization via storage event
    window.addEventListener('storage', function(e) {
        if (e.key === STORAGE_KEY || e.key === null) {
            const stored = readStoredTheme();
            const effectiveDark = applyTheme(stored);
            updateThemeButtons();
            try {
                window.dispatchEvent(new CustomEvent('themechange', {
                    detail: { theme: effectiveDark ? 'dark' : 'light', mode: stored || 'system' }
                }));
            } catch (err) {}
        }
    });

    // 6. Quick-Jump Navigation Palette (Native <dialog>, Ctrl+K / Cmd+K)
    const SITE_DESTINATIONS = [
        { icon: '🏠', title: 'Home & Battle Timer', desc: 'Main hub, 2-4 player duel timer, schedule & comments', href: 'index.html', keys: 'home battle duel schedule comments' },
        { icon: '⏱️', title: 'Speedcubing Timer', desc: 'WCA scrambler, Ao5/Ao12 stats & Cole records', href: 'timer.html', keys: 'timer wca scramble ao5 ao12 clock' },
        { icon: '⚡', title: 'Practice Speed Mode', desc: 'Adaptive target goals & speed improvement drills', href: 'practice-speed.html', keys: 'practice speed goal drill adaptive' },
        { icon: '🤖', title: 'Cube Solving Machine', desc: '2x2-6x6, Pyraminx & Skewb solver with camera scanner', href: 'cube-solving-machine.html', keys: 'solver machine kociemba camera scanner 2x2 3x3 4x4 5x5 6x6' },
        { icon: '🎮', title: '3D Virtual Cube', desc: 'Interactive 3D cube playground (2x2 to 5x5)', href: 'play.html', keys: 'play 3d virtual cube simulator' },
        { icon: '🧊', title: '3x3 Step-by-Step Tutorial', desc: 'Beginner Layer-by-Layer guide with slow-mo videos', href: 'tutorial-3x3.html', keys: '3x3 tutorial beginner lbl daisy cross' },
        { icon: '🧊', title: '2x2 Step-by-Step Tutorial', desc: 'Easy 2x2 cube tutorial with videos', href: 'tutorial-2x2.html', keys: '2x2 tutorial beginner pocket cube' },
        { icon: '🧩', title: 'Algorithms Guide', desc: 'CFOP, OLL, PLL, F2L, Roux & Ortega algorithms', href: 'algorithms.html', keys: 'algorithms cfop oll pll f2l roux ortega' },
        { icon: '🧠', title: 'Case Recognition Trainer', desc: 'Timed OLL/PLL/F2L recognition drills', href: 'trainer.html', keys: 'trainer recognition oll pll flashcards' },
        { icon: '🏆', title: 'Challenges of Cubing', desc: 'Infinite challenges, crazy patterns & achievements', href: 'challenges.html', keys: 'challenges patterns infinite achievements' },
        { icon: '🍁', title: 'BC Rankings Tracker', desc: 'Cole Hua British Columbia official provincial rankings', href: 'bc-rankings.html', keys: 'bc rankings canada wca 2026huac01 cole hua' },
        { icon: '📖', title: 'Finger Tricks & How It Works', desc: 'Cube mechanics & speedcubing finger tricks', href: 'guide.html', keys: 'guide finger tricks mechanics core' },
        { icon: '🔤', title: 'Notation Guide', desc: 'Learn R, U, F, L, D, B, wide moves & slice notation', href: 'notation.html', keys: 'notation moves letters prime' },
        { icon: '📰', title: 'Cubing News & Updates', desc: 'Latest speedcubing updates & cube price tracker', href: 'news.html', keys: 'news updates cube prices' },
        { icon: '✍️', title: "Cole's Blog", desc: 'Stories, competition recaps & cubing thoughts', href: 'blog.html', keys: 'blog posts articles cole' },
        { icon: '🚀', title: "Agent Cole's Cube Arcade", desc: '12 mini-games, coin economy & upgrade shop', href: 'games.html', keys: 'games arcade switch runner flappy 2048 shop' }
    ];

    function buildQuickJumpDialog() {
        let dlg = document.getElementById('c4f-quick-nav');
        if (dlg) return dlg;

        dlg = document.createElement('dialog');
        dlg.id = 'c4f-quick-nav';
        dlg.className = 'c4f-quick-nav';
        dlg.setAttribute('closedby', 'any');
        dlg.setAttribute('aria-labelledby', 'c4f-qn-title');

        const header = document.createElement('div');
        header.className = 'c4f-qn-header';

        const title = document.createElement('h1');
        title.id = 'c4f-qn-title';
        title.className = 'c4f-qn-title';
        title.textContent = '🧭 Quick Jump';

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'c4f-qn-close';
        closeBtn.setAttribute('commandfor', 'c4f-quick-nav');
        closeBtn.setAttribute('command', 'close');
        closeBtn.setAttribute('aria-label', 'Close Quick Jump');
        closeBtn.textContent = '✕';
        if (!('commandForElement' in HTMLButtonElement.prototype)) {
            closeBtn.addEventListener('click', () => {
                dlg.close();
            });
        }

        header.append(title, closeBtn);

        const searchWrap = document.createElement('div');
        searchWrap.className = 'c4f-qn-search-wrap';

        const label = document.createElement('label');
        label.htmlFor = 'c4f-qn-input';
        label.className = 'visually-hidden';
        label.textContent = 'Search Cube4Fun pages';

        const input = document.createElement('input');
        input.id = 'c4f-qn-input';
        input.name = 'quick_jump_search';
        input.type = 'search';
        input.className = 'c4f-qn-input';
        input.placeholder = 'Search pages, tutorials, timer, solver, arcade...';
        input.autocomplete = 'off';
        input.autofocus = true;

        searchWrap.append(label, input);

        const list = document.createElement('ul');
        list.id = 'c4f-qn-list';
        list.className = 'c4f-qn-list';

        const hint = document.createElement('p');
        hint.className = 'c4f-qn-hint';
        hint.textContent = 'Tip: Press Ctrl+K (or ⌘K) anywhere • Alt+T toggles Dark/Light Mode • Esc closes';

        dlg.append(header, searchWrap, list, hint);

        let activeIndex = 0;
        let currentItems = SITE_DESTINATIONS;

        function renderList(query) {
            const q = (query || '').trim().toLowerCase();
            currentItems = q
                ? SITE_DESTINATIONS.filter(item =>
                    (item.title + ' ' + item.desc + ' ' + item.keys).toLowerCase().includes(q)
                  )
                : SITE_DESTINATIONS;
            activeIndex = 0;

            if (currentItems.length === 0) {
                const empty = document.createElement('li');
                empty.className = 'c4f-qn-empty';
                empty.textContent = 'No matching Cube4Fun pages found.';
                list.replaceChildren(empty);
                return;
            }

            const frag = document.createDocumentFragment();
            const currentFile = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

            currentItems.forEach((item, idx) => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = item.href;
                a.className = 'c4f-qn-item' + (idx === 0 ? ' is-selected' : '');
                if (item.href.toLowerCase() === currentFile) {
                    a.setAttribute('aria-current', 'page');
                }

                const ico = document.createElement('span');
                ico.className = 'c4f-qn-ico';
                ico.setAttribute('aria-hidden', 'true');
                ico.textContent = item.icon;

                const body = document.createElement('span');
                body.className = 'c4f-qn-body';

                const ttl = document.createElement('span');
                ttl.className = 'c4f-qn-name';
                ttl.textContent = item.title;

                const dsc = document.createElement('span');
                dsc.className = 'c4f-qn-desc';
                dsc.textContent = item.desc;

                body.append(ttl, dsc);
                a.append(ico, body);
                li.appendChild(a);
                frag.appendChild(li);
            });
            list.replaceChildren(frag);
        }

        function updateSelection() {
            const links = list.querySelectorAll('.c4f-qn-item');
            links.forEach((el, idx) => {
                el.classList.toggle('is-selected', idx === activeIndex);
                if (idx === activeIndex) {
                    el.scrollIntoView({ block: 'nearest' });
                }
            });
        }

        input.addEventListener('input', () => renderList(input.value));
        input.addEventListener('keydown', (e) => {
            const links = list.querySelectorAll('.c4f-qn-item');
            if (!links.length) return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                activeIndex = (activeIndex + 1) % links.length;
                updateSelection();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                activeIndex = (activeIndex - 1 + links.length) % links.length;
                updateSelection();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const target = links[activeIndex];
                if (target) {
                    dlg.close();
                    window.location.href = target.getAttribute('href');
                }
            }
        });

        // Progressive-enhancement light dismiss fallback when <dialog closedby="any"> is unsupported
        if (!('closedBy' in HTMLDialogElement.prototype)) {
            const isOutside = (e) => {
                const r = dlg.getBoundingClientRect();
                return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
            };
            let pressedOutside = false;
            dlg.addEventListener('pointerdown', (e) => { pressedOutside = isOutside(e); });
            dlg.addEventListener('pointerup', (e) => {
                if (pressedOutside && isOutside(e)) dlg.close();
            });
        }

        renderList('');
        document.body.appendChild(dlg);
        return dlg;
    }

    window.openQuickJump = function() {
        const dlg = buildQuickJumpDialog();
        const input = dlg.querySelector('#c4f-qn-input');
        if (input) {
            input.value = '';
            input.dispatchEvent(new Event('input'));
        }
        if (typeof dlg.showModal === 'function') {
            if (!dlg.open) dlg.showModal();
        } else {
            dlg.setAttribute('open', '');
        }
        if (input) input.focus();
    };

    function attachQuickJumpFooterTrigger() {
        const footerBottom = document.querySelector('.footer-bottom');
        if (!footerBottom || document.getElementById('c4f-qn-footer-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'c4f-qn-footer-btn';
        btn.type = 'button';
        btn.className = 'c4f-qn-trigger';
        btn.textContent = '🧭 Quick Jump (Ctrl+K)';
        btn.title = 'Open Quick Jump site navigation (Ctrl+K or Cmd+K)';
        btn.addEventListener('click', window.openQuickJump);
        footerBottom.appendChild(btn);
    }

    // 7. Universal Secret Rocket Button & Game Mode Launch Portal
    function playRocketSound() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            if (!sharedAudioCtx) sharedAudioCtx = new AudioCtx();
            if (sharedAudioCtx.state === 'suspended') {
                sharedAudioCtx.resume().catch(() => {});
            }
            const ctx = sharedAudioCtx;
            const now = ctx.currentTime;
            const sampleRate = ctx.sampleRate;
            const buffer = ctx.createBuffer(1, Math.floor(sampleRate * 0.4), sampleRate);
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
        } catch (err) {}
    }

    function initSecretRocketPortal() {
        document.querySelectorAll('.secret-rocket-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const path = window.location.pathname.toLowerCase();
                if (path.endsWith('/games.html') || path.endsWith('\\games.html') || path.includes('games.html')) {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();

                playRocketSound();

                const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                if (prefersReduced) {
                    window.location.href = 'games.html';
                    return;
                }

                let overlay = document.getElementById('rocket-launch-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.id = 'rocket-launch-overlay';

                    const iconDiv = document.createElement('div');
                    iconDiv.className = 'rocket-blast-icon';
                    iconDiv.setAttribute('aria-hidden', 'true');
                    iconDiv.textContent = '🚀 💨 ✨';

                    const h2 = document.createElement('h2');
                    h2.className = 'rocket-launch-title';
                    h2.textContent = 'Entering Game Mode!';

                    const p = document.createElement('p');
                    p.className = 'rocket-launch-subtitle';
                    p.textContent = "BLASTING INTO AGENT COLE'S CUBE ARCADE...";

                    overlay.append(iconDiv, h2, p);
                    document.body.appendChild(overlay);
                }

                overlay.classList.add('active');
                setTimeout(() => {
                    window.location.href = 'games.html';
                }, 220);
            });
        });
    }

    // 8. Automatic Home button for any sub-page or upcoming little pages
    function ensureHomeButton() {
        try {
            const path = window.location.pathname.toLowerCase();
            const isMainHome = path.endsWith('/index.html') || path.endsWith('/cube4fun/') || path === '/' || path.endsWith('\\index.html');
            if (isMainHome) return;

            const existingHome = document.querySelector('a[href*="index.html"], a[href="./"], a[href="/"], .btn-return-home, .floating-home-pill');
            if (!existingHome) {
                const nav = document.querySelector('.cs-site-nav, .nav-buttons, nav, .secret-nav');
                if (nav) {
                    const btn = document.createElement('a');
                    btn.href = 'index.html';
                    btn.className = 'btn-return-home';
                    btn.textContent = '🏠 Home Page';
                    btn.title = 'Return to Main Home Page';
                    nav.insertBefore(btn, nav.firstChild);
                } else {
                    const bar = document.createElement('div');
                    bar.className = 'universal-floating-home';
                    const link = document.createElement('a');
                    link.href = 'index.html';
                    link.className = 'floating-home-pill';
                    link.title = 'Return to Main Home Page';
                    link.textContent = '🏠 Home Page';
                    bar.appendChild(link);
                    document.body.appendChild(bar);
                }
            }
        } catch (err) {}
    }

    // 9. Initialize UI on DOM ready
    function initThemeUI() {
        applyTheme(readStoredTheme());

        let existingBtn = document.querySelector('#theme-toggle, .theme-toggle-btn');
        if (!existingBtn) {
            const navContainer = document.querySelector('.cs-site-nav, .nav-buttons, .nav-group-right, nav');
            if (navContainer) {
                const dark = isDarkMode();
                const toggleBtn = document.createElement('button');
                toggleBtn.id = 'theme-toggle';
                toggleBtn.type = 'button';
                toggleBtn.className = 'nav-button theme-toggle-btn';
                toggleBtn.setAttribute('aria-label', dark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
                toggleBtn.setAttribute('title', dark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
                toggleBtn.addEventListener('click', window.toggleTheme);
                toggleBtn.style.cursor = 'pointer';
                navContainer.appendChild(toggleBtn);
            }
        }

        document.querySelectorAll('.floating-theme-toggle').forEach(el => el.remove());

        updateThemeButtons();
        ensureHomeButton();
        initSecretRocketPortal();
        attachQuickJumpFooterTrigger();
    }

    // 10. Global keyboard shortcuts: Alt+T / Ctrl+Shift+D (Theme), Ctrl+K / Cmd+K (Quick Jump)
    window.addEventListener('keydown', function(e) {
        if ((e.altKey && (e.key === 't' || e.key === 'T')) ||
            (e.ctrlKey && e.shiftKey && (e.key === 'd' || e.key === 'D'))) {
            e.preventDefault();
            window.toggleTheme();
        } else if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey && (e.key === 'k' || e.key === 'K')) {
            e.preventDefault();
            window.openQuickJump();
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThemeUI);
    } else {
        initThemeUI();
    }
})();
