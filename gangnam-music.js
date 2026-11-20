/**
 * Gangnam Style Intense Music Engine for Speedcubing
 * Authentic 132 BPM EDM Synthesizer + Headphone/Earphone Output Connector
 */

class GangnamMusicEngine {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.timerId = null;
        this.currentStep = 0;
        this.bpm = 132;
        this.volume = parseFloat(localStorage.getItem('cube_intense_music_vol')) || 0.65;
        this.masterGain = null;
        this.compressor = null;
        this.selectedSinkId = localStorage.getItem('cube_intense_music_sink') || '';
        this.deviceLabel = 'Headphones / Auto';
        this.nextNoteTime = 0;
        this.scheduleAheadTime = 0.12; // seconds
        this.lookaheadMs = 25; // ms
        this.noiseBuffer = null;

        // Note frequencies (Hz)
        this.N = {
            B1: 61.74, Cs2: 69.30, D2: 73.42, E2: 82.41, Fs2: 92.50, Gs2: 103.83, A2: 110.00,
            B2: 123.47, Cs3: 138.59, D3: 146.83, E3: 164.81, Fs3: 185.00, Gs3: 207.65, A3: 220.00,
            B3: 246.94, Cs4: 277.18, D4: 293.66, E4: 329.63, Fs4: 369.99, Gs4: 415.30, A4: 440.00,
            B4: 493.88, Cs5: 554.37, D5: 587.33, E5: 659.25, Fs5: 739.99, Gs5: 830.61, A5: 880.00,
            B5: 987.77
        };

