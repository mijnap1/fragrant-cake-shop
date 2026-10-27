import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { storage } from './engine/storage';
import type { Lang, T } from './story/types';

const UI = {
  ribbon: { ko: '팬메이드 비주얼 노벨', en: 'Fan-made Visual Novel' },
  titleTop: { ko: '향기로운', en: 'The Fragrant' },
  titleBottom: { ko: '케이크 가게', en: 'Cake Shop' },
  subtitle: { ko: '― 「향기로운 꽃은 늠름하게 핀다」 팬 에피소드 ―', en: '― A fan episode of “The Fragrant Flower Blooms with Dignity” ―' },
  start: { ko: '시작하기', en: 'New Game' },
  continue: { ko: '이어하기', en: 'Continue' },
  endings: { ko: '엔딩', en: 'Endings' },
  note: { ko: '비공식 팬 작품 · v0.2', en: 'Unofficial fan work · v0.2' },

  nameTitle: { ko: '처음 뵙겠습니다! 🍓', en: 'Nice to meet you! 🍓' },
  nameBody: { ko: '오늘부터 케이크 가게에서\n아르바이트를 하게 된 당신의 이름은?', en: 'Today is your first day working\nat the cake shop. What’s your name?' },
  namePlaceholder: { ko: '하나', en: 'Hana' },
  nameOk: { ko: '결정!', en: 'Let’s go!' },

  log: { ko: '기록', en: 'Log' },
  auto: { ko: '자동', en: 'Auto' },
  settings: { ko: '설정', en: 'Settings' },
  toTitle: { ko: '타이틀', en: 'Title' },
  logTitle: { ko: '📖 대화 기록', en: '📖 Backlog' },
  close: { ko: '닫기', en: 'Close' },

  settingsTitle: { ko: '⚙️ 설정', en: '⚙️ Settings' },
  language: { ko: '언어', en: 'Language' },
  textSpeed: { ko: '글자 속도', en: 'Text speed' },
  slow: { ko: '느리게', en: 'Slow' },
  normal: { ko: '보통', en: 'Normal' },
  fast: { ko: '빠르게', en: 'Fast' },
  music: { ko: '배경음악', en: 'Music' },
  sfx: { ko: '효과음', en: 'Sound effects' },
  blips: { ko: '글자 소리', en: 'Text blips' },
  on: { ko: '켜기', en: 'On' },
  off: { ko: '끄기', en: 'Off' },
  sound: { ko: '소리', en: 'Sound' },

  cakeTitle: { ko: '🎂 첫 케이크 만들기', en: '🎂 Your First Cake' },
  cakeStepBase: { ko: '시트', en: 'Sponge' },
  cakeStepBake: { ko: '굽기', en: 'Bake' },
  cakeStepCream: { ko: '크림', en: 'Cream' },
  cakeStepDecor: { ko: '데코', en: 'Decorate' },
  cakeStepServe: { ko: '완성', en: 'Serve' },
  cakeEmpty: { ko: '시트를 골라 주세요', en: 'Pick a sponge' },
  cakeRintaro: { ko: '린타로', en: 'Rintaro' },
  cakeNext: { ko: '다음', en: 'Next' },
  cakeOvenOn: { ko: '🔥 오븐 켜기', en: '🔥 Start the oven' },
  cakeTakeOut: { ko: '꺼내기!', en: 'Take it out!' },
  cakeBaking: { ko: '굽는 중…', en: 'Baking…' },
  cakeRaw: { ko: '덜 익음', en: 'Raw' },
  cakeGolden: { ko: '딱 좋아!', en: 'Golden!' },
  cakeBurnt: { ko: '탐', en: 'Burnt' },
  cakeHold: { ko: '꾹 눌러서 크림 바르기', en: 'Hold to spread the cream' },
  cakeThin: { ko: '부족', en: 'Thin' },
  cakeJust: { ko: '딱!', en: 'Just right' },
  cakeOver: { ko: '넘침', en: 'Overflow' },
  cakePlaced: { ko: '올린 개수', en: 'Placed' },
  cakeRosette: { ko: '크림 장식', en: 'Rosette' },
  cakeUndo: { ko: '되돌리기', en: 'Undo' },
  cakeClear: { ko: '모두 치우기', en: 'Clear' },
  cakeServe: { ko: '와구리 씨에게 대접하기!', en: 'Serve it to Waguri-san!' },
  cakeImpressed: { ko: '린타로가 감탄했다!', en: 'Rintaro is impressed!' },

  again: { ko: '처음부터 다시', en: 'Play again' },
  backTitle: { ko: '타이틀로', en: 'Back to title' },
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
  return saved === 'ko' || saved === 'en' ? saved : 'en';
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
