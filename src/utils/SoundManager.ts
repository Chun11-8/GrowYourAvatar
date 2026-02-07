/**
 * SoundManager.ts
 * 
 * A utility to generate synthesized sound effects using the Web Audio API.
 * This avoids the need for external audio files and ensures instant playback.
 * 
 * Sounds included:
 * - playCorrect(): Cheerful major chord chime
 * - playWrong(): Low-pitched "buzz"
 * - playClick(): Short pop/click
 * - playWin(): Victory arpeggio
 * - playGameOver(): Descending sad tones
 */

import backgroundMusicAsset from '../assets/backgroundKid.mp3';

class SoundManager {
    private audioCtx: AudioContext | null = null;
    private isMuted: boolean = false;
    private bgMusic: HTMLAudioElement | null = null;

    constructor() {
        // Initialize AudioContext lazily
        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            this.audioCtx = new AudioContextClass();
        } catch (e) {
            console.error("Web Audio API not supported", e);
        }

        // Initialize Background Music
        this.bgMusic = new Audio(backgroundMusicAsset);
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.5; // Set a reasonable default volume
    }

    private getContext(): AudioContext | null {
        if (!this.audioCtx) return null;
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
        return this.audioCtx;
    }

    public setMute(mute: boolean) {
        this.isMuted = mute;
        if (this.bgMusic) {
            if (mute) {
                this.bgMusic.pause();
            } else {
                // Only resume if it was intended to be playing.
                // For simplicity in this app, we'll assume unmuting tries to play if we are in a "playing" state,
                // but simpler is just to let the play functions handle it.
                // However, commonly users expect unmuting to resume music.
                this.bgMusic.play().catch(e => console.log("Playback failed:", e));
            }
        }
    }

    public isAudioMuted(): boolean {
        return this.isMuted;
    }

    // --- Background Music ---

    public playBackgroundMusic() {
        if (this.isMuted || !this.bgMusic) return;

        this.bgMusic.play().catch(e => {
            console.log("Autoplay prevented. Music will start on user interaction.", e);
            // Optional: Listen for the next click to start music
            const playOnInteraction = () => {
                this.bgMusic?.play();
                window.removeEventListener('click', playOnInteraction);
                window.removeEventListener('keydown', playOnInteraction);
            };
            window.addEventListener('click', playOnInteraction);
            window.addEventListener('keydown', playOnInteraction);
        });
    }

    public stopBackgroundMusic() {
        if (this.bgMusic) {
            this.bgMusic.pause();
            this.bgMusic.currentTime = 0;
        }
    }

    // --- Sound Generators ---

    /**
     * Plays a cheerful "ding" / chime for correct answers.
     */
    public playCorrect() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        const t = ctx.currentTime;

        // Create oscillator for a "coin" like sound (High C -> High E)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, t); // A5
        osc.frequency.exponentialRampToValueAtTime(1760, t + 0.1); // Fast slide up to A6

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);

        osc.start(t);
        osc.stop(t + 0.5);
    }

    /**
     * Plays a low "buzz" for wrong answers.
     */
    public playWrong() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        const t = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, t); // Low frequency
        osc.frequency.linearRampToValueAtTime(100, t + 0.3); // Slide down

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

        osc.start(t);
        osc.stop(t + 0.3);
    }

    /**
     * Plays a short "pop" for button clicks.
     */
    public playClick() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        const t = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.05);

        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

        osc.start(t);
        osc.stop(t + 0.05);
    }

    /**
     * Plays a victory fanfare (Major Arpeggio).
     */
    public playWin() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        const t = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major: C4, E4, G4, C5

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'square'; // 8-bit style
            osc.frequency.value = freq;

            const time = t + (i * 0.1);
            gain.gain.setValueAtTime(0.1, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);

            osc.start(time);
            osc.stop(time + 0.4);
        });
    }

    public playLevelUp() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        const t = ctx.currentTime;

        // Rapid ascending arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.value = freq;

            osc.start(t + i * 0.08);
            osc.stop(t + i * 0.08 + 0.2);

            gain.gain.setValueAtTime(0.2, t + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.08 + 0.2);
        });
    }

    public playGameOver() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        if (!ctx) return;

        const t = ctx.currentTime;
        const notes = [440, 415.30, 392, 369.99]; // A4, G#4, G4, F#4

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'triangle';
            osc.frequency.value = freq;

            const time = t + (i * 0.2);
            gain.gain.setValueAtTime(0.2, time);
            gain.gain.linearRampToValueAtTime(0.01, time + 0.3);

            osc.start(time);
            osc.stop(time + 0.3);
        });
    }
}

export const soundManager = new SoundManager();
