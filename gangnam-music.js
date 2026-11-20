/**
 * Speedcubing Music Engine (Cool Chill Lo-Fi + Intense Gangnam Style EDM)
 * Pure Web Audio Real-Time Synthesizer with Infinite Looping and Direct Headphone/Earphone Output
 */

class CubeMusicEngine {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.activeTrack = null; // 'cool' or 'intense'
        this.timerId = null;
        this.currentStep = 0;
        this.bpm = 104;
        this.volume = parseFloat(localStorage.getItem('cube_music_vol')) || 0.65;
        this.masterGain = null;
        this.compressor = null;
        this.nextNoteTime = 0;
        this.scheduleAheadTime = 0.12;
        this.lookaheadMs = 25;
        this.noiseBuffer = null;

        // Frequencies (Hz)
        this.N = {
            G1: 49.00, A1: 55.00, Bb1: 58.27, B1: 61.74, C2: 65.41, Cs2: 69.30, D2: 73.42,
            E2: 82.41, F2: 87.31, Fs2: 92.50, G2: 98.00, Gs2: 103.83, A2: 110.00, Bb2: 116.54,
            B2: 123.47, C3: 130.81, Cs3: 138.59, D3: 146.83, E3: 164.81, F3: 174.61, Fs3: 185.00,
            G3: 196.00, Gs3: 207.65, A3: 220.00, Bb3: 233.08, B3: 246.94, C4: 261.63, Cs4: 277.18,
            D4: 293.66, E4: 329.63, F4: 349.23, Fs4: 369.99, G4: 392.00, Gs4: 415.30, A4: 440.00,
            Bb4: 466.16, B4: 493.88, C5: 523.25, Cs5: 554.37, D5: 587.33, E5: 659.25, F5: 698.46,
            Fs5: 739.99, G5: 783.99, Gs5: 830.61, A5: 880.00, B5: 987.77
        };

