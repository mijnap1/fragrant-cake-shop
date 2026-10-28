export type Lang = 'ko' | 'en' | 'ja';
/** A line of text in every supported language. */
export type T = Record<Lang, string>;

export type CharId = 'rin' | 'kao';
export type Expr = 'normal' | 'smile' | 'happy' | 'surprised' | 'blush' | 'troubled';
export type Pos = 'left' | 'center' | 'right';
export type BgId = 'shop' | 'shopFront' | 'street' | 'streetDay';
export type EndingId = 'best' | 'good' | 'sweet';
export type SfxId = 'bell' | 'click' | 'select' | 'heart' | 'pick' | 'fanfare' | 'ending' | 'whoosh';

/** What a branch can look at when deciding where to go. */
export interface BranchCtx {
  k: number;
  r: number;
  cakeScore: number;
  /** 1–3: how well the cake was made in the minigame. */
  cakeStars: number;
}

export interface ChoiceOpt {
  text: T;
  /** Affection gained with Kaoruko / Rintaro. */
  k?: number;
  r?: number;
  go?: string;
}

export type Step =
  | { kind: 'label'; label: string }
  | { kind: 'bg'; bg: BgId }
  | { kind: 'show'; chars: Partial<Record<CharId, [Expr, Pos]>> }
  | { kind: 'hide' }
  | { kind: 'pts'; k: number; r: number }
  | { kind: 'go'; to: string }
  | { kind: 'branch'; pick: (s: BranchCtx) => string }
  | { kind: 'say'; who: CharId | null; e?: Expr; text: T; sfx?: SfxId }
  | { kind: 'choice'; prompt?: T; options: ChoiceOpt[] }
  | { kind: 'cake' }
  | { kind: 'ending'; id: EndingId };
