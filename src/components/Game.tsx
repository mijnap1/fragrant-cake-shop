import { useCallback, useEffect, useRef, useState, type Dispatch, type MouseEvent } from 'react';
import { AnimatePresence } from 'motion/react';
import { audio } from '../audio/audio';
import { Background } from '../backgrounds/Background';
import { CharacterSprite } from '../characters/CharacterSprite';
import { fill, stepAt, type Action, type GameState } from '../engine/game';
import { useTypewriter } from '../engine/useTypewriter';
import { useLang } from '../i18n';
import { SCRIPT } from '../story/chapter1';
import type { CharId } from '../story/types';
import { CakeBuilder } from './CakeBuilder';
import { Choices } from './Choices';
import { DialogueBox } from './DialogueBox';
import { Pops } from './Pops';
import { Backlog, EndingScreen } from './Screens';
import { SoundIcon } from './SoundIcon';

interface Props {
  game: GameState;
  dispatch: Dispatch<Action>;
  cps: number;
  /** A modal owned by the parent (settings) is open. */
  paused: boolean;
  blips: boolean;
  muted: boolean;
  onToggleMute: () => void;
  onSettings: () => void;
  onTitle: () => void;
}

const sayAt = (i: number | undefined) => {
  const st = i === undefined ? undefined : SCRIPT[i];
  return st?.kind === 'say' ? st : null;
};

export function Game({ game, dispatch, cps, paused, blips, muted, onToggleMute, onSettings, onTitle }: Props) {
  const { lang, t, tr } = useLang();
  const [logOpen, setLogOpen] = useState(false);
  const [auto, setAuto] = useState(false);
  const step = stepAt(game);

  // A choice with no prompt keeps the previous line on screen.
  const prompt = step?.kind === 'choice' ? step.prompt : undefined;
  const lastLog = game.log.at(-1);
  const lineIndex = step?.kind === 'say' ? game.i : step?.kind === 'choice' && !prompt && lastLog?.opt === undefined ? lastLog?.step : undefined;
  const line = sayAt(lineIndex);
  const who = prompt ? null : (line?.who ?? null);
  const text = fill(prompt ? tr(prompt) : line ? tr(line.text) : '', game, lang);
  const tw = useTypewriter(text, cps, `${prompt ? game.i : lineIndex}-${lang}`);

  const busy = paused || logOpen || step?.kind !== 'say';

  const advance = useCallback(() => {
    if (busy) return;
    if (!tw.done) tw.finish();
    else {
      audio.sfx('click');
      dispatch({ type: 'next' });
    }
  }, [busy, tw, dispatch]);

  const advanceRef = useRef(advance);
  useEffect(() => {
    advanceRef.current = advance;
  }, [advance]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === ' ' || e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        advanceRef.current();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!auto || busy || !tw.done) return;
    const id = window.setTimeout(() => dispatch({ type: 'next' }), 1200 + text.length * 30);
    return () => window.clearTimeout(id);
  }, [auto, busy, tw.done, text, dispatch]);

  // Sound cues tied to story progress. The ref keeps StrictMode's double effects from replaying them.
  const cued = useRef({ i: -1, bg: game.bg, popSeq: game.popSeq });
  useEffect(() => {
    const c = cued.current;
    if (c.i !== game.i) {
      c.i = game.i;
      if (step?.kind === 'say' && step.sfx) audio.sfx(step.sfx);
      if (step?.kind === 'ending') audio.sfx('ending');
    }
    if (c.bg !== game.bg) {
      if (c.bg) audio.sfx('whoosh');
      c.bg = game.bg;
    }
    if (game.popSeq > c.popSeq) audio.sfx('heart');
    c.popSeq = game.popSeq;
  }, [game.i, game.bg, game.popSeq, step]);

  const shown = tw.shown.length;
  const typingSay = step?.kind === 'say' && !tw.done;
  useEffect(() => {
    if (blips && who && typingSay && shown > 0 && shown % 3 === 0) audio.blip(who);
  }, [shown, blips, who, typingSay]);

  const onPopDone = useCallback((id: number) => dispatch({ type: 'popDone', id }), [dispatch]);

  const showBox = step?.kind === 'say' || step?.kind === 'choice';
  const hud = (fn: () => void) => (e: MouseEvent) => {
    e.stopPropagation();
    fn();
  };

  return (
    <div className="game" onClick={advance}>
      <Background id={game.bg} />

      <div className="chars">
        <AnimatePresence>
          {(Object.entries(game.chars) as [CharId, NonNullable<GameState['chars'][CharId]>][]).map(([id, c]) => (
            <CharacterSprite
              key={id}
              id={id}
              e={c.e}
              pos={c.p}
              dim={!!who && who !== id}
              talking={step?.kind === 'say' && who === id && !tw.done}
            />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>{showBox && <DialogueBox who={who} text={tw.shown} done={tw.done} showNext={step?.kind === 'say'} />}</AnimatePresence>

      <AnimatePresence>
        {step?.kind === 'choice' && (
          <Choices
            key={game.i}
            options={step.options.map(o => fill(tr(o.text), game, lang))}
            onPick={opt => {
              audio.sfx('select');
              dispatch({ type: 'choose', opt });
            }}
          />
        )}
      </AnimatePresence>

      <div className="hud">
        <button className="hbtn" onClick={hud(() => setLogOpen(true))}>
          {t('log')}
        </button>
        <button className={`hbtn${auto ? ' on' : ''}`} onClick={hud(() => setAuto(a => !a))}>
          {t('auto')}
        </button>
        <button className="hbtn hbtn-icon" aria-label={t('sound')} aria-pressed={!muted} onClick={hud(onToggleMute)}>
          <SoundIcon muted={muted} />
        </button>
        <button className="hbtn" onClick={hud(onSettings)}>
          {t('settings')}
        </button>
        <button className="hbtn" onClick={hud(onTitle)}>
          {t('toTitle')}
        </button>
      </div>

      <Pops pops={game.pops} onDone={onPopDone} />

      <AnimatePresence>
        {step?.kind === 'cake' && (
          <CakeBuilder
            choice={game.cake}
            onPick={(part, id) => dispatch({ type: 'cakePick', part, id })}
            onDone={stars => {
              audio.sfx('fanfare');
              dispatch({ type: 'cakeDone', stars });
            }}
          />
        )}
        {step?.kind === 'ending' && (
          <EndingScreen id={step.id} game={game} onAgain={() => dispatch({ type: 'new', name: game.name })} onTitle={onTitle} />
        )}
        {logOpen && <Backlog game={game} onClose={() => setLogOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
