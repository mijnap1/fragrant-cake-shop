import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { audio } from '../audio/audio';
import { useLang, type UIKey } from '../i18n';
import {
  BAKE_TXT,
  BAKE_ZONES,
  CAKE,
  CAKE_LINES,
  FROST_TXT,
  FROST_ZONES,
  MAX_DECOR,
  ROSETTE,
  bakeResult,
  cakeItem,
  cakeStars,
  frostResult,
  mainTopping,
  type Bake,
  type CakeChoice,
  type CakePart,
  type Decor,
} from '../story/cake';
import type { T } from '../story/types';
import { Cake, Topping } from './Cake';
import { Modal } from './Modal';

interface Props {
  choice: CakeChoice;
  onPick: (part: CakePart, id: string) => void;
  /** Finishes the cake with its 1–3 star craft rating. */
  onDone: (stars: number) => void;
}

const STEPS: UIKey[] = ['cakeStepBase', 'cakeStepBake', 'cakeStepCream', 'cakeStepDecor', 'cakeStepServe'];
const NUMS = ['①', '②', '③', '④', '⑤'];
const BAKE_SECONDS = 3.2;
/** Cream spread per second while the button is held. */
const FROST_RATE = 0.42;

/** A horizontal gauge split into coloured zones, with a needle at `value`. */
function Gauge({ value, max, zones, marks }: { value: number; max: number; zones: [number, string][]; marks: [number, string][] }) {
  let from = 0;
  return (
    <div className="gauge-wrap">
      <div className="gauge">
        {zones.map(([to, kind]) => {
          const z = <div key={kind + to} className={`zone ${kind}`} style={{ left: `${(from / max) * 100}%`, width: `${((to - from) / max) * 100}%` }} />;
          from = to;
          return z;
        })}
        <div className="needle" style={{ left: `${(Math.min(value, max) / max) * 100}%` }} />
      </div>
      <div className="gauge-marks">
        {marks.map(([at, text]) => (
          <span key={text} style={{ left: `${(at / max) * 100}%` }}>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

export function CakeBuilder({ choice, onPick, onDone }: Props) {
  const { t, tr } = useLang();
  const [step, setStep] = useState(0);

  // ② bake: doneness climbs while the oven is on; taking it out locks the result.
  const [done, setDone] = useState<number>();
  const [bake, setBake] = useState<Bake>();
  const ovenStart = useRef(0);
  const baking = done !== undefined && !bake;
  useEffect(() => {
    if (!baking) return;
    let raf = 0;
    const tick = (now: number) => {
      const d = Math.min(1, (now - ovenStart.current) / (BAKE_SECONDS * 1000));
      setDone(d);
      if (d >= 1) {
        setBake('burnt');
        audio.sfx('click');
      } else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [baking]);
  const startOven = () => {
    ovenStart.current = performance.now();
    setDone(0);
    audio.sfx('whoosh');
  };
  const takeOut = () => {
    const b = bakeResult(done ?? 0);
    setBake(b);
    audio.sfx(b === 'perfect' ? 'heart' : 'pick');
  };

  // ③ cream: holding the button spreads cream; you can add more but never take it back.
  const [frost, setFrost] = useState(0);
  const [holding, setHolding] = useState(false);
  useEffect(() => {
    if (!holding) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const add = ((now - last) / 1000) * FROST_RATE;
      last = now;
      setFrost(f => Math.min(FROST_ZONES.max, f + add));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [holding]);
  useEffect(() => {
    if (frost >= FROST_ZONES.max) setHolding(false);
  }, [frost]);
  const hold = (on: boolean) => {
    if (on === holding) return;
    if (on && frost >= FROST_ZONES.max) return;
    setHolding(on);
    if (!on && frost > 0) audio.sfx(frostResult(frost) === 'perfect' ? 'heart' : 'click');
  };
  const holdKey = (on: boolean) => (e: KeyboardEvent) => {
    if (e.key !== ' ' && e.key !== 'Enter') return;
    e.preventDefault();
    if (!e.repeat) hold(on);
  };
  const frostRes = frost > 0 && !holding ? frostResult(frost) : undefined;

  // ④ decorate: tap the top of the cake to place the selected topping.
  const [decor, setDecor] = useState<Decor[]>([]);
  const [tool, setTool] = useState('strawberry');
  const changeDecor = (next: Decor[]) => {
    setDecor(next);
    const main = mainTopping(next);
    if (main && main !== choice.top) onPick('top', main);
  };
  const place = (x: number, y: number) => {
    if (decor.length >= MAX_DECOR) return;
    changeDecor([...decor, { id: tool, x, y }]);
    audio.sfx('pick');
  };

  const pick = (part: CakePart, id: string) => {
    audio.sfx('pick');
    onPick(part, id);
  };

  const stars = bake && frostRes ? cakeStars(bake, frostRes, decor) : 1;
  const canNext = [!!choice.base, !!bake, !!choice.cream && !!frostRes, !!mainTopping(decor)][step];
  const next = () => {
    audio.sfx(step === 3 ? 'fanfare' : 'select');
    setStep(step + 1);
  };

  const line: T =
    step === 0
      ? CAKE_LINES.base
      : step === 1
        ? bake
          ? CAKE_LINES[bake]
          : CAKE_LINES.bake
        : step === 2
          ? frostRes
            ? CAKE_LINES[frostRes === 'perfect' ? 'smooth' : frostRes]
            : CAKE_LINES.cream
          : step === 3
            ? CAKE_LINES.decor
            : CAKE_LINES[`star${stars}` as 'star1' | 'star2' | 'star3'];

  const status =
    step === 0
      ? choice.base
        ? `${tr(cakeItem('base', choice.base)!.name)} ${t('cakeStepBase')}`
        : t('cakeEmpty')
      : step === 1
        ? bake
          ? tr(BAKE_TXT[bake])
          : baking
            ? t('cakeBaking')
            : ''
        : step === 2
          ? frostRes
            ? tr(FROST_TXT[frostRes])
            : ''
          : step === 3
            ? `${t('cakePlaced')} ${decor.length} / ${MAX_DECOR}`
            : '★'.repeat(stars) + '☆'.repeat(3 - stars);

  return (
    <Modal className="cake-card">
      <h2>{t('cakeTitle')}</h2>
      <ol className="cake-steps">
        {STEPS.map((k, i) => (
          <li key={k} className={i === step ? 'on' : i < step ? 'past' : ''}>
            <span>{i < step ? '✓' : NUMS[i]}</span>
            {t(k)}
          </li>
        ))}
      </ol>

      <div className={`preview${baking ? ' oven' : ''}${step === 4 ? ' served' : ''}`}>
        <motion.div
          key={`${choice.base}|${choice.cream}|${decor.length}|${bake}|${step}`}
          className={`preview-cake${holding ? ' spin' : ''}${step === 3 ? ' placing' : ''}`}
          initial={{ y: 0 }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 0.35 }}
        >
          <Cake
            choice={step < 2 ? { base: choice.base } : step === 2 ? { base: choice.base, cream: choice.cream } : choice}
            done={step >= 1 ? (done ?? 0) : undefined}
            frost={step >= 2 ? frost : undefined}
            decor={step >= 2 ? decor : undefined}
            onPlace={step === 3 ? place : undefined}
          />
        </motion.div>
        <div className={`cake-label${step === 4 ? ' stars' : ''}`}>{status}</div>
      </div>

      <div className="cake-panel">
        <h3>
          {NUMS[step]} {t(STEPS[step])}
        </h3>

        {step === 0 && (
          <div className="chips">
            {CAKE.base.items.map(it => (
              <button key={it.id} className={`chip${choice.base === it.id ? ' on' : ''}`} onClick={() => pick('base', it.id)}>
                <span className="sw" style={{ background: it.color }} />
                {tr(it.name)}
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <>
            <Gauge
              value={done ?? 0}
              max={1}
              zones={[
                [BAKE_ZONES.raw, 'raw'],
                [BAKE_ZONES.perfectFrom, 'good'],
                [BAKE_ZONES.perfectTo, 'best'],
                [BAKE_ZONES.burnt, 'good'],
                [1, 'burnt'],
              ]}
              marks={[
                [BAKE_ZONES.raw / 2, t('cakeRaw')],
                [(BAKE_ZONES.perfectFrom + BAKE_ZONES.perfectTo) / 2, t('cakeGolden')],
                [(BAKE_ZONES.burnt + 1) / 2, t('cakeBurnt')],
              ]}
            />
            <div className="btns">
              {done === undefined ? (
                <button className="btn" onClick={startOven}>
                  {t('cakeOvenOn')}
                </button>
              ) : (
                <button className="btn" disabled={!!bake} onClick={takeOut}>
                  {t('cakeTakeOut')}
                </button>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="chips">
              {CAKE.cream.items.map(it => (
                <button key={it.id} className={`chip${choice.cream === it.id ? ' on' : ''}`} disabled={frost > 0} onClick={() => pick('cream', it.id)}>
                  <span className="sw" style={{ background: it.color }} />
                  {tr(it.name)}
                </button>
              ))}
            </div>
            <Gauge
              value={frost}
              max={FROST_ZONES.max}
              zones={[
                [FROST_ZONES.thin, 'raw'],
                [FROST_ZONES.perfect, 'good'],
                [1, 'best'],
                [FROST_ZONES.max, 'over'],
              ]}
              marks={[
                [FROST_ZONES.thin / 2, t('cakeThin')],
                [(FROST_ZONES.perfect + 1) / 2, t('cakeJust')],
                [(1 + FROST_ZONES.max) / 2, t('cakeOver')],
              ]}
            />
            <div className="btns">
              <button
                className={`btn hold${holding ? ' on' : ''}`}
                disabled={!choice.cream || frost >= FROST_ZONES.max}
                onPointerDown={e => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  hold(true);
                }}
                onPointerUp={() => hold(false)}
                onPointerCancel={() => hold(false)}
                onKeyDown={holdKey(true)}
                onKeyUp={holdKey(false)}
                onContextMenu={e => e.preventDefault()}
              >
                {t('cakeHold')}
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="chips">
              {[...CAKE.top.items.map(it => ({ id: it.id, name: tr(it.name) })), { id: ROSETTE, name: t('cakeRosette') }].map(it => (
                <button key={it.id} className={`chip${tool === it.id ? ' on' : ''}`} onClick={() => setTool(it.id)}>
                  <svg viewBox="-16 -16 32 32">
                    <Topping id={it.id} x={0} y={0} cream={cakeItem('cream', choice.cream)?.color} />
                  </svg>
                  {it.name}
                </button>
              ))}
            </div>
            <div className="btns small">
              <button className="btn sub" disabled={!decor.length} onClick={() => changeDecor(decor.slice(0, -1))}>
                {t('cakeUndo')}
              </button>
              <button className="btn sub" disabled={!decor.length} onClick={() => changeDecor([])}>
                {t('cakeClear')}
              </button>
            </div>
          </>
        )}

        {step === 4 && bake && frostRes && (
          <ul className="cake-sum">
            <li>
              <span>{t('cakeStepBake')}</span>
              <b>{tr(BAKE_TXT[bake])}</b>
            </li>
            <li>
              <span>{t('cakeStepCream')}</span>
              <b>{tr(FROST_TXT[frostRes])}</b>
            </li>
            <li>
              <span>{t('cakeStepDecor')}</span>
              <b>× {decor.length}</b>
            </li>
            {stars === 3 && <li className="impressed">💗 {t('cakeImpressed')}</li>}
          </ul>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={tr(line)} className="tip" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            💡 {t('cakeRintaro')}: “{tr(line)}”
          </motion.div>
        </AnimatePresence>

        <div className="btns">
          {step < 4 ? (
            <button className="btn" disabled={!canNext || holding} onClick={next}>
              {t('cakeNext')}
            </button>
          ) : (
            <button className="btn" onClick={() => onDone(stars)}>
              {t('cakeServe')}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
