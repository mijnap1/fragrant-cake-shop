import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { storage } from './engine/storage';
import type { Lang, T } from './story/types';

const UI = {
  ribbon: { ko: '팬메이드 비주얼 노벨', en: 'Fan-made Visual Novel', ja: 'ファンメイド・ビジュアルノベル' },
  titleTop: { ko: '향기로운', en: 'The Fragrant', ja: '薫る' },
  titleBottom: { ko: '케이크 가게', en: 'Cake Shop', ja: 'ケーキ屋さん' },
  subtitle: { ko: '― 「향기로운 꽃은 늠름하게 핀다」 팬 에피소드 ―', en: '― A fan episode of “The Fragrant Flower Blooms with Dignity” ―', ja: '― 『薫る花は凛と咲く』 ファンエピソード ―' },
  start: { ko: '시작하기', en: 'New Game', ja: 'はじめから' },
  continue: { ko: '이어하기', en: 'Continue', ja: 'つづきから' },
  endings: { ko: '엔딩', en: 'Endings', ja: 'エンディング' },
  note: { ko: '비공식 팬 작품 · v0.2', en: 'Unofficial fan work · v0.2', ja: '非公式ファン作品 · v0.2' },

  nameTitle: { ko: '처음 뵙겠습니다! 🍓', en: 'Nice to meet you! 🍓', ja: 'はじめまして！ 🍓' },
  nameBody: { ko: '오늘부터 케이크 가게에서\n아르바이트를 하게 된 당신의 이름은?', en: 'Today is your first day working\nat the cake shop. What’s your name?', ja: '今日からケーキ屋さんで\nアルバイトを始めるあなたの名前は？' },
  namePlaceholder: { ko: '하나', en: 'Hana', ja: 'はな' },
  nameOk: { ko: '결정!', en: 'Let’s go!', ja: '決定！' },

  log: { ko: '기록', en: 'Log', ja: 'ログ' },
  auto: { ko: '자동', en: 'Auto', ja: 'オート' },
  settings: { ko: '설정', en: 'Settings', ja: '設定' },
  toTitle: { ko: '타이틀', en: 'Title', ja: 'タイトル' },
  logTitle: { ko: '📖 대화 기록', en: '📖 Backlog', ja: '📖 会話ログ' },
  close: { ko: '닫기', en: 'Close', ja: '閉じる' },

  settingsTitle: { ko: '⚙️ 설정', en: '⚙️ Settings', ja: '⚙️ 設定' },
  language: { ko: '언어', en: 'Language', ja: '言語' },
  textSpeed: { ko: '글자 속도', en: 'Text speed', ja: '文字の速さ' },
  slow: { ko: '느리게', en: 'Slow', ja: '遅い' },
  normal: { ko: '보통', en: 'Normal', ja: 'ふつう' },
  fast: { ko: '빠르게', en: 'Fast', ja: '速い' },
  music: { ko: '배경음악', en: 'Music', ja: 'BGM' },
  sfx: { ko: '효과음', en: 'Sound effects', ja: '効果音' },
  blips: { ko: '글자 소리', en: 'Text blips', ja: '文字音' },
  on: { ko: '켜기', en: 'On', ja: 'オン' },
  off: { ko: '끄기', en: 'Off', ja: 'オフ' },
  sound: { ko: '소리', en: 'Sound', ja: 'サウンド' },

  cakeTitle: { ko: '🎂 첫 케이크 만들기', en: '🎂 Your First Cake', ja: '🎂 はじめてのケーキ作り' },
  cakeStepBase: { ko: '시트', en: 'Sponge', ja: 'スポンジ' },
  cakeStepBake: { ko: '굽기', en: 'Bake', ja: '焼く' },
  cakeStepCream: { ko: '크림', en: 'Cream', ja: 'クリーム' },
  cakeStepDecor: { ko: '데코', en: 'Decorate', ja: 'デコ' },
  cakeStepServe: { ko: '완성', en: 'Serve', ja: '完成' },
  cakeEmpty: { ko: '시트를 골라 주세요', en: 'Pick a sponge', ja: 'スポンジを選んでね' },
  cakeRintaro: { ko: '린타로', en: 'Rintaro', ja: '凛太郎' },
  cakeNext: { ko: '다음', en: 'Next', ja: '次へ' },
  cakeOvenOn: { ko: '🔥 오븐 켜기', en: '🔥 Start the oven', ja: '🔥 オーブンをつける' },
  cakeTakeOut: { ko: '꺼내기!', en: 'Take it out!', ja: '取り出す！' },
  cakeBaking: { ko: '굽는 중…', en: 'Baking…', ja: '焼いてるところ…' },
  cakeRaw: { ko: '덜 익음', en: 'Raw', ja: '生焼け' },
  cakeGolden: { ko: '딱 좋아!', en: 'Golden!', ja: 'ちょうどいい！' },
  cakeBurnt: { ko: '탐', en: 'Burnt', ja: '焦げ' },
  cakeHold: { ko: '꾹 눌러서 크림 바르기', en: 'Hold to spread the cream', ja: '長押しでクリームを塗る' },
  cakeThin: { ko: '부족', en: 'Thin', ja: '少ない' },
  cakeJust: { ko: '딱!', en: 'Just right', ja: 'ぴったり！' },
  cakeOver: { ko: '넘침', en: 'Overflow', ja: 'あふれる' },
  cakePlaced: { ko: '올린 개수', en: 'Placed', ja: 'のせた数' },
  cakeRosette: { ko: '크림 장식', en: 'Rosette', ja: 'クリーム絞り' },
  cakeUndo: { ko: '되돌리기', en: 'Undo', ja: 'ひとつ戻す' },
  cakeClear: { ko: '모두 치우기', en: 'Clear', ja: '全部どける' },
  cakeServe: { ko: '와구리 씨에게 대접하기!', en: 'Serve it to Waguri-san!', ja: '和栗さんに出す！' },
  cakeImpressed: { ko: '린타로가 감탄했다!', en: 'Rintaro is impressed!', ja: '凛太郎が感心した！' },

  again: { ko: '처음부터 다시', en: 'Play again', ja: 'はじめからもう一度' },
  backTitle: { ko: '타이틀로', en: 'Back to title', ja: 'タイトルへ' },
} satisfies Record<string, T>;

export type UIKey = keyof typeof UI;

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: UIKey) => string;
  tr: (text: T) => string;
}

const Ctx = createContext<LangCtx | null>(null);
const LANG_KEY = 'kaoru-vn-lang';

function initialLang(): Lang {
  const saved = storage.get<Lang>(LANG_KEY);
  // English unless the player picked a language before
  return saved === 'ko' || saved === 'en' || saved === 'ja' ? saved : 'en';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    storage.set(LANG_KEY, l);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const value = useMemo<LangCtx>(
    () => ({ lang, setLang, t: key => UI[key][lang], tr: text => text[lang] }),
    [lang, setLang],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLang must be used inside LangProvider');
  return ctx;
}
