import type { Lang, T } from './types';

export type CakePart = 'base' | 'cream' | 'top';
export type CakeChoice = Partial<Record<CakePart, string>>;

export interface CakeItem {
  id: string;
  name: T;
  /** How the item reads inside an English sentence ("strawberries", "fresh cream"). */
  phrase: string;
  color?: string;
}

export const CAKE: Record<CakePart, { items: CakeItem[] }> = {
  base: {
    items: [
      { id: 'vanilla', name: { ko: '바닐라', en: 'Vanilla' }, phrase: 'vanilla', color: '#ffe3a3' },
      { id: 'choco', name: { ko: '초코', en: 'Chocolate' }, phrase: 'chocolate', color: '#8a5a44' },
      { id: 'matcha', name: { ko: '말차', en: 'Matcha' }, phrase: 'matcha', color: '#b5d39a' },
    ],
  },
  cream: {
    items: [
      { id: 'fresh', name: { ko: '생크림', en: 'Fresh cream' }, phrase: 'fresh cream', color: '#fffdf7' },
      { id: 'chococream', name: { ko: '초코 크림', en: 'Choco cream' }, phrase: 'chocolate cream', color: '#b77b5f' },
      { id: 'berrycream', name: { ko: '딸기 크림', en: 'Berry cream' }, phrase: 'strawberry cream', color: '#ffc8d6' },
    ],
  },
  top: {
    items: [
      { id: 'strawberry', name: { ko: '딸기', en: 'Strawberry' }, phrase: 'strawberries' },
      { id: 'blueberry', name: { ko: '블루베리', en: 'Blueberry' }, phrase: 'blueberries' },
      { id: 'macaron', name: { ko: '마카롱', en: 'Macaron' }, phrase: 'macarons' },
      { id: 'chocolate', name: { ko: '초콜릿', en: 'Chocolate' }, phrase: 'chocolate' },
    ],
  },
};

/** Kaoruko's favourite — hinted at in the dialogue before the cake builder. */
export const FAV: Required<CakeChoice> = { base: 'vanilla', cream: 'fresh', top: 'strawberry' };

export const cakeItem = (part: CakePart, id: string | undefined) => CAKE[part].items.find(it => it.id === id);

/* ---------- the cake-making minigame ---------- */

/** How the sponge came out of the oven, from how far the doneness needle (0–1) got. */
export type Bake = 'raw' | 'good' | 'perfect' | 'burnt';
export const BAKE_ZONES = { raw: 0.5, perfectFrom: 0.6, perfectTo: 0.74, burnt: 0.84 };
export function bakeResult(d: number): Bake {
  if (d < BAKE_ZONES.raw) return 'raw';
  if (d > BAKE_ZONES.burnt) return 'burnt';
  return d >= BAKE_ZONES.perfectFrom && d <= BAKE_ZONES.perfectTo ? 'perfect' : 'good';
}

/** How the cream went on; f is how much was spread, where 1 is exactly enough. */
export type Frost = 'thin' | 'ok' | 'perfect' | 'messy';
export const FROST_ZONES = { thin: 0.6, perfect: 0.85, max: 1.3 };
export function frostResult(f: number): Frost {
  if (f < FROST_ZONES.thin) return 'thin';
  if (f < FROST_ZONES.perfect) return 'ok';
  return f <= 1 ? 'perfect' : 'messy';
}

/** Something placed on top of the cake, in the cake picture's coordinates. */
export interface Decor {
  id: string;
  x: number;
  y: number;
}
/** Piped cream swirls: pure decoration, they don't count as a topping. */
export const ROSETTE = 'rosette';
export const MAX_DECOR = 8;

/** The topping used most is what the cake is "topped with" (ties go to the one placed first). */
export function mainTopping(decor: Decor[]) {
  const count = new Map<string, number>();
  for (const d of decor) if (d.id !== ROSETTE) count.set(d.id, (count.get(d.id) ?? 0) + 1);
  let best: string | undefined;
  for (const [id, n] of count) if (!best || n > count.get(best)!) best = id;
  return best;
}

const CRAFT_PTS: Record<Bake | Frost, number> = { perfect: 2, good: 1, ok: 1, messy: 1, raw: 0, burnt: 0, thin: 0 };

/** 1–3 stars for how well the cake was made (separate from whether it suits Kaoruko's taste). */
export function cakeStars(bake: Bake, frost: Frost, decor: Decor[]) {
  const pts = CRAFT_PTS[bake] + CRAFT_PTS[frost] + (decor.length >= 3 ? 1 : 0);
  return pts >= 5 ? 3 : pts >= 3 ? 2 : 1;
}