        this.buildScores();
    }

    buildScores() {
        const N = this.N;

        // 1. INTENSE GANGNAM STYLE EDM (132 BPM, 128 steps)
        this.intenseLeadScore = [
            // Bar 1 - Intro Synth Hook
            N.B4, N.B4, N.B4, N.B4,  N.B4, N.B4, N.B4, N.B4,  N.B4, N.B4, N.A4, N.A4,  N.Fs4, N.Fs4, N.E4, N.E4,
            // Bar 2
            N.Fs4, N.Fs4, N.Fs4, N.Fs4,  N.Fs4, N.Fs4, N.Fs4, N.Fs4,  N.E4, N.E4, N.D4, N.D4,  N.B3, N.B3, N.D4, N.D4,
            // Bar 3
            N.B4, N.B4, N.B4, N.B4,  N.B4, N.B4, N.B4, N.B4,  N.B4, N.B4, N.A4, N.A4,  N.Fs4, N.Fs4, N.E4, N.E4,
            // Bar 4 - Rising transition
            N.Fs4, N.Fs4, N.Fs4, N.Fs4,  N.A4, N.A4, N.A4, N.A4,  N.B4, N.B4, N.B4, N.B4,  N.D5, N.D5, N.Cs5, N.Cs5,
            // Bar 5 - Hook
            N.B3, 0, N.B3, 0,  0, N.B3, 0, 0,  N.D4, 0, N.B3, 0,  N.E4, 0, N.D4, N.B3,
            // Bar 6
            N.B3, 0, N.B3, 0,  0, N.B3, 0, 0,  N.D4, 0, N.B3, 0,  N.Fs4, 0, N.E4, N.D4,
            // Bar 7
            N.B3, 0, N.B3, 0,  0, N.B3, 0, 0,  N.D4, 0, N.B3, 0,  N.E4, 0, N.D4, N.B3,
            // Bar 8
            N.Fs4, N.Gs4, N.A4, N.B4,  N.Cs5, N.D5, N.E5, N.Fs5,  N.B4, 0, N.B4, 0,  N.B4, N.A4, N.Fs4, N.E4
        ];

        this.intenseBassScore = [
            // Bars 1-3
            N.B1, 0, N.B1, 0,  N.B1, 0, N.B1, 0,  N.B1, 0, N.A1, 0,  N.Fs1, 0, N.E1, 0,
            N.Fs1, 0, N.Fs1, 0,  N.Fs1, 0, N.Fs1, 0,  N.E1, 0, N.D2, 0,  N.B1, 0, N.D2, 0,
            N.B1, 0, N.B1, 0,  N.B1, 0, N.B1, 0,  N.B1, 0, N.A1, 0,  N.Fs1, 0, N.E1, 0,
            // Bar 4
            N.Fs1, 0, N.Fs1, 0,  N.A1, 0, N.A1, 0,  N.B1, 0, N.B1, 0,  N.D2, 0, N.Cs2, 0,
            // Bars 5-7
            N.B1, N.B1, 0, N.B1,  0, N.B1, 0, 0,  N.D2, 0, N.B1, 0,  N.E2, 0, N.D2, N.B1,
            N.B1, N.B1, 0, N.B1,  0, N.B1, 0, 0,  N.D2, 0, N.B1, 0,  N.Fs2, 0, N.E2, N.D2,
            N.B1, N.B1, 0, N.B1,  0, N.B1, 0, 0,  N.D2, 0, N.B1, 0,  N.E2, 0, N.D2, N.B1,
            // Bar 8
            N.Fs2, N.Gs2, N.A2, N.B2,  N.Cs3, N.D3, N.E3, N.Fs3,  N.B1, 0, N.B1, 0,  N.B1, N.A1, N.Fs1, N.E1
        ];

        // 2. COOL SPEEDCUBING LO-FI CHILL GROOVE (104 BPM, 128 steps)
        this.coolLeadScore = [
            // Bar 1 - Smooth Dm9 riff
            N.A4, 0, 0, N.C5,  0, 0, N.D5, 0,  0, 0, N.C5, 0,  N.A4, 0, 0, 0,
            // Bar 2
            N.F4, 0, 0, N.G4,  0, 0, N.A4, 0,  0, 0, N.F4, 0,  N.D4, 0, 0, 0,
            // Bar 3 - Flowing Bbmaj9 run
            N.F4, 0, N.A4, 0,  N.C5, 0, N.D5, 0,  N.E5, 0, N.D5, 0,  N.C5, 0, 0, 0,
            // Bar 4
            N.C5, 0, 0, 0,  N.A4, 0, 0, 0,  N.F4, 0, N.G4, 0,  N.A4, 0, 0, 0,
            // Bar 5 - Gm9 soulful groove
            N.G4, 0, 0, N.Bb4,  0, 0, N.D5, 0,  0, 0, N.C5, 0,  N.Bb4, 0, 0, 0,
            // Bar 6 - C9 bright resolution
            N.C5, 0, 0, N.E5,  0, 0, N.G5, 0,  0, 0, N.E5, 0,  N.C5, 0, 0, 0,
            // Bar 7 - A7alt turnaround
            N.D5, 0, 0, N.C5,  0, 0, N.A4, 0,  0, 0, N.F4, 0,  N.G4, 0, 0, 0,
            // Bar 8 - Sweet finish to loop
            N.A4, 0, 0, 0,  N.F4, 0, 0, 0,  N.D4, 0, 0, 0,  N.D4, 0, 0, 0
        ];

        this.coolBassScore = [
            // Bars 1-2 (Dm9)
            N.D2, 0, 0, 0,  N.D2, 0, N.F2, 0,  N.G2, 0, 0, 0,  N.A2, 0, N.C3, 0,
            N.D2, 0, 0, 0,  N.D2, 0, N.C3, 0,  N.A2, 0, N.G2, 0,  N.F2, 0, N.E2, 0,
            // Bars 3-4 (Bbmaj9)
            N.Bb1, 0, 0, 0,  N.Bb1, 0, N.D2, 0,  N.F2, 0, 0, 0,  N.G2, 0, N.F2, 0,
            N.Bb1, 0, 0, 0,  N.C2, 0, N.D2, 0,  N.F2, 0, N.G2, 0,  N.A2, 0, N.F2, 0,
            // Bars 5-6 (Gm9 -> C9)
            N.G1, 0, 0, 0,  N.G1, 0, N.Bb1, 0,  N.D2, 0, 0, 0,  N.F2, 0, N.D2, 0,
            N.C2, 0, 0, 0,  N.C2, 0, N.E2, 0,  N.G2, 0, N.Bb2, 0,  N.C3, 0, N.Bb2, 0,
            // Bars 7-8 (A7 -> Dm)
            N.A1, 0, 0, 0,  N.A1, 0, N.Cs2, 0,  N.E2, 0, N.G2, 0,  N.A2, 0, N.G2, 0,
            N.D2, 0, 0, 0,  N.D2, 0, N.F2, 0,  N.A2, 0, N.C3, 0,  N.D3, 0, 0, 0
        ];

        // Chords for Cool Music (per bar)
        this.coolChords = {
            0:  [N.D3, N.F3, N.A3, N.C4, N.E4],   // Dm9
            16: [N.D3, N.F3, N.A3, N.C4],         // Dm7
            32: [N.Bb2, N.D3, N.F3, N.A3, N.C4],  // Bbmaj9
            48: [N.Bb2, N.D3, N.F3, N.A3],        // Bbmaj7
            64: [N.G2, N.Bb2, N.D3, N.F3, N.A3],  // Gm9
            80: [N.C3, N.E3, N.G3, N.Bb3, N.D4],  // C9
            96: [N.A2, N.Cs3, N.E3, N.G3, N.Bb3], // A7(b9)
            112:[N.D3, N.F3, N.A3, N.C4, N.E4]   // Dm9 resolve
        };
    }

    initContext() {
        if (this.ctx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-16, this.ctx.currentTime);
        this.compressor.knee.setValueAtTime(10, this.ctx.currentTime);
        this.compressor.ratio.setValueAtTime(6, this.ctx.currentTime);
        this.compressor.attack.setValueAtTime(0.005, this.ctx.currentTime);
        this.compressor.release.setValueAtTime(0.12, this.ctx.currentTime);

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

        this.masterGain.connect(this.compressor);
        this.compressor.connect(this.ctx.destination);

        const sampleRate = this.ctx.sampleRate;
        const buf = this.ctx.createBuffer(1, sampleRate, sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < sampleRate; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        this.noiseBuffer = buf;
    }

    // --- INTENSE EDM INSTRUMENTS ---
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
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc2.type = 'sawtooth';
        osc1.frequency.setValueAtTime(freq, time);
        osc2.frequency.setValueAtTime(freq * 1.006, time);
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

    // --- COOL LO-FI CHILL INSTRUMENTS ---
    playCoolKick(time) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(95, time);
        osc.frequency.exponentialRampToValueAtTime(42, time + 0.12);
        gain.gain.setValueAtTime(0.55, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(time);
        osc.stop(time + 0.13);
    }

    playCoolSnare(time) {
        if (!this.noiseBuffer) return;
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1800, time);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.22, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        const tone = this.ctx.createOscillator();
        tone.type = 'triangle';
        tone.frequency.setValueAtTime(140, time);
        tone.frequency.exponentialRampToValueAtTime(80, time + 0.08);
        const toneGain = this.ctx.createGain();
        toneGain.gain.setValueAtTime(0.16, time);
        toneGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
        tone.connect(toneGain);
        toneGain.connect(this.masterGain);

        noise.start(time);
        noise.stop(time + 0.11);
        tone.start(time);
        tone.stop(time + 0.09);
    }

    playCoolHat(time, isOpen) {
        if (!this.noiseBuffer) return;
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.noiseBuffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(7200, time);
        filter.Q.setValueAtTime(1.8, time);
        const dur = isOpen ? 0.14 : 0.04;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(isOpen ? 0.12 : 0.07, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        noise.start(time);
        noise.stop(time + dur + 0.01);
    }

    playCoolBass(time, freq, dur) {
        if (!freq) return;
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, time);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.36, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur * 0.95);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        osc.start(time);
        osc.stop(time + dur);
    }

    playCoolChord(time, notes, dur) {
        if (!notes || !notes.length) return;
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, time);
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1100 + idx * 80, time);
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.06, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + dur * 0.95);
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);
            osc.start(time);
            osc.stop(time + dur);
        });
    }

    playCoolLead(time, freq, dur) {
        if (!freq) return;
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        const osc2 = this.ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq, time);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, time);
        filter.Q.setValueAtTime(2.2, time);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.18, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur * 0.92);

        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(time);
        osc2.start(time);
        osc.stop(time + dur);
        osc2.stop(time + dur);
    }

    scheduleStep(step, time) {
        if (this.activeTrack === 'cool') {
            this.scheduleCoolStep(step, time);
        } else {
            this.scheduleIntenseStep(step, time);
        }
    }

    scheduleIntenseStep(step, time) {
        const step16 = (60 / this.bpm) / 4;
        const beatInBar = (step % 16);

        if (beatInBar % 4 === 0) this.playKick(time);
        if (beatInBar === 4 || beatInBar === 12) this.playSnare(time);
        const isOpenHat = (beatInBar % 4 === 2);
        this.playHiHat(time, isOpenHat);

        const bassFreq = this.intenseBassScore[step % this.intenseBassScore.length];
        if (bassFreq) this.playBass(time, bassFreq, step16 * 0.95);

        const leadFreq = this.intenseLeadScore[step % this.intenseLeadScore.length];
        if (leadFreq) this.playLead(time, leadFreq, step16 * 0.92);
    }

    scheduleCoolStep(step, time) {
        const step16 = (60 / this.bpm) / 4;
        const beatInBar = (step % 16);

        // Warm kick on 0, 8 and soft ghost on 14
        if (beatInBar === 0 || beatInBar === 8 || beatInBar === 14) {
            this.playCoolKick(time);
        }

        // Snappy rimshot on 4, 12
        if (beatInBar === 4 || beatInBar === 12) {
            this.playCoolSnare(time);
        }

        // Lo-fi hi-hat (swung 16ths, open on 10)
        const isOpen = (beatInBar === 10);
        this.playCoolHat(time, isOpen);

        // Smooth walking bass
        const bassFreq = this.coolBassScore[step % this.coolBassScore.length];
        if (bassFreq) {
            this.playCoolBass(time, bassFreq, step16 * 1.8);
        }

        // Rich chord pads
        const chord = this.coolChords[step % 128];
        if (chord) {
            this.playCoolChord(time, chord, step16 * 7.5);
        }

        // Soulful lead pluck
        const leadFreq = this.coolLeadScore[step % this.coolLeadScore.length];
        if (leadFreq) {
            this.playCoolLead(time, leadFreq, step16 * 1.6);
        }
    }

    start(track = 'cool') {
        this.initContext();
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        if (this.isPlaying && this.activeTrack === track) return;

        this.isPlaying = true;
        this.activeTrack = track;
        this.bpm = (track === 'cool') ? 104 : 132;
        this.currentStep = 0;
        this.nextNoteTime = this.ctx.currentTime + 0.05;

        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }

        const s16 = (60 / this.bpm) / 4;
        const loopLength = (track === 'cool') ? this.coolLeadScore.length : this.intenseLeadScore.length;

        // INFINITE LOOPING: Runs forever as long as isPlaying is true
        this.timerId = setInterval(() => {
            if (!this.isPlaying) return;
            while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
                this.scheduleStep(this.currentStep, this.nextNoteTime);
                this.nextNoteTime += (60 / this.bpm) / 4;
                this.currentStep = (this.currentStep + 1) % loopLength;
            }
        }, this.lookaheadMs);

        this.updateUI();
    }

    stop() {
        this.isPlaying = false;
        this.activeTrack = null;
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
        this.updateUI();
    }

    toggleCool() {
        if (this.isPlaying && this.activeTrack === 'cool') {
            this.stop();
        } else {
            this.start('cool');
        }
    }

    toggleIntense() {
        if (this.isPlaying && this.activeTrack === 'intense') {
            this.stop();
        } else {
            this.start('intense');
        }
    }

    toggle(track = 'intense') {
        if (this.isPlaying && this.activeTrack === track) {
            this.stop();
        } else {
            this.start(track);
        }
    }

    updateUI() {
        // Cool Music buttons
        document.querySelectorAll('.btn-cool-music').forEach(btn => {
            if (this.isPlaying && this.activeTrack === 'cool') {
                btn.classList.add('btn-cool-music-active');
                btn.innerHTML = '😎 Cool Music: PLAYING 🎶 (Click to Stop)';
                btn.title = 'Cool Lo-Fi Speedcubing Music is playing! Click to stop';
            } else {
                btn.classList.remove('btn-cool-music-active');
                btn.innerHTML = '😎 Cool Music 🎵';
                btn.title = 'Play Cool Speedcubing Lo-Fi Chill Music (Works automatically with headphones/earphones)';
            }
        });

        // Intense Music buttons
        document.querySelectorAll('.btn-intense-music').forEach(btn => {
            if (this.isPlaying && this.activeTrack === 'intense') {
                btn.classList.add('btn-intense-music-active');
                btn.innerHTML = '🔥 Intense Music: PLAYING 🎶 (Click to Stop)';
                btn.title = 'Gangnam Style is playing! Click to stop music';
            } else {
                btn.classList.remove('btn-intense-music-active');
                btn.innerHTML = '🔥 Intense Music 🎵';
                btn.title = 'Play Gangnam Style Intense Speedcubing Music (Works automatically with headphones/earphones)';
            }
        });
    }
}

