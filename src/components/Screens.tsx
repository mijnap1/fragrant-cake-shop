import { useState } from 'react';
import { useBlink } from '../characters/CharacterSprite';
import { Kaoruko } from '../characters/Kaoruko';
import { Rintaro } from '../characters/Rintaro';
import { motion } from 'motion/react';
import { audio } from '../audio/audio';
import type { SoundSettings } from '../audio/settings';
import { fill, readEndings, type GameState } from '../engine/game';
import { SPEED_CPS, type Speed } from '../engine/settings';
import { useLang } from '../i18n';
import { FAV } from '../story/cake';
import { CAST, ENDINGS } from '../story/cast';
import { SCRIPT } from '../story/chapter1';
import type { EndingId, Lang } from '../story/types';
import { Cake } from './Cake';
import { Modal } from './Modal';
import { SoundIcon } from './SoundIcon';

export function LangToggle() {
  const { lang, setLang } = useLang();
  const opts: [Lang, string][] = [['ko', '한국어'], ['en', 'English']];
  return (
    <div className="seg" role="radiogroup">
      {opts.map(([l, label]) => (
        <button key={l} role="radio" aria-checked={lang === l} className={lang === l ? 'on' : ''} onClick={() => setLang(l)}>
          {label}
        </button>
      ))}
    </div>
  );
}

function EndingBadges({ extra }: { extra?: EndingId }) {
  const { t, tr } = useLang();
  const got = new Set(readEndings());
  if (extra) got.add(extra);
  return (
    <div className="badges">
      {(Object.keys(ENDINGS) as EndingId[]).map(id => (
        <span key={id} className={`badge${got.has(id) ? ' got' : ''}`} title={got.has(id) ? tr(ENDINGS[id].title) : '???'}>
          {ENDINGS[id].emoji}
        </span>
      ))}
      <span>
        {t('endings')} {got.size}/3
      </span>
    </div>
  );
}

interface TitleProps {
  canContinue: boolean;
  muted: boolean;
  onToggleMute: () => void;
  onStart: () => void;
  onContinue: () => void;
}

/** The striped, scalloped awning over the cake shop's window. */
function Awning() {
  return (
    <svg className="awning" viewBox="0 0 1600 92" preserveAspectRatio="xMidYMin slice" aria-hidden>
      {Array.from({ length: 20 }, (_, i) => {
        const x = i * 80;
        const fill = i % 2 ? '#fff7f9' : '#f6a3bf';
        return (
          <g key={i}>
            <path d={`M${x} 58 A40 24 0 0 0 ${x + 80} 58 Z`} fill="rgba(201, 85, 124, 0.16)" transform="translate(0 7)" />
            <rect x={x} y={0} width={80} height={58} fill={fill} />
            <path d={`M${x} 57 A40 24 0 0 0 ${x + 80} 57 Z`} fill={fill} />
          </g>
        );
      })}
      <rect width="1600" height="12" fill="#e7799d" />
      <rect y="12" width="1600" height="3" fill="#fff" opacity="0.5" />
    </svg>
  );
}

/** A little bellflower (桔梗), Kaoruko's school flower. */
const Bellflower = () => (
  <svg className="bellflower" viewBox="-12 -12 24 24" aria-hidden>
    {[0, 72, 144, 216, 288].map(a => (
      <ellipse key={a} cx="0" cy="-6" rx="4.4" ry="6.4" fill="#b7a0e6" transform={`rotate(${a})`} />
    ))}
    <circle r="3" fill="#fff6c9" />
  </svg>
);

/** Soft out-of-focus lights drifting behind the title: [left %, top %, size px, delay s]. */
const BOKEH: [number, number, number, number][] = [
  [8, 30, 90, 0], [20, 70, 60, -3], [33, 22, 40, -6], [70, 18, 70, -2], [84, 62, 110, -5], [92, 26, 46, -8], [56, 80, 54, -4], [44, 48, 30, -7],
];

export function TitleScreen({ canContinue, muted, onToggleMute, onStart, onContinue }: TitleProps) {
  const { t } = useLang();
  const blinkR = useBlink();
  const blinkK = useBlink();
  return (
    <motion.div className="screen title-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="bokeh" aria-hidden>
        {BOKEH.map(([x, y, s, d]) => (
          <span key={`${x}-${y}`} style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, animationDelay: `${d}s` }} />
        ))}
      </div>
      <Awning />
      <motion.div className="title-char rin" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.7 }}>
        <Rintaro e="smile" blink={blinkR} talk={false} />
      </motion.div>
      <motion.div className="title-char kao" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35, duration: 0.7 }}>
        <Kaoruko e="smile" blink={blinkK} talk={false} />
      </motion.div>
      <div className="title-lang">
        <button className="hbtn hbtn-icon" aria-label={t('sound')} aria-pressed={!muted} onClick={onToggleMute}>
          <SoundIcon muted={muted} />
        </button>
        <LangToggle />
      </div>
      <div className="title-wrap">
        <div className="ribbon">{t('ribbon')}</div>
        <h1>
          <span className="t1">{t('titleTop')}</span>
          <span className="t2">{t('titleBottom')}</span>
        </h1>
        <p className="sub-title">
          <Bellflower />
          {t('subtitle')}
          <Bellflower />
        </p>
        <div className="title-cake">
          <span className="sparkle s1">✦</span>
          <span className="sparkle s2">✦</span>
          <span className="sparkle s3">✧</span>
          <Cake choice={FAV} />
        </div>
        <div className="btns">
          <button className="btn" onClick={onStart}>
            {t('start')}
          </button>
          <button className="btn sub" disabled={!canContinue} onClick={onContinue}>
            {t('continue')}
          </button>
        </div>
        <EndingBadges />
        <p className="note">{t('note')}</p>
      </div>
    </motion.div>
  );
}

