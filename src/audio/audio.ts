import type { CharId, SfxId } from '../story/types';
import { noteFreq, TRACKS, type Track, type TrackId } from './tracks';

/*
 * Everything you hear is synthesised live with the Web Audio API — no audio files.
 * Browsers only allow sound after a user gesture, so nothing plays until unlock().
 */

const LOOKAHEAD = 0.15; // seconds of notes scheduled ahead of time
const TICK_MS = 30;

interface Playing {
  id: TrackId;
  gain: GainNode;
  timer: number;
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private musicBus!: GainNode;
  private sfxBus!: GainNode;
  private reverb!: ConvolverNode;
  private noise!: AudioBuffer;
  private playing: Playing | null = null;
  private wanted: TrackId | null = null;
  private vol = { music: 0.6, sfx: 0.8, muted: false };

  /** Call from a click/keypress handler. Safe to call repeatedly. */
  unlock() {
    if (!this.ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      this.ctx = new Ctor();
      this.build(this.ctx);
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    if (this.wanted && !this.playing) this.start(this.wanted);
  }

  setVolumes(music: number, sfx: number, muted: boolean) {
    this.vol = { music, sfx, muted };
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.musicBus.gain.setTargetAtTime(muted ? 0 : music * 0.9, t, 0.08);
    this.sfxBus.gain.setTargetAtTime(muted ? 0 : sfx, t, 0.05);
  }

  /** Switches background music with a crossfade. `null` fades out. */
  music(id: TrackId | null) {
    this.wanted = id;
    if (!this.ctx || this.playing?.id === id) return;
    this.fadeOut();
    if (id) this.start(id);
  }

  sfx(id: SfxId) {
    const ctx = this.ctx;
    if (!ctx || this.vol.muted) return;
    const t = ctx.currentTime + 0.01;
    const out = this.sfxBus;
    switch (id) {
      case 'bell': // shop door bell: ding-a-ling
        [2093, 2637, 2349].forEach((f, k) => this.bell(f, t + k * 0.11, 0.12, out));
        break;
      case 'click':
        this.sweep('sine', 720, 360, t, 0.07, 0.05, out);
        break;
      case 'select':
        ['C6', 'E6', 'G6'].forEach((n, k) => this.musicBox(noteFreq(n), t + k * 0.05, 0.09, out));
        break;
      case 'heart':
        this.musicBox(noteFreq('E6'), t, 0.11, out);
        this.musicBox(noteFreq('A6'), t + 0.09, 0.11, out);
        this.bell(3520, t + 0.16, 0.03, out);
        break;
      case 'pick':
        this.sweep('sine', 320, 900, t, 0.09, 0.12, out);
        break;
      case 'fanfare':
        ['C5', 'E5', 'G5', 'C6'].forEach((n, k) => this.musicBox(noteFreq(n), t + k * 0.08, 0.13, out));
        this.pad(['C4', 'E4', 'G4', 'C5'].map(noteFreq), t + 0.32, 0.9, 0.05, out);
        this.bell(4186, t + 0.34, 0.04, out);
        break;
      case 'ending':
        ['F5', 'A5', 'C6', 'E6'].forEach((n, k) => this.musicBox(noteFreq(n), t + k * 0.18, 0.13, out));
        this.musicBox(noteFreq('F6'), t + 0.82, 0.15, out);
        this.pad(['F3', 'A3', 'C4', 'E4'].map(noteFreq), t + 0.8, 1.6, 0.05, out);
        break;
      case 'whoosh':
        this.whoosh(t, out);
        break;
    }
  }

  /** A tiny "voice" tick while text types out; pitch differs per speaker. */
  blip(who: CharId) {
    const ctx = this.ctx;
    if (!ctx || this.vol.muted) return;
    const base = who === 'rin' ? 300 : 640;
    const t = ctx.currentTime + 0.005;
    this.tone('triangle', base + Math.random() * 40, t, 0.004, 0.045, 0.035, this.sfxBus);
  }

  /* ---------------- graph ---------------- */

  private build(ctx: AudioContext) {
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 3;
    comp.connect(ctx.destination);
    this.master = ctx.createGain();
    this.master.gain.value = 0.9;
    this.master.connect(comp);

    this.reverb = ctx.createConvolver();
    this.reverb.buffer = this.impulse(ctx, 2.4);
    const wet = ctx.createGain();
    wet.gain.value = 0.32;
    this.reverb.connect(wet).connect(this.master);

    this.musicBus = ctx.createGain();
    this.sfxBus = ctx.createGain();
    for (const bus of [this.musicBus, this.sfxBus]) {
      bus.connect(this.master);
      bus.connect(this.reverb);
    }

    this.noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = this.noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    this.setVolumes(this.vol.music, this.vol.sfx, this.vol.muted);
  }

  private impulse(ctx: AudioContext, seconds: number) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3;
    }
    return buf;
  }

  /* ---------------- sequencer ---------------- */

  private start(id: TrackId) {
    const ctx = this.ctx!;
    const track = TRACKS[id];
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 1.2);
    gain.connect(this.musicBus);

    const stepDur = 60 / track.bpm / 2;
    let step = 0;
    let next = ctx.currentTime + 0.1;
    const timer = window.setInterval(() => {
      // Background tabs throttle timers; skip ahead rather than bursting missed notes.
      if (next < ctx.currentTime) next = ctx.currentTime + 0.05;
      while (next < ctx.currentTime + LOOKAHEAD) {
        this.playStep(track, step, next, stepDur, gain);
        step++;
        next += stepDur;
      }
    }, TICK_MS);
    this.playing = { id, gain, timer };
  }

  private fadeOut() {
    const p = this.playing;
    if (!p || !this.ctx) return;
    const t = this.ctx.currentTime;
    p.gain.gain.cancelScheduledValues(t);
    p.gain.gain.setValueAtTime(p.gain.gain.value, t);
    p.gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
    window.setTimeout(() => {
      window.clearInterval(p.timer);
      p.gain.disconnect();
    }, 1400);
    this.playing = null;
  }

  private playStep(track: Track, step: number, t: number, stepDur: number, out: AudioNode) {
    const bar = track.bars[Math.floor(step / 8) % track.bars.length];
    const s = step % 8;
    const barDur = stepDur * 8;
    const sweet = track.feel === 'sweet';

    const note = bar.mel.split(' ')[s];
    if (note && note !== '.') this.musicBox(noteFreq(note), t, sweet ? 0.15 : 0.13, out);

    if (s === 0) {
      this.pad(bar.chord.map(noteFreq), t, barDur, sweet ? 0.032 : 0.045, out);
      this.tone('sine', noteFreq(bar.bass), t, 0.02, sweet ? stepDur * 3 : barDur * 0.45, 0.13, out);
    }
    if (s === 4) this.tone('sine', noteFreq(bar.bass) * (sweet ? 1.5 : 1), t, 0.02, sweet ? stepDur * 3 : barDur * 0.45, 0.1, out);

    // sparkly arpeggio an octave above the chord
    const arp = bar.chord[(sweet ? s / 2 : s) % bar.chord.length];
    if (sweet ? s % 2 === 0 : true) this.tone('triangle', noteFreq(arp) * 2, t, 0.005, 0.35, sweet ? 0.03 : 0.022, out);

    if (sweet) {
      if (s % 2 === 1) this.shaker(t, out);
      if (s === 0 || s === 4) this.sweep('sine', 140, 50, t, 0.16, 0.12, out);
    }
  }

  /* ---------------- instruments ---------------- */

  private tone(type: OscillatorType, f: number, t: number, attack: number, decay: number, peak: number, out: AudioNode) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
    o.connect(g).connect(out);
    o.start(t);
    o.stop(t + attack + decay + 0.05);
  }

  /** Bright, quickly-decaying "music box" pluck. */
  private musicBox(f: number, t: number, vel: number, out: AudioNode) {
    this.tone('sine', f, t, 0.004, 1.3, vel, out);
    this.tone('sine', f * 2, t, 0.003, 0.45, vel * 0.32, out);
    this.tone('sine', f * 4.02, t, 0.002, 0.18, vel * 0.12, out);
  }

  /** Inharmonic partials make it sound like a small metal bell. */
  private bell(f: number, t: number, vel: number, out: AudioNode) {
    [[1, 1, 1.1], [2.76, 0.5, 0.6], [5.4, 0.3, 0.35], [8.93, 0.15, 0.2]].forEach(([r, g, d]) => this.tone('sine', f * r, t, 0.002, d, vel * g, out));
  }

  /** Soft, filtered chord that swells in and out. */
  private pad(freqs: number[], t: number, dur: number, vel: number, out: AudioNode) {
    const ctx = this.ctx!;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1400;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vel, t + Math.min(0.5, dur / 3));
    g.gain.setValueAtTime(vel, t + dur * 0.8);
    g.gain.linearRampToValueAtTime(0, t + dur + 0.5);
    filter.connect(g).connect(out);
    for (const f of freqs) {
      for (const cents of [-7, 7]) {
        const o = ctx.createOscillator();
        o.type = 'triangle';
        o.frequency.value = f;
        o.detune.value = cents;
        o.connect(filter);
        o.start(t);
        o.stop(t + dur + 0.6);
      }
    }
  }

  private sweep(type: OscillatorType, from: number, to: number, t: number, dur: number, peak: number, out: AudioNode) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(from, t);
    o.frequency.exponentialRampToValueAtTime(to, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(out);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  private shaker(t: number, out: AudioNode) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 7000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.035, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    src.connect(hp).connect(g).connect(out);
    src.start(t, Math.random() * 0.5, 0.1);
  }

  private whoosh(t: number, out: AudioNode) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 1.2;
    bp.frequency.setValueAtTime(400, t);
    bp.frequency.exponentialRampToValueAtTime(2600, t + 0.5);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.09, t + 0.2);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    src.connect(bp).connect(g).connect(out);
    src.start(t, 0, 0.7);
  }
}

export const audio = new AudioEngine();