// Global instances
window.CubeMusic = new CubeMusicEngine();
window.GangnamMusic = window.CubeMusic; // Backwards compatibility

window.toggleCoolMusic = function() {
    window.CubeMusic.toggleCool();
};

window.toggleIntenseMusic = function() {
    window.CubeMusic.toggleIntense();
};

function initMusicButtons() {
    document.querySelectorAll('.btn-cool-music').forEach(btn => {
        btn.onclick = () => window.CubeMusic.toggleCool();
    });
    document.querySelectorAll('.btn-intense-music').forEach(btn => {
        btn.onclick = () => window.CubeMusic.toggleIntense();
    });
    if (window.CubeMusic) {
        window.CubeMusic.updateUI();
    }
}

// Autoplay Cool Music on Timer page open (with user interaction unlock for browser audio policy)
function autoStartCoolMusicIfOnTimer() {
    const isTimerPage = window.location.pathname.includes('timer.html') || document.getElementById('scramble-display-text');
    if (!isTimerPage) return;

    const startIfReady = () => {
        if (window.CubeMusic && !window.CubeMusic.isPlaying) {
            window.CubeMusic.start('cool');
        }
    };

    // Attempt direct start
    startIfReady();

    // Browser audio policy gesture unlock: first interaction (click anywhere, spacebar) starts Cool Music
    const unlockAudio = () => {
        startIfReady();
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
    };

    window.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
    window.addEventListener('keydown', unlockAudio, { once: true, passive: true });
    window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initMusicButtons();
        autoStartCoolMusicIfOnTimer();
    });
} else {
    initMusicButtons();
    autoStartCoolMusicIfOnTimer();
}
