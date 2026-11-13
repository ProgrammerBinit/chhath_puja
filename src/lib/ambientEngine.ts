import type { Mood } from '../types';

/**
 * Original, royalty-free devotional ambience generated live with the Web Audio API:
 * a tanpura-style drone plus a slow melody in raag Bhoopali (Sa Re Ga Pa Dha) and soft temple bells.
 * Nothing is autoplayed — `start()` must be called from a user gesture.
 */

type AC = typeof AudioContext;

const BHOOPALI = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3, 2] as const;

interface MoodPreset {
  sa: number; // base frequency (Hz)
  melodyEvery: number; // seconds between melody notes
  octave: number;
  brightness: number; // low-pass cutoff of the drone
}

const PRESETS: Record<Mood, MoodPreset> = {
  dawn: { sa: 146.83, melodyEvery: 2.1, octave: 2, brightness: 900 },
  dusk: { sa: 130.81, melodyEvery: 2.6, octave: 1, brightness: 650 },
  ghat: { sa: 146.83, melodyEvery: 1.9, octave: 2, brightness: 1100 },
  sunrise: { sa: 164.81, melodyEvery: 1.7, octave: 2, brightness: 1300 },
};

export class AmbientEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private echo: DelayNode | null = null;
  private timer: number | undefined;
  private mood: Mood = 'dawn';
  private volume = 0.7;
  private step = 0;
  private nextTanpura = 0;
  private nextMelody = 0;
  private melodyIdx = 2;
  running = false;

  private ensureContext(): AudioContext {
    if (this.ctx) return this.ctx;
    const Ctor: AC | undefined =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: AC }).webkitAudioContext;
    if (!Ctor) throw new Error('Web Audio API not supported');
    const ctx = new Ctor();
    const master = ctx.createGain();
    master.gain.value = 0;
    // soft echo for a hall-like tail
    const echo = ctx.createDelay(1.5);
    echo.delayTime.value = 0.42;
    const fb = ctx.createGain();
    fb.gain.value = 0.38;
    const wet = ctx.createGain();
    wet.gain.value = 0.45;
    echo.connect(fb);
    fb.connect(echo);
    echo.connect(wet);
    wet.connect(master);
    master.connect(ctx.destination);
    this.ctx = ctx;
    this.master = master;
    this.echo = echo;
    return ctx;
  }

  setVolume(v: number): void {
    this.volume = v;
    if (this.ctx && this.master) {
      this.master.gain.setTargetAtTime(this.running ? v * 0.55 : 0, this.ctx.currentTime, 0.15);
    }
  }

  setMood(m: Mood): void {
    this.mood = m;
  }

  async start(): Promise<void> {
    const ctx = this.ensureContext();
    if (ctx.state === 'suspended') await ctx.resume();
    this.running = true;
    this.nextTanpura = ctx.currentTime + 0.1;
    this.nextMelody = ctx.currentTime + 1.2;
    this.master?.gain.setTargetAtTime(this.volume * 0.55, ctx.currentTime, 0.6);
    if (this.timer === undefined) {
      this.timer = window.setInterval(() => this.schedule(), 200);
    }
  }

  stop(): void {
    this.running = false;
    if (this.ctx && this.master) {
      this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.35);
    }
    if (this.timer !== undefined) {
      window.clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  dispose(): void {
    this.stop();
    void this.ctx?.close();
    this.ctx = null;
  }

  /** A short temple-bell strike, used when a chapter begins. */
  chime(): void {
    if (!this.ctx || !this.master || !this.running) return;
    const t = this.ctx.currentTime;
    const base = PRESETS[this.mood].sa * 4;
    [1, 2.01, 3.2, 4.7].forEach((mult, i) => {
      this.tone('sine', base * mult, t, 3.2 / (i + 1), 0.07 / (i + 1), 8000, true);
    });
  }

  private schedule(): void {
    const ctx = this.ctx;
    if (!ctx || !this.running) return;
    const p = PRESETS[this.mood];
    const ahead = ctx.currentTime + 0.6;

    while (this.nextTanpura < ahead) {
      // Pa – Sa – Sa – Sa(low) cycle, the classic tanpura pattern
      const seq = [0.75, 1, 1, 0.5];
      const ratio = seq[this.step % 4] ?? 1;
      this.tone('sawtooth', p.sa * ratio, this.nextTanpura, 3.4, 0.05, p.brightness, false);
      this.tone('sawtooth', p.sa * ratio * 2.003, this.nextTanpura, 2.4, 0.018, p.brightness, false);
      this.step += 1;
      this.nextTanpura += 1.35;
    }

    while (this.nextMelody < ahead) {
      const dir = Math.random() < 0.55 ? 1 : -1;
      this.melodyIdx = Math.min(BHOOPALI.length - 1, Math.max(0, this.melodyIdx + dir * (Math.random() < 0.25 ? 2 : 1)));
      const ratio = BHOOPALI[this.melodyIdx] ?? 1;
      this.tone('triangle', p.sa * p.octave * ratio, this.nextMelody, 3.0, 0.1, 3000, true);
      this.tone('sine', p.sa * p.octave * ratio * 2, this.nextMelody, 1.6, 0.03, 4000, true);
      this.nextMelody += p.melodyEvery * (0.8 + Math.random() * 0.6);
    }
  }

  private tone(
    type: OscillatorType,
    freq: number,
    when: number,
    dur: number,
    peak: number,
    cutoff: number,
    toEcho: boolean,
  ): void {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = cutoff;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(peak, when + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.connect(filter);
    filter.connect(g);
    g.connect(master);
    if (toEcho && this.echo) g.connect(this.echo);
    osc.start(when);
    osc.stop(when + dur + 0.1);
  }
}