        this.buildScore();
    }

    buildScore() {
        const N = this.N;
        // 128 steps (8 bars of 16th notes @ 132 BPM = ~14.5 seconds per loop)
        this.leadScore = [
            // Bar 1 - Iconic Intro Synth
            N.B4, N.B4, N.B4, N.B4,  N.B4, N.B4, N.B4, N.B4,  N.B4, N.B4, N.A4, N.A4,  N.Fs4, N.Fs4, N.E4, N.E4,
            // Bar 2
            N.Fs4, N.Fs4, N.Fs4, N.Fs4,  N.Fs4, N.Fs4, N.Fs4, N.Fs4,  N.E4, N.E4, N.D4, N.D4,  N.B3, N.B3, N.D4, N.D4,
            // Bar 3
            N.B4, N.B4, N.B4, N.B4,  N.B4, N.B4, N.B4, N.B4,  N.B4, N.B4, N.A4, N.A4,  N.Fs4, N.Fs4, N.E4, N.E4,
            // Bar 4 - Rising transition
            N.Fs4, N.Fs4, N.Fs4, N.Fs4,  N.A4, N.A4, N.A4, N.A4,  N.B4, N.B4, N.B4, N.B4,  N.D5, N.D5, N.Cs5, N.Cs5,

            // Bar 5 - "Oppa Gangnam Style!" Hook
            N.B3, 0, N.B3, 0,  0, N.B3, 0, 0,  N.D4, 0, N.B3, 0,  N.E4, 0, N.D4, N.B3,
            // Bar 6
            N.B3, 0, N.B3, 0,  0, N.B3, 0, 0,  N.D4, 0, N.B3, 0,  N.Fs4, 0, N.E4, N.D4,
            // Bar 7
            N.B3, 0, N.B3, 0,  0, N.B3, 0, 0,  N.D4, 0, N.B3, 0,  N.E4, 0, N.D4, N.B3,
            // Bar 8 - "Eh- Sexy Lady! ... Oppa Gangnam Style!"
            N.Fs4, N.Gs4, N.A4, N.B4,  N.Cs5, N.D5, N.E5, N.Fs5,  N.B4, 0, N.B4, 0,  N.B4, N.A4, N.Fs4, N.E4
        ];

        this.bassScore = [
            // Bars 1-3: driving B1 16th groove
            N.B1, 0, N.B1, 0,  N.B1, 0, N.B1, 0,  N.B1, 0, N.A1 || N.A2/2, 0,  N.Fs1 || N.Fs2/2, 0, N.E1 || N.E2/2, 0,
            N.Fs1 || N.Fs2/2, 0, N.Fs1 || N.Fs2/2, 0,  N.Fs1 || N.Fs2/2, 0, N.Fs1 || N.Fs2/2, 0,  N.E1 || N.E2/2, 0, N.D2, 0,  N.B1, 0, N.D2, 0,
            N.B1, 0, N.B1, 0,  N.B1, 0, N.B1, 0,  N.B1, 0, N.A1 || N.A2/2, 0,  N.Fs1 || N.Fs2/2, 0, N.E1 || N.E2/2, 0,
            // Bar 4: Walk up
            N.Fs1 || N.Fs2/2, 0, N.Fs1 || N.Fs2/2, 0,  N.A1 || N.A2/2, 0, N.A1 || N.A2/2, 0,  N.B1, 0, N.B1, 0,  N.D2, 0, N.Cs2, 0,

            // Bars 5-7: Bouncy Gangnam bass
            N.B1, N.B1, 0, N.B1,  0, N.B1, 0, 0,  N.D2, 0, N.B1, 0,  N.E2, 0, N.D2, N.B1,
            N.B1, N.B1, 0, N.B1,  0, N.B1, 0, 0,  N.D2, 0, N.B1, 0,  N.Fs2, 0, N.E2, N.D2,
            N.B1, N.B1, 0, N.B1,  0, N.B1, 0, 0,  N.D2, 0, N.B1, 0,  N.E2, 0, N.D2, N.B1,
            // Bar 8: Run
            N.Fs2, N.Gs2, N.A2, N.B2,  N.Cs3, N.D3, N.E3, N.Fs3,  N.B1, 0, N.B1, 0,  N.B1, N.A1 || N.A2/2, N.Fs1 || N.Fs2/2, N.E1 || N.E2/2
        ];
    }

    initContext() {
        if (this.ctx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        // 1. Dynamic compressor for massive EDM master sound
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
        this.compressor.knee.setValueAtTime(10, this.ctx.currentTime);
        this.compressor.ratio.setValueAtTime(8, this.ctx.currentTime);
        this.compressor.attack.setValueAtTime(0.005, this.ctx.currentTime);
        this.compressor.release.setValueAtTime(0.1, this.ctx.currentTime);

        // 2. Master gain control
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

        this.masterGain.connect(this.compressor);
        this.compressor.connect(this.ctx.destination);

        // 3. Connect to selected output device (headphones/earphones) if available
        if (this.selectedSinkId && typeof this.ctx.setSinkId === 'function') {
            this.ctx.setSinkId(this.selectedSinkId).catch(() => {});
        }

        // 4. Create reusable 1-second white noise buffer for snare and hi-hats
        const sampleRate = this.ctx.sampleRate;
        const buf = this.ctx.createBuffer(1, sampleRate, sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < sampleRate; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        this.noiseBuffer = buf;
    }

    async setOutputDevice(sinkId, label = '') {
        this.selectedSinkId = sinkId;
        if (label) this.deviceLabel = label;
        localStorage.setItem('cube_intense_music_sink', sinkId);
        if (this.ctx && typeof this.ctx.setSinkId === 'function') {
            try {
                await this.ctx.setSinkId(sinkId);
                return true;
            } catch (err) {
                console.warn('Failed to setSinkId:', err);
                return false;
            }
        }
        return false;
    }

    playKick(time) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(32, time + 0.16);
        gain.gain.setValueAtTime(0.75, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.16);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(time);
        osc.stop(time + 0.17);
    }

    playSnare(time) {
        if (!this.noiseBuffer) return;
        // White noise layer
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1000, time);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.35, time);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.masterGain);

        // Body tone layer
        const tone = this.ctx.createOscillator();
        tone.type = 'triangle';
        tone.frequency.setValueAtTime(180, time);
        tone.frequency.exponentialRampToValueAtTime(80, time + 0.1);
        const toneGain = this.ctx.createGain();
        toneGain.gain.setValueAtTime(0.25, time);
        toneGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

        tone.connect(toneGain);
        toneGain.connect(this.masterGain);

        noise.start(time);
        noise.stop(time + 0.15);
        tone.start(time);
        tone.stop(time + 0.12);
    }

    playHiHat(time, isOpen) {
        if (!this.noiseBuffer) return;
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(8500, time);
        filter.Q.setValueAtTime(2.5, time);

        const dur = isOpen ? 0.18 : 0.045;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(isOpen ? 0.22 : 0.14, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start(time);
        noise.stop(time + dur + 0.01);
    }

    playBass(time, freq, dur) {
        if (!freq) return;
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, time);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(750, time);
        filter.frequency.exponentialRampToValueAtTime(200, time + dur);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.38, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur * 0.95);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(time);
        osc.stop(time + dur);
    }

    playLead(time, freq, dur) {
        if (!freq) return;
        // Stereo detuned dual saw oscillators for fat club sound
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc2.type = 'sawtooth';

        osc1.frequency.setValueAtTime(freq, time);
        osc2.frequency.setValueAtTime(freq * 1.006, time); // +10 cents detune

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3200, time);
        filter.Q.setValueAtTime(3, time);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.24, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur * 0.92);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc1.start(time);
        osc2.start(time);
        osc1.stop(time + dur);
        osc2.stop(time + dur);
    }

    scheduleStep(step, time) {
        const step16 = (60 / this.bpm) / 4;
        const beatInBar = (step % 16);

        // 1. Kick on every quarter beat (0, 4, 8, 12)
        if (beatInBar % 4 === 0) {
            this.playKick(time);
        }

        // 2. Snare on beats 2 and 4 (4, 12)
        if (beatInBar === 4 || beatInBar === 12) {
            this.playSnare(time);
        }

        // 3. Hi-Hats: 16th note rhythm, open hat on off-beat '&' (2, 6, 10, 14)
        const isOpenHat = (beatInBar % 4 === 2);
        this.playHiHat(time, isOpenHat);

        // 4. Bass track
        const bassFreq = this.bassScore[step % this.bassScore.length];
        if (bassFreq) {
            this.playBass(time, bassFreq, step16 * 0.95);
        }

        // 5. Lead synth track (Gangnam Style hook)
        const leadFreq = this.leadScore[step % this.leadScore.length];
        if (leadFreq) {
            this.playLead(time, leadFreq, step16 * 0.92);
        }
    }

    start() {
        this.initContext();
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        if (this.isPlaying) return;

        this.isPlaying = true;
        this.currentStep = 0;
        this.nextNoteTime = this.ctx.currentTime + 0.05;

        const s16 = (60 / this.bpm) / 4;

        this.timerId = setInterval(() => {
            if (!this.isPlaying) return;
            while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
                this.scheduleStep(this.currentStep, this.nextNoteTime);
                this.nextNoteTime += s16;
                this.currentStep = (this.currentStep + 1) % this.leadScore.length;
            }
        }, this.lookaheadMs);

        this.updateUI();
    }

    stop() {
        this.isPlaying = false;
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
        this.updateUI();
    }

    toggle() {
        if (this.isPlaying) {
            this.stop();
        } else {
            this.start();
        }
    }

    setVolume(val) {
        const clamped = Math.max(0.05, Math.min(1.0, val));
        this.volume = clamped;
        localStorage.setItem('cube_intense_music_vol', clamped.toString());
        if (this.ctx && this.masterGain) {
            try {
                this.masterGain.gain.setValueAtTime(clamped, this.ctx.currentTime);
            } catch (err) {
                this.masterGain.gain.value = clamped;
            }
        }
        this.updateVolumeUI();
    }

    cycleVolume() {
        if (this.volume >= 0.8) {
            this.setVolume(0.35);
            this.notify('🔈 Music Volume: Low (35%)');
        } else if (this.volume >= 0.5) {
            this.setVolume(0.95);
            this.notify('🔊 Music Volume: High (100%)');
        } else {
            this.setVolume(0.65);
            this.notify('🔉 Music Volume: Medium (65%)');
        }
    }

    updateVolumeUI() {
        const btns = document.querySelectorAll('.btn-music-volume');
        btns.forEach(btn => {
            if (this.volume >= 0.8) {
                btn.innerHTML = '🔊 Vol: 100%';
                btn.title = 'Music Volume: High (100%). Click to cycle to Low (35%).';
            } else if (this.volume >= 0.5) {
                btn.innerHTML = '🔉 Vol: 65%';
                btn.title = 'Music Volume: Medium (65%). Click to cycle to High (100%).';
            } else {
                btn.innerHTML = '🔈 Vol: 35%';
                btn.title = 'Music Volume: Low (35%). Click to cycle to Medium (65%).';
            }
        });
    }

    updateUI() {
        const btns = document.querySelectorAll('.btn-intense-music');
        btns.forEach(btn => {
            if (this.isPlaying) {
                btn.classList.add('btn-intense-music-active');
                btn.innerHTML = '🔥 Intense Music: PLAYING 🎶 (Click to Stop)';
                btn.title = 'Gangnam Style is playing! Click to stop music';
            } else {
                btn.classList.remove('btn-intense-music-active');
                btn.innerHTML = '🔥 Intense Music 🎵';
                btn.title = 'Play Gangnam Style Intense Speedcubing Music (Connects to headphones/earphones)';
            }
        });
    }

    async promptDevicePicker() {
        this.initContext();
        // Check for native selectAudioOutput
        if (navigator.mediaDevices && typeof navigator.mediaDevices.selectAudioOutput === 'function') {
            try {
                const device = await navigator.mediaDevices.selectAudioOutput();
                if (device) {
                    await this.setOutputDevice(device.deviceId, device.label || 'Headphones');
                    this.notify(`🎧 Connected to ${device.label || 'Headphones'}!`);
                    this.updateDeviceButtons(device.label || 'Headphones');
                    return;
                }
            } catch (err) {
                if (err.name !== 'AbortError') console.warn(err);
            }
        }

        // Fallback: enumerate audio devices
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const audioOutputs = devices.filter(d => d.kind === 'audiooutput');
                if (audioOutputs.length > 1 && audioOutputs.some(d => d.label)) {
                    this.showDeviceModal(audioOutputs);
                    return;
                }
            } catch (err) {
                console.warn(err);
            }
        }

        // Standard notification if device selection is handled by OS default
        this.notify('🎧 Audio is playing through your connected Headphones / Earphones via system default output!');
        this.updateDeviceButtons('Headphones Connected');
    }

    updateDeviceButtons(label) {
        const btns = document.querySelectorAll('.btn-audio-device');
        btns.forEach(btn => {
            btn.innerHTML = `🎧 ${label || 'Headphones'}`;
            btn.title = `Connected: ${label || 'Headphones / Earphones'}. Click to switch device.`;
        });
    }

    notify(message) {
        let toast = document.getElementById('cube-music-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'cube-music-toast';
            toast.style.cssText = 'position:fixed; bottom:24px; right:24px; z-index:99999; background:linear-gradient(135deg, #1e293b, #0f172a); color:#fff; border:2px solid #00E5FF; padding:12px 20px; border-radius:14px; font-family:"DynaPuff",cursive,sans-serif; font-size:0.95em; box-shadow:0 10px 25px rgba(0,0,0,0.5); display:flex; align-items:center; gap:10px; transition:all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform:translateY(100px); opacity:0; pointer-events:none;';
            document.body.appendChild(toast);
        }
        toast.innerHTML = message;
        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        });
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => {
            toast.style.transform = 'translateY(100px)';
            toast.style.opacity = '0';
        }, 3400);
    }

    showDeviceModal(devices) {
        let modal = document.getElementById('cube-audio-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'cube-audio-modal';
            modal.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); backdrop-filter:blur(6px); z-index:999999; display:flex; align-items:center; justify-content:center; padding:16px; box-sizing:border-box;';
            document.body.appendChild(modal);
        }

        let listHtml = '';
        devices.forEach((d, idx) => {
            const name = d.label || `Audio Output ${idx + 1}`;
            listHtml += `
                <button class="device-opt-btn" data-id="${d.deviceId}" data-label="${name}" style="display:flex; align-items:center; gap:10px; width:100%; text-align:left; background:#1e293b; color:#fff; border:2px solid rgba(255,255,255,0.15); padding:10px 14px; border-radius:12px; margin-bottom:8px; cursor:pointer; font-size:1em; font-family:sans-serif;">
                    <span>🎧</span> <strong>${name}</strong>
                </button>
            `;
        });

        modal.innerHTML = `
            <div style="background:#0f172a; border:3px solid #6c5ce7; border-radius:20px; padding:22px; max-width:420px; width:100%; box-shadow:0 20px 40px rgba(0,0,0,0.6); color:#fff; position:relative;">
                <button id="btn-close-audio-modal" style="position:absolute; top:12px; right:14px; background:none; border:none; color:#94a3b8; font-size:1.3em; cursor:pointer;">✕</button>
                <h3 style="font-family:'DynaPuff',cursive,sans-serif; margin-top:0; margin-bottom:8px; color:#a29bfe; font-size:1.3em;">🎧 Connect Headphones / Output</h3>
                <p style="font-size:0.88em; color:#94a3b8; margin-bottom:14px;">Select your connected headphones, earphones, or speakers for Gangnam Style Intense Music:</p>
                <div style="max-height:220px; overflow-y:auto; margin-bottom:14px;">
                    ${listHtml}
                </div>
                <button id="btn-use-default-output" style="width:100%; background:#6c5ce7; color:#fff; border:none; padding:10px; border-radius:12px; font-weight:bold; cursor:pointer; font-family:'DynaPuff',cursive,sans-serif;">Use System Default Headphones 🎧</button>
            </div>
        `;
        modal.style.display = 'flex';

        modal.querySelector('#btn-close-audio-modal').onclick = () => { modal.style.display = 'none'; };
        modal.querySelectorAll('.device-opt-btn').forEach(b => {
            b.onclick = async () => {
                const id = b.dataset.id;
                const lbl = b.dataset.label;
                await this.setOutputDevice(id, lbl);
                this.updateDeviceButtons(lbl);
                this.notify(`🎧 Audio output switched to ${lbl}!`);
                modal.style.display = 'none';
            };
        });
        modal.querySelector('#btn-use-default-output').onclick = async () => {
            await this.setOutputDevice('', 'Default Headphones');
            this.updateDeviceButtons('Default Headphones');
            this.notify('🎧 Audio routed to system connected headphones/earphones!');
            modal.style.display = 'none';
        };
    }
}

// Global instance
window.GangnamMusic = new GangnamMusicEngine();

window.toggleIntenseMusic = function() {
    window.GangnamMusic.toggle();
};

window.showAudioDevicePicker = function() {
    window.GangnamMusic.promptDevicePicker();
};

window.cycleMusicVolume = function() {
    window.GangnamMusic.cycleVolume();
};

window.setMusicVolume = function(val) {
    window.GangnamMusic.setVolume(val);
};

function initMusicButtons() {
    document.querySelectorAll('.btn-intense-music').forEach(btn => {
        btn.onclick = () => window.GangnamMusic.toggle();
    });
    document.querySelectorAll('.btn-audio-device').forEach(btn => {
        btn.onclick = () => window.GangnamMusic.promptDevicePicker();
    });
    document.querySelectorAll('.btn-music-volume').forEach(btn => {
        btn.onclick = () => window.GangnamMusic.cycleVolume();
    });
    if (window.GangnamMusic) {
        window.GangnamMusic.updateVolumeUI();
        window.GangnamMusic.updateUI();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMusicButtons);
} else {
    initMusicButtons();
}
