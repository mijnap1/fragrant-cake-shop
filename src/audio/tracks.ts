/*
 * Original background music, written as data and played by the synth in audio.ts.
 * Each bar is eight eighth-note steps. `mel` uses note names ("A5", "Bb4") and "." for silence.
 */

export type TrackId = 'sweet' | 'sunset';

export interface Bar {
  chord: string[];
  bass: string;
  mel: string;
}

export interface Track {
  bpm: number;
  /** "sweet": bouncy, with soft percussion. "sunset": slow and dreamy. */
  feel: TrackId;
  bars: Bar[];
}

const Fmaj7 = ['F3', 'A3', 'C4', 'E4'];
const Am7 = ['E3', 'G3', 'A3', 'C4'];
const Bbmaj7 = ['D3', 'F3', 'A3', 'Bb3'];
const C7 = ['E3', 'G3', 'Bb3', 'C4'];
const Dm7 = ['D3', 'F3', 'A3', 'C4'];
const Gm7 = ['D3', 'F3', 'G3', 'Bb3'];

/** "Cake Shop Waltz" — title screen and the shop. F major, music-box lead. */
const SWEET: Track = {
  bpm: 100,
  feel: 'sweet',
  bars: [
    { chord: Fmaj7, bass: 'F2', mel: 'A5 . C6 . A5 G5 F5 .' },
    { chord: Am7, bass: 'A2', mel: 'E5 . G5 . E5 D5 C5 .' },
    { chord: Bbmaj7, bass: 'Bb2', mel: 'D5 . F5 . A5 . G5 F5' },
    { chord: C7, bass: 'C3', mel: 'E5 . . G5 . . C5 .' },
    { chord: Fmaj7, bass: 'F2', mel: 'A5 . C6 . A5 G5 F5 A5' },
    { chord: Dm7, bass: 'D3', mel: 'F5 . E5 F5 . D5 A4 .' },
    { chord: Gm7, bass: 'G2', mel: 'Bb4 . D5 F5 E5 . D5 .' },
    { chord: C7, bass: 'C3', mel: 'C5 . E5 G5 Bb5 . A5 G5' },
  ],
};

const Cmaj7 = ['C3', 'E3', 'G3', 'B3'];
const Em7 = ['E3', 'G3', 'B3', 'D4'];
const Am7lo = ['A2', 'C3', 'E3', 'G3'];
const G7 = ['D3', 'F3', 'G3', 'B3'];

/** "Across the Wall" — the street at sunset. C major, slow and warm. */
const SUNSET: Track = {
  bpm: 76,
  feel: 'sunset',
  bars: [
    { chord: Cmaj7, bass: 'C2', mel: 'G5 . . E5 . . D5 E5' },
    { chord: Em7, bass: 'E2', mel: 'B4 . . . . . D5 E5' },
    { chord: Am7lo, bass: 'A2', mel: 'C5 . . E5 . . A5 G5' },
    { chord: Fmaj7, bass: 'F2', mel: 'A5 . . . . . G5 F5' },
    { chord: Dm7, bass: 'D2', mel: 'F5 . . E5 . . D5 C5' },
    { chord: G7, bass: 'G2', mel: 'D5 . . . B4 . C5 D5' },
    { chord: Em7, bass: 'E2', mel: 'E5 . . G5 . . B5 A5' },
    { chord: Fmaj7, bass: 'F2', mel: 'A5 . . . G5 . . .' },
  ],
};

export const TRACKS: Record<TrackId, Track> = { sweet: SWEET, sunset: SUNSET };

const SEMITONE: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

/** "A4" → 440, "Bb3" → 233.08 … */
export function noteFreq(note: string) {
  const m = /^([A-G])([#b]?)(\d)$/.exec(note);
  if (!m) throw new Error(`bad note: ${note}`);
  const midi = (Number(m[3]) + 1) * 12 + SEMITONE[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
  return 440 * 2 ** ((midi - 69) / 12);
}
