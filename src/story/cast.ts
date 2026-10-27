import type { CharId, EndingId, T } from './types';

export const CAST: Record<CharId, { name: T; color: string }> = {
  rin: { name: { ko: '린타로', en: 'Rintaro' }, color: '#e0a93b' },
  kao: { name: { ko: '카오루코', en: 'Kaoruko' }, color: '#ec7fa0' },
};

export const ENDINGS: Record<EndingId, { emoji: string; title: T; desc: T }> = {
  best: {
    emoji: '🌸',
    title: { ko: '늠름하게 핀 꽃', en: 'A Flower in Full Bloom' },
    desc: {
      ko: '두 사람의 마음을 케이크로 이어 준 최고의 첫날.\n당신은 이제 이 가게의 소중한 동료예요.',
      en: 'A perfect first day — you brought two hearts closer with cake.\nYou’re now a treasured member of the shop.',
    },
  },
  good: {
    emoji: '🍰',
    title: { ko: '달콤한 하루', en: 'A Sweet Day' },
    desc: {
      ko: '맛있는 케이크와 따뜻한 대화가 있던 하루.\n내일은 또 어떤 손님이 찾아올까요?',
      en: 'A day of delicious cake and warm conversation.\nWho will walk through the door tomorrow?',
    },
  },
  sweet: {
    emoji: '🍓',
    title: { ko: '조금 서툰 첫날', en: 'A Clumsy First Day' },
    desc: {
      ko: '조금 서툴렀지만, 그래도 달콤했던 첫날.\n다음엔 분명 더 잘할 수 있을 거예요.',
      en: 'A little clumsy, but still sweet.\nYou’ll do even better next time — for sure.',
    },
  },
};
