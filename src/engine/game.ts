import { LABEL_INDEX, SCRIPT } from '../story/chapter1';
import { cakeName, cakeScore, type CakeChoice, type CakePart } from '../story/cake';
import type { BgId, CharId, EndingId, Expr, Lang, Pos, Step } from '../story/types';
import { storage } from './storage';

export interface CharState {
  e: Expr;
  p: Pos;
}

/** A "+1" affection bubble waiting to be shown. */
export interface Pop {
  id: number;
  who: CharId;
  n: number;
}

/** Log entries point back into the script, so the backlog follows the current language. */
export interface LogEntry {
  step: number;
  opt?: number;
}

export interface GameState {
  i: number;
  name: string;
  k: number;
  r: number;
  cake: CakeChoice;
  cakeScore: number;
  cakeStars: number;
  bg: BgId | null;
  chars: Partial<Record<CharId, CharState>>;
  log: LogEntry[];
  pops: Pop[];
  popSeq: number;
}

export type Action =
  | { type: 'new'; name: string }
  | { type: 'load'; save: SaveData }
  | { type: 'quit' }
  | { type: 'next' }
  | { type: 'choose'; opt: number }
  | { type: 'cakePick'; part: CakePart; id: string }
  | { type: 'cakeDone'; stars: number }
  | { type: 'popDone'; id: number };

const LOG_LIMIT = 80;

export const stepAt = (s: GameState): Step | undefined => SCRIPT[s.i];

function addPts(s: GameState, k: number, r: number) {
  s.k += k;
  s.r += r;
  if (k) s.pops.push({ id: s.popSeq++, who: 'kao', n: k });
  if (r) s.pops.push({ id: s.popSeq++, who: 'rin', n: r });
}

function pushLog(s: GameState, entry: LogEntry) {
  s.log.push(entry);
  if (s.log.length > LOG_LIMIT) s.log.shift();
}

/** Runs instant steps (bg, show, jumps…) until the story needs the player again. */
function settle(from: GameState): GameState {
  const s: GameState = { ...from, chars: { ...from.chars }, log: [...from.log], pops: [...from.pops] };
  while (s.i < SCRIPT.length) {
    const st = SCRIPT[s.i];
    switch (st.kind) {
      case 'label':
        s.i++;
        break;
      case 'bg':
        s.bg = st.bg;
        s.i++;
        break;
      case 'show':
        for (const [id, [e, p]] of Object.entries(st.chars) as [CharId, [Expr, Pos]][]) s.chars[id] = { e, p };
        s.i++;
        break;
      case 'hide':
        s.chars = {};
        s.i++;
        break;
      case 'pts':
        addPts(s, st.k, st.r);
        s.i++;
        break;
      case 'go':
        s.i = LABEL_INDEX[st.to];
        break;
      case 'branch':
        s.i = LABEL_INDEX[st.pick(s)];
        break;
      case 'say': {
        const c = st.who ? s.chars[st.who] : undefined;
        if (st.who && c && st.e) s.chars[st.who] = { ...c, e: st.e };
        pushLog(s, { step: s.i });
        return s;
      }
      default:
        return s;
    }
  }
  return s;
}

function newGame(name: string): GameState {
  return settle({ i: 0, name, k: 0, r: 0, cake: {}, cakeScore: 0, cakeStars: 0, bg: null, chars: {}, log: [], pops: [], popSeq: 0 });
}

export function reducer(s: GameState | null, a: Action): GameState | null {
  if (a.type === 'new') return newGame(a.name);
  // saves from before cakeStars existed count as a decent two-star cake
  if (a.type === 'load') return { ...a.save, cakeStars: a.save.cakeStars ?? 2, pops: [], popSeq: 0 };
  if (a.type === 'quit' || !s) return null;

  const st = stepAt(s);
  switch (a.type) {
    case 'next':
      return st?.kind === 'say' ? settle({ ...s, i: s.i + 1 }) : s;
    case 'choose': {
      if (st?.kind !== 'choice') return s;
      const o = st.options[a.opt];
      const n: GameState = { ...s, log: [...s.log], pops: [...s.pops] };
      pushLog(n, { step: s.i, opt: a.opt });
      addPts(n, o.k ?? 0, o.r ?? 0);
      n.i = o.go ? LABEL_INDEX[o.go] : s.i + 1;
      return settle(n);
    }
    case 'cakePick':
      return { ...s, cake: { ...s.cake, [a.part]: a.id } };
    case 'cakeDone': {
      if (st?.kind !== 'cake') return s;
      const n: GameState = { ...s, cakeScore: cakeScore(s.cake), cakeStars: a.stars, i: s.i + 1, pops: [...s.pops] };
      // a three-star cake impresses Rintaro
      if (a.stars >= 3) addPts(n, 0, 1);
      return settle(n);
    }
    case 'popDone':
      return { ...s, pops: s.pops.filter(p => p.id !== a.id) };
  }
}

/** Fills {name} / {cakeName} placeholders. */
export function fill(text: string, s: GameState, lang: Lang) {
  return text.replaceAll('{name}', s.name).replaceAll('{cakeName}', cakeName(s.cake, lang));
}

/* ---------- saving ---------- */

const SAVE_KEY = 'kaoru-vn-save';
const END_KEY = 'kaoru-vn-endings';
// Bump whenever SCRIPT changes shape, so stale saves don't point at the wrong lines.
const SAVE_VERSION = 3;

export type SaveData = Omit<GameState, 'pops' | 'popSeq'>;

export function writeSave(s: GameState) {
  const { pops: _p, popSeq: _q, ...data } = s;
  storage.set(SAVE_KEY, { v: SAVE_VERSION, data });
}

export function readSave(): SaveData | null {
  const raw = storage.get<{ v: number; data: SaveData }>(SAVE_KEY);
  return raw?.v === SAVE_VERSION ? raw.data : null;
}

export const clearSave = () => storage.del(SAVE_KEY);

export const readEndings = () => storage.get<EndingId[]>(END_KEY) ?? [];

export function recordEnding(id: EndingId) {
  const got = readEndings();
  if (!got.includes(id)) storage.set(END_KEY, [...got, id]);
}