/** Rintaro's reactions while you work. */
export const CAKE_LINES = {
  base: { ko: '와구리 씨가 좋아하는 걸 떠올려 봐.', en: 'Think about what Waguri-san likes.' },
  bake: { ko: '노릇노릇해지는 순간에 꺼내는 거야. 바늘이 금색 칸에 왔을 때!', en: 'Take it out the moment it turns golden — when the needle hits the gold zone!' },
  cream: { ko: '크림을 고르고 버튼을 꾹 누르고 있으면 돌려 가며 발라져. 표시된 칸에서 떼!', en: 'Pick a cream, then hold the button to spread it as the cake turns. Let go in the marked zone!' },
  decor: { ko: '윗면을 눌러서 토핑을 올려 봐. 섞어도 돼.', en: 'Tap the top of the cake to place toppings. Mixing is fine.' },
  raw: { ko: '조금만 더 구웠으면 좋았을 텐데… 괜찮아, 크림으로 커버하자.', en: 'Could’ve used a little longer… It’s fine, the cream will cover it.' },
  good: { ko: '응, 잘 구워졌어.', en: 'Yep, that’s nicely baked.' },
  perfect: { ko: '오… 색 진짜 예쁘다. 재능 있는데?', en: 'Whoa… look at that colour. You’ve got talent.' },
  burnt: { ko: '…바닥만 살짝 깎아 내면 돼. 진짜야.', en: '…We’ll just trim the bottom. Really, it’s fine.' },
  thin: { ko: '아직 시트가 보여. 조금 더 발라도 돼.', en: 'I can still see the sponge. You can add more.' },
  ok: { ko: '조금만 더 바르면 딱일 것 같은데.', en: 'A little more and it’ll be just right.' },
  smooth: { ko: '완벽해. 엄청 매끈하다.', en: 'Perfect. Super smooth.' },
  messy: { ko: '하하… 넘쳤네. 그래도 맛있어 보여.', en: 'Haha… it overflowed. Still looks tasty, though.' },
  star1: { ko: '괜찮아, 처음이잖아. 실수는 누구나 해. 다음엔 더 잘하자!', en: 'It’s okay, it’s your first time. We all make mistakes. Let’s do better next time!' },
  star2: { ko: '꽤 좋은데? 조금만 더 연습하면 완벽하겠어. 와구리 씨한테 가져가자.', en: 'Pretty good! A bit more practice and it’ll be perfect. Let’s take it to Waguri-san.' },
  star3: { ko: '…대단하다. 이건 가게에 내놔도 되겠어.', en: '…That’s amazing. We could sell this in the shop.' },
} satisfies Record<string, T>;

export const BAKE_TXT: Record<Bake, T> = {
  raw: { ko: '덜 익었어요', en: 'A bit underbaked' },
  good: { ko: '잘 구워졌어요', en: 'Nicely baked' },
  perfect: { ko: '완벽한 황금빛!', en: 'Perfectly golden!' },
  burnt: { ko: '앗, 탔어요…', en: 'Oops, it burnt…' },
};
export const FROST_TXT: Record<Frost, T> = {
  thin: { ko: '크림이 모자라요', en: 'Not enough cream' },
  ok: { ko: '조금 얇아요', en: 'A little thin' },
  perfect: { ko: '매끈하게 완벽!', en: 'Silky smooth!' },
  messy: { ko: '크림이 흘러넘쳤어요!', en: 'Cream everywhere!' },
};

export function cakeScore(c: CakeChoice) {
  return (Object.keys(FAV) as CakePart[]).filter(p => c[p] === FAV[p]).length;
}

/** Picks 을/를 based on whether the last syllable has a final consonant. */
function objParticle(word: string) {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  return code >= 0 && code <= 11171 && code % 28 !== 0 ? '을' : '를';
}

export function cakeName(c: CakeChoice, lang: Lang) {
  const base = cakeItem('base', c.base), cream = cakeItem('cream', c.cream), top = cakeItem('top', c.top);
  if (!base || !cream || !top) return lang === 'ko' ? '케이크' : 'a cake';
  if (lang === 'en') return `a ${base.phrase} sponge cake with ${cream.phrase} and ${top.phrase} on top`;
  const cr = cream.name.ko, tp = top.name.ko;
  return `${base.name.ko} 시트에 ${cr}${objParticle(cr)} 바르고 ${tp}${objParticle(tp)} 올린 케이크`;
}
