import type { ReactNode } from 'react';
import type { Expr } from '../story/types';

/*
 * Drawing helpers shared by the sprites. Sprites use a 200×380 viewBox (head
 * and body down to the hips) with the face centred on x=100; eyes, brows and
 * symmetric locks of hair are drawn once on the left and mirrored.
 */

export const VIEWBOX = '0 0 200 380';

export const Mirror = ({ children }: { children: ReactNode }) => (
  <>
    {children}
    <g transform="matrix(-1 0 0 1 200 0)">{children}</g>
  </>
);

/** Mirrors a path made only of absolute M/L/Q/C/Z commands across x=100. */
export const flip = (d: string) => {
  let i = 0;
  return d.replace(/-?\d+(\.\d+)?/g, n => (i++ % 2 === 0 ? String(+(200 - Number(n)).toFixed(2)) : n));
};

export const line = (color: string, w: number) => ({
  fill: 'none',
  stroke: color,
  strokeWidth: w,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

/**
 * Fills a set of overlapping shapes with an outline around only their outer edge:
 * every stroke is drawn first, then every fill on top hides the inner halves.
 */
export function Inked({ d, fill, ink, w = 2.4, className }: { d: string[]; fill: string; ink: string; w?: number; className?: string }) {
  return (
    <g className={className}>
      {d.map((p, i) => (
        <path key={`s${i}`} d={p} fill={ink} stroke={ink} strokeWidth={w} strokeLinejoin="round" />
      ))}
      {d.map((p, i) => (
        <path key={`f${i}`} d={p} fill={fill} />
      ))}
    </g>
  );
}

/** A limb drawn as a thick rounded stroke with an outline. */
export function Limb({ d, fill, outline, w = 18 }: { d: string; fill: string; outline: string; w?: number }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={outline} strokeWidth={w + 3} />
      <path d={d} stroke={fill} strokeWidth={w} />
    </g>
  );
}

type Pt = [number, number];

/**
 * A finger from its knuckle to its tip, bending through `ctrl`: drawn with its own
 * outline so neighbouring fingers stay separate, with a crease at the middle joint
 * and, when the back of the hand faces us, a fingernail at the tip.
 */
export function Finger({ from, ctrl, to, w, skin, ink, nail = true }: { from: Pt; ctrl: Pt; to: Pt; w: number; skin: string; ink: string; nail?: boolean }) {
  const [x0, y0] = from;
  const [cx, cy] = ctrl;
  const [x1, y1] = to;
  const deg = (dx: number, dy: number) => (Math.atan2(dy, dx) * 180) / Math.PI;
  // the middle joint sits at the halfway point of the curve
  const jx = 0.25 * x0 + 0.5 * cx + 0.25 * x1;
  const jy = 0.25 * y0 + 0.5 * cy + 0.25 * y1;
  const tip = deg(x1 - cx, y1 - cy);
  const back = w * 0.42;
  return (
    <g>
      <Limb d={`M${x0} ${y0} Q${cx} ${cy} ${x1} ${y1}`} fill={skin} outline={ink} w={w} />
      <path d={`M0 ${-w * 0.3} Q${w * 0.12} 0 0 ${w * 0.3}`} transform={`translate(${jx} ${jy}) rotate(${deg(x1 - x0, y1 - y0)})`} {...line(ink, 0.6)} opacity={0.55} />
      {nail && (
        <ellipse
          cx={x1 - Math.cos((tip * Math.PI) / 180) * back}
          cy={y1 - Math.sin((tip * Math.PI) / 180) * back}
          rx={w * 0.36}
          ry={w * 0.27}
          transform={`rotate(${tip} ${x1 - Math.cos((tip * Math.PI) / 180) * back} ${y1 - Math.sin((tip * Math.PI) / 180) * back})`}
          fill="#fff1ec"
          stroke={ink}
          strokeWidth={0.5}
          opacity={0.9}
        />
      )}
    </g>
  );
}

/**
 * A pointed lock of hair from a base on the hairline to a tip.
 * `bend` pushes the middle of the lock sideways so it curves.
 */
export const lock = ([x1, y1]: number[], [x2, y2]: number[], [tx, ty]: number[], bend = 0) =>
  `M${x1} ${y1} Q${(x1 + tx) / 2 + bend - 1} ${(y1 + ty) / 2} ${tx} ${ty} Q${(x2 + tx) / 2 + bend + 1} ${(y2 + ty) / 2} ${x2} ${y2} Z`;

const Sparkle = ({ x, y, r, c }: { x: number; y: number; r: number; c: string }) => (
  <path className="twinkle" d={`M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r} Z`} fill={c} />
);

/** Anime-style cheek blush: a soft glow plus diagonal hatching. */
export function Blush({ id, x, y, amount, hatch }: { id: string; x: number; y: number; amount: number; hatch: string }) {
  if (amount <= 0) return null;
  return (
    <g opacity={amount}>
      <defs>
        <radialGradient id={`${id}-blush`}>
          <stop offset="0" stopColor="#ff8fab" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ff8fab" stopOpacity="0" />
        </radialGradient>
      </defs>
      <Mirror>
        <ellipse cx={x} cy={y} rx={9} ry={4.6} fill={`url(#${id}-blush)`} />
        <path d={`M${x - 5} ${y + 2} l2 -4 M${x - 2} ${y + 2.2} l2 -4 M${x + 1} ${y + 2.2} l2 -4 M${x + 4} ${y + 2} l1.8 -3.6`} {...line(hatch, 0.8)} />
      </Mirror>
    </g>
  );
}

/** Floating emotion marks: sparkles, surprise lines, a sweat drop. */
export function Fx({ e, accent, sweat }: { e: Expr; accent: string; sweat?: boolean }) {
  return (
    <>
      {(e === 'troubled' || sweat) && <path className="drip" d="M139 78 Q145 88 139 92 Q133 88 139 78 Z" fill="#a8dcf7" stroke="#6fb6de" strokeWidth={0.8} />}
      {e === 'happy' && (
        <>
          <Sparkle x={160} y={40} r={8} c="#ffd36e" />
          <Sparkle x={36} y={64} r={5} c="#ffd36e" />
          <Sparkle x={168} y={88} r={4.5} c="#ffb3c8" />
        </>
      )}
      {e === 'surprised' && <path d="M154 40 l5 -10 M163 49 l10 -5 M158 45 l8 -8" {...line(accent, 2.4)} />}
    </>
  );
}
