# 향기로운 케이크 가게 · The Fragrant Cake Shop

「향기로운 꽃은 늠름하게 핀다」 비공식 팬메이드 비주얼 노벨 (한국어 / English).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build → dist/
```

## Where things live

| Path | What |
|---|---|
| `src/story/chapter1.ts` | The script — every line in `ko` + `en`, choices, branches, endings |
| `src/story/cake.ts` | Cake builder ingredients and Kaoruko's favourite |
| `src/story/cast.ts` | Character names/colours and ending texts |
| `src/engine/game.ts` | Story engine (reducer), saving, endings |
| `src/characters/` | SVG sprites — blinking, talking mouth, breathing, poses (in dev, open `#sprites` to see every expression) |
| `src/backgrounds/` | SVG scenes (shop exterior & interior, the street by day and at sunset; in dev, open `#bg=streetDay` etc. to see one) |
| `src/audio/` | Web Audio synth: original BGM (`tracks.ts`) and sound effects — no audio files |
| `src/components/` | Dialogue box, choices, the cake minigame (sponge → bake → cream → decorate → serve; in dev, open `#cake` to play it alone), screens |
| `src/i18n.tsx` | UI strings and the language switch |
| `legacy/index.html` | The original single-file draft |

## Writing story

Lines are written with small helpers in `chapter1.ts`:

```ts
K('happy', '한국어 대사', 'English line'),        // Kaoruko speaks (expression, ko, en)
R('blush', '…', '…'),                              // Rintaro speaks
N('나레이션', 'Narration'),                          // narration
Q({ ko: '질문', en: 'Question' }, [opt('선택지', 'Option', 'someLabel', { k: 1 })]),
```

Jump targets must be added to the `LABELS` list at the top of the file — a typo becomes a type error.
`{name}` and `{cakeName}` are filled in automatically.
