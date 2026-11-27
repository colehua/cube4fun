(function (global) {
    'use strict';

    const ACCOUNTS_STORE_KEY = 'cube_arcade_accounts_v1';
    const ACTIVE_ACCOUNT_KEY = 'cube_arcade_active_account_v1';
    const GUEST_BACKUP_KEY = 'cube_arcade_guest_backup_v1';

    const AVATARS = ['😎', '🦊', '🚀', '👑', '🤖', '🐉', '🦄', '⚡'];

    const DEFAULT_UPGRADES_JSON = JSON.stringify({
        dash: 0,
        magnet: 0,
        blaster: 0,
        shield: 0,
        multiplier: 0,
        doubleJump: 0,
        cubeSkin: 'default',
        switchSkin: 'neon',
        unlockedCubeSkins: ['default'],
        unlockedSwitchSkins: ['neon']
    });

    // Every per-player progress key shared across Switch Arcade (games.html) & Secret Rocket Vault (rocket-vault.html)
    const PROFILE_DEFAULTS = {
        cube_arcade_coins: '100',
        cube_arcade_xp: '0',
        cube_arcade_upgrades: DEFAULT_UPGRADES_JSON,
        cube_runner_best: '0',
        cube_snake_best: '3',
        cube_breaker_best: '0',
        cube_space_best: '0',
        cube_2048_best: '0',
        cube_simon_best: '0',
        cube_reflex_best: '0.00',
        cube_blitz_best: '0',
        cube_stacker_best: '0',
        cube_whack_best: '0',
        cube_flappy_best: '0',
        cube_pairs_best: '--',
        cube_rocket_vault_best: '0',
        cube_vault_finder_claimed: null,
        cube_vault_daily_date: null,
        cube_vault_cole_claimed: null
    };

    const PROFILE_KEYS = Object.keys(PROFILE_DEFAULTS);
    const changeListeners = [];

    function readAccountsMap() {
        try {
            const raw = localStorage.getItem(ACCOUNTS_STORE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                    return parsed;
                }
            }
        } catch (e) {}
        return {};
    }

    function writeAccountsMap(map) {
        try {
            localStorage.setItem(ACCOUNTS_STORE_KEY, JSON.stringify(map));
        } catch (e) {}
    }

    function normalizeDisplayName(rawName) {
        return String(rawName || '').trim().replace(/\s+/g, ' ');
    }

    function toAccountKey(rawName) {
        return normalizeDisplayName(rawName).toLowerCase();
    }

    function createFreshProfileData() {
        const copy = {};
        for (let i = 0; i < PROFILE_KEYS.length; i++) {
            const k = PROFILE_KEYS[i];
            copy[k] = PROFILE_DEFAULTS[k];
        }
        return copy;
    }

    function snapshotCurrentStorage() {
        const snap = {};
        for (let i = 0; i < PROFILE_KEYS.length; i++) {
            const k = PROFILE_KEYS[i];
            const val = localStorage.getItem(k);
            snap[k] = val !== null ? val : PROFILE_DEFAULTS[k];
        }
        return snap;
    }

    function applySnapshotToStorage(data) {
        const src = data || {};
        for (let i = 0; i < PROFILE_KEYS.length; i++) {
            const k = PROFILE_KEYS[i];
            const val = Object.prototype.hasOwnProperty.call(src, k) ? src[k] : PROFILE_DEFAULTS[k];
            if (val === null || val === undefined) {
                localStorage.removeItem(k);
            } else {
                localStorage.setItem(k, String(val));
            }
        }
    }

    function getActiveAccountKey() {
        const key = localStorage.getItem(ACTIVE_ACCOUNT_KEY) || '';
        if (!key) return '';
        const map = readAccountsMap();
        if (!map[key]) {
            localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
            return '';
        }
        return key;
    }

    function getActiveAccount() {
        const key = getActiveAccountKey();
        if (!key) return null;
        const map = readAccountsMap();
        return map[key] || null;
    }

    function saveActiveProgress() {
        const snap = snapshotCurrentStorage();
        const activeKey = getActiveAccountKey();
        if (activeKey) {
            const map = readAccountsMap();
            if (map[activeKey]) {
                map[activeKey].data = snap;
                map[activeKey].lastPlayedAt = Date.now();
                writeAccountsMap(map);
                return;
            }
        }
        try {
            localStorage.setItem(GUEST_BACKUP_KEY, JSON.stringify(snap));
        } catch (e) {}
    }

    function notifyChange(account, reason) {
        for (let i = 0; i < changeListeners.length; i++) {
            try {
                changeListeners[i](account, reason);
            } catch (e) {}
        }
    }

    function createAccount(rawName, avatar, options) {
        const opts = options || {};
        const cleanName = normalizeDisplayName(rawName);
        if (!cleanName) {
            return { ok: false, error: 'Please type a name for your new account!' };
        }
        if (cleanName.length > 20) {
            return { ok: false, error: 'Account name must be 20 characters or fewer.' };
        }
        const key = cleanName.toLowerCase();
        if (key === 'guest') {
            return { ok: false, error: '"Guest" is reserved. Pick your own player name!' };
        }

        const map = readAccountsMap();
        if (map[key]) {
            return {
                ok: false,
                duplicate: true,
                error: `Account "${map[key].name}" already exists! Use Sign In to play on it.`
            };
        }

        const wasGuest = !getActiveAccountKey();
        // Always persist outgoing player's latest progress first!
        saveActiveProgress();

        const chosenAvatar = AVATARS.includes(avatar) ? avatar : AVATARS[0];
        const initialData = (wasGuest && opts.importGuest)
            ? snapshotCurrentStorage()
            : createFreshProfileData();

        const now = Date.now();
        const account = {
            id: key,
            name: cleanName,
            avatar: chosenAvatar,
            createdAt: now,
            lastPlayedAt: now,
            data: initialData
        };

        // Re-read map after saveActiveProgress in case outgoing account updated it
        const updatedMap = readAccountsMap();
        updatedMap[key] = account;
        writeAccountsMap(updatedMap);

        localStorage.setItem(ACTIVE_ACCOUNT_KEY, key);
        applySnapshotToStorage(initialData);
        notifyChange(account, 'create');

        return { ok: true, account: account };
    }

    function signInByName(rawName) {
        const cleanName = normalizeDisplayName(rawName);
        if (!cleanName) {
            return { ok: false, error: 'Please type your account name to sign in!' };
        }
        const key = cleanName.toLowerCase();
        if (key === 'guest') {
            return signOutToGuest();
        }

        const map = readAccountsMap();
        if (!map[key]) {
            return {
                ok: false,
                notFound: true,
                typedName: cleanName,
                error: `No account named "${cleanName}" found on this device. Click "Make Account" to create it!`
            };
        }

        const currentKey = getActiveAccountKey();
        if (currentKey === key) {
            saveActiveProgress();
            return { ok: true, account: map[key], alreadyActive: true };
        }

        // Persist outgoing player's latest progress before switching!
        saveActiveProgress();

        const freshMap = readAccountsMap();
        const target = freshMap[key];
        target.lastPlayedAt = Date.now();
        writeAccountsMap(freshMap);

        localStorage.setItem(ACTIVE_ACCOUNT_KEY, key);
        applySnapshotToStorage(target.data);
        notifyChange(target, 'signin');

        return { ok: true, account: target };
    }

    function signOutToGuest() {
        const currentKey = getActiveAccountKey();
        if (!currentKey) {
            return { ok: true, account: null, alreadyActive: true };
        }

        saveActiveProgress();
        localStorage.removeItem(ACTIVE_ACCOUNT_KEY);

        let guestData = null;
        try {
            const raw = localStorage.getItem(GUEST_BACKUP_KEY);
            if (raw) guestData = JSON.parse(raw);
        } catch (e) {}

        applySnapshotToStorage(guestData || createFreshProfileData());
        notifyChange(null, 'signout');
        return { ok: true, account: null };
    }

    function deleteAccount(rawName) {
        const key = toAccountKey(rawName);
        if (!key) return { ok: false, error: 'Invalid account.' };
        const map = readAccountsMap();
        if (!map[key]) return { ok: false, error: 'Account not found.' };

        const removedName = map[key].name;
        const wasActive = getActiveAccountKey() === key;
        delete map[key];
        writeAccountsMap(map);

        if (wasActive) {
            localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
            let guestData = null;
            try {
                const raw = localStorage.getItem(GUEST_BACKUP_KEY);
                if (raw) guestData = JSON.parse(raw);
            } catch (e) {}
            applySnapshotToStorage(guestData || createFreshProfileData());
            notifyChange(null, 'delete');
        }
        return { ok: true, removedName: removedName, wasActive: wasActive };
    }

    function listAccounts() {
        const activeKey = getActiveAccountKey();
        const liveSnap = snapshotCurrentStorage();
        const map = readAccountsMap();
        return Object.keys(map)
            .map(function (k) {
                const acc = map[k];
                const d = (k === activeKey) ? liveSnap : (acc.data || {});
                return {
                    id: acc.id || k,
                    name: acc.name || k,
                    avatar: acc.avatar || '😎',
                    isActive: k === activeKey,
                    lastPlayedAt: acc.lastPlayedAt || acc.createdAt || 0,
                    coins: parseInt(d.cube_arcade_coins || '100', 10) || 0,
                    xp: parseInt(d.cube_arcade_xp || '0', 10) || 0,
                    runnerBest: parseInt(d.cube_runner_best || '0', 10) || 0,
                    vaultBest: parseInt(d.cube_rocket_vault_best || '0', 10) || 0
                };
            })
            .sort(function (a, b) {
                if (a.isActive && !b.isActive) return -1;
                if (!a.isActive && b.isActive) return 1;
                return b.lastPlayedAt - a.lastPlayedAt;
            });
    }

    function onChange(cb) {
        if (typeof cb === 'function') {
            changeListeners.push(cb);
        }
    }

    // Sync active account snapshot automatically on page load & tab switches/exits
    saveActiveProgress();
    if (typeof window !== 'undefined' && window.addEventListener) {
        window.addEventListener('pagehide', saveActiveProgress);
        window.addEventListener('beforeunload', saveActiveProgress);
    }
    if (typeof document !== 'undefined' && document.addEventListener) {
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) saveActiveProgress();
        });
    }

    global.CubeAccounts = {
        AVATARS: AVATARS,
        PROFILE_KEYS: PROFILE_KEYS,
        PROFILE_DEFAULTS: PROFILE_DEFAULTS,
        getActiveAccount: getActiveAccount,
        getActiveAccountKey: getActiveAccountKey,
        saveActiveProgress: saveActiveProgress,
        createAccount: createAccount,
        signInByName: signInByName,
        signOutToGuest: signOutToGuest,
        deleteAccount: deleteAccount,
        listAccounts: listAccounts,
        onChange: onChange
    };
})(typeof window !== 'undefined' ? window : globalThis);