export function NameScreen({ onOk }: { onOk: (name: string) => void }) {
  const { t } = useLang();
  const [name, setName] = useState('');
  const submit = () => onOk(name.trim() || t('namePlaceholder'));
  return (
    <Modal className="name-card">
      <h2>{t('nameTitle')}</h2>
      <p>{t('nameBody')}</p>
      <input
        className="name-input"
        autoFocus
        maxLength={10}
        placeholder={t('namePlaceholder')}
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && !e.nativeEvent.isComposing && submit()}
      />
      <div className="btns">
        <button className="btn" onClick={submit}>
          {t('nameOk')}
        </button>
      </div>
    </Modal>
  );
}

export function EndingScreen({ id, game, onAgain, onTitle }: { id: EndingId; game: GameState; onAgain: () => void; onTitle: () => void }) {
  const { t, tr } = useLang();
  const e = ENDINGS[id];
  return (
    <Modal className="end-card">
      <div className="ribbon">ENDING</div>
      <div className="end-emoji">{e.emoji}</div>
      <h2>{tr(e.title)}</h2>
      <p>{tr(e.desc)}</p>
      <div className="end-stats">
        💗 {tr(CAST.kao.name)} {game.k} · ⭐ {tr(CAST.rin.name)} {game.r}
      </div>
      <EndingBadges extra={id} />
      <div className="btns">
        <button className="btn" onClick={onAgain}>
          {t('again')}
        </button>
        <button className="btn sub" onClick={onTitle}>
          {t('backTitle')}
        </button>
      </div>
    </Modal>
  );
}

export function Backlog({ game, onClose }: { game: GameState; onClose: () => void }) {
  const { t, tr, lang } = useLang();
  return (
    <Modal className="log-card">
      <h2>{t('logTitle')}</h2>
      <div
        className="log-list"
        ref={el => {
          if (el) el.scrollTop = el.scrollHeight;
        }}
      >
        {game.log.map((entry, i) => {
          const st = SCRIPT[entry.step];
          if (st.kind === 'choice' && entry.opt !== undefined) {
            return (
              <div key={i} className="log-item me">
                <b>{game.name}</b>
                {fill(tr(st.options[entry.opt].text), game, lang)}
              </div>
            );
          }
          if (st.kind !== 'say') return null;
          return (
            <div key={i} className={`log-item${st.who ? '' : ' narr'}`}>
              {st.who && <b style={{ color: CAST[st.who].color }}>{tr(CAST[st.who].name)}</b>}
              {fill(tr(st.text), game, lang)}
            </div>
          );
        })}
      </div>
      <div className="btns">
        <button className="btn sub" onClick={onClose}>
          {t('close')}
        </button>
      </div>
    </Modal>
  );
}

interface SettingsProps {
  speed: Speed;
  onSpeed: (s: Speed) => void;
  sound: SoundSettings;
  onSound: (patch: Partial<SoundSettings>) => void;
  onClose: () => void;
}

function Slider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      className="slider"
      type="range"
      min={0}
      max={1}
      step={0.05}
      value={value}
      style={{ ['--fill' as string]: `${value * 100}%` }}
      onChange={e => onChange(Number(e.target.value))}
    />
  );
}

export function SettingsModal({ speed, onSpeed, sound, onSound, onClose }: SettingsProps) {
  const { t } = useLang();
  return (
    <Modal className="settings-card">
      <h2>{t('settingsTitle')}</h2>
      <div className="setting-row">
        <span>{t('language')}</span>
        <LangToggle />
      </div>
      <div className="setting-row">
        <span>{t('textSpeed')}</span>
        <div className="seg" role="radiogroup">
          {(Object.keys(SPEED_CPS) as Speed[]).map(s => (
            <button key={s} role="radio" aria-checked={speed === s} className={speed === s ? 'on' : ''} onClick={() => onSpeed(s)}>
              {t(s)}
            </button>
          ))}
        </div>
      </div>
      <div className="setting-row">
        <span>{t('music')}</span>
        <Slider value={sound.music} onChange={music => onSound({ music, muted: false })} />
      </div>
      <div className="setting-row">
        <span>{t('sfx')}</span>
        <Slider value={sound.sfx} onChange={sfx => onSound({ sfx, muted: false })} />
      </div>
      <div className="setting-row">
        <span>{t('blips')}</span>
        <div className="seg" role="radiogroup">
          {[true, false].map(on => (
            <button key={String(on)} role="radio" aria-checked={sound.blips === on} className={sound.blips === on ? 'on' : ''} onClick={() => onSound({ blips: on })}>
              {t(on ? 'on' : 'off')}
            </button>
          ))}
        </div>
      </div>
      <div className="btns">
        <button
          className="btn sub"
          onClick={() => {
            audio.sfx('click');
            onClose();
          }}
        >
          {t('close')}
        </button>
      </div>
    </Modal>
  );
}
