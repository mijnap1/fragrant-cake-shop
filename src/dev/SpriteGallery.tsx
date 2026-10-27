import type { Expr } from '../story/types';
import { Kaoruko } from '../characters/Kaoruko';
import { Rintaro } from '../characters/Rintaro';
import { SoundIcon } from '../components/SoundIcon';
import type { SpriteProps } from '../characters/types';

/** Dev-only sheet of every sprite × expression. Open with `#sprites`; `#sprites=600:kao` shows one character, bigger. */
const EXPRS: Expr[] = ['normal', 'smile', 'happy', 'surprised', 'blush', 'troubled'];

export function SpriteGallery() {
  const [size, who] = (location.hash.split('=')[1] ?? '').split(':');
  const h = Number(size) || 320;
  const KaoUniform = (p: SpriteProps) => <Kaoruko {...p} outfit="uniform" />;
  const sprites = who === 'kao' ? [Kaoruko, KaoUniform] : who === 'rin' ? [Rintaro] : [Rintaro, Kaoruko, KaoUniform];
  const w = (h * 200) / 380 + 4;
  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 16, background: '#fff4f7' }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, zoom: 3 }}>
        <button className="hbtn hbtn-icon"><SoundIcon muted={false} /></button>
        <button className="hbtn hbtn-icon"><SoundIcon muted /></button>
      </div>
      {sprites.map((Sprite, row) => (
        <div key={row} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
          {EXPRS.map(e => (
            <div key={e} style={{ width: w, textAlign: 'center' }}>
              <div style={{ height: h }} className="char-inner">
                <Sprite e={e} blink={false} talk={false} />
              </div>
              <small>{e}</small>
            </div>
          ))}
          <div style={{ width: w, textAlign: 'center' }}>
            <div style={{ height: h }} className="char-inner">
              <Sprite e="normal" blink talk />
            </div>
            <small>blink + talk</small>
          </div>
        </div>
      ))}
    </div>
  );
}
