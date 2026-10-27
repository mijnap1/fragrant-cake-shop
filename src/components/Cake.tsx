import { useId, type PointerEvent } from 'react';
import { cakeItem, ROSETTE, type CakeChoice, type Decor } from '../story/cake';

/* ---------- toppings ---------- */

const SEEDS: [number, number][] = [[-6, -5], [-1, -7.5], [4, -5], [-7.5, 1], [-2.5, -0.5], [3, 1], [7.5, -1.5], [-4, 6], [1, 7.5]];

function Strawberry() {
  return (
    <>
      <ellipse cx="1" cy="13" rx="8" ry="2.4" fill="rgba(140, 40, 70, 0.16)" />
      <path d="M-11 -5 Q-12 -13 0 -13 Q12 -13 11 -5 Q9 6 0 14 Q-9 6 -11 -5 Z" fill="#ee4262" />
      <path d="M5 -12.4 Q12 -10.6 11 -4.6 Q9 6 0 14 Q7.4 4 7.4 -4 Q7.4 -9.4 5 -12.4 Z" fill="#c2203f" opacity="0.5" />
      {SEEDS.map(([x, y]) => (
        <g key={`${x}${y}`}>
          <ellipse cx={x} cy={y} rx="0.95" ry="1.35" fill="#ffe08a" />
          <circle cx={x} cy={y + 0.4} r="0.35" fill="#b5762a" />
        </g>
      ))}
      <ellipse cx="-5.6" cy="-6.6" rx="3.4" ry="1.9" fill="#fff" opacity="0.6" transform="rotate(-28 -5.6 -6.6)" />
      <path d="M0 -12 L-9.5 -14.4 L-4.4 -10.6 L-7.6 -6.2 L-1.4 -9.6 L0 -5.4 L1.4 -9.6 L7.6 -6.2 L4.4 -10.6 L9.5 -14.4 Z" fill="#5daa5a" stroke="#4a9048" strokeWidth="0.6" strokeLinejoin="round" />
      <path d="M0 -12.4 Q0.6 -16 3 -17.4" fill="none" stroke="#4a9048" strokeWidth="1.6" strokeLinecap="round" />
    </>
  );
}

const Berry = ({ x, y, r, c }: { x: number; y: number; r: number; c: string }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill={c} />
    <path d={`M${r * 0.2} ${-r} A${r} ${r} 0 0 1 ${r * 0.2} ${r} A${r * 0.8} ${r} 0 0 0 ${r * 0.2} ${-r} Z`} fill="#27306a" opacity="0.35" />
    <circle cx={-r * 0.35} cy={-r * 0.35} r={r * 0.45} fill="#b9c6f2" opacity="0.4" />
    <path d={`M${-r * 0.32} ${-r * 0.62} l${r * 0.32} ${r * 0.2} l${r * 0.32} ${-r * 0.2} l${-r * 0.1} ${r * 0.34} l${r * 0.1} ${r * 0.3} l${-r * 0.32} ${-r * 0.16} l${-r * 0.32} ${r * 0.16} l${r * 0.1} ${-r * 0.3} Z`} fill="#232b5e" opacity="0.75" />
  </g>
);

function Macaron({ c }: { c: string }) {
  const ruffle = (y: number) => `M-12 ${y} ${Array.from({ length: 8 }, () => 'q1.5 1.8 3 0').join(' ')} V${y + 2.2} H-12 Z`;
  return (
    <>
      <ellipse cy="10" rx="12" ry="2.4" fill="rgba(140, 70, 100, 0.14)" />
      <path d="M-13 3 Q-13 10 0 10 Q13 10 13 3 Q0 6 -13 3 Z" fill={c} />
      <path d="M-12 6 Q0 10.4 12 6 Q0 8.4 -12 6 Z" fill="#000" opacity="0.08" />
      <path d={ruffle(1)} fill={c} opacity="0.85" />
      <rect x="-11.5" y="-2.6" width="23" height="4.2" rx="2" fill="#fff8ec" />
      <path d={ruffle(-4.4)} fill={c} opacity="0.85" />
      <path d="M-13 -4 Q-13 -12 0 -12 Q13 -12 13 -4 Q0 -1.4 -13 -4 Z" fill={c} />
      <ellipse cx="-4" cy="-8.6" rx="5.4" ry="1.6" fill="#fff" opacity="0.55" />
    </>
  );
}

function ChocolatePiece({ tilt }: { tilt: number }) {
  return (
    <g transform={`rotate(${tilt})`}>
      <rect x="-13" y="-8" width="28" height="19" rx="3" fill="rgba(60, 30, 20, 0.18)" />
      <rect x="-14" y="-10" width="28" height="19" rx="3" fill="#53301f" />
      {[[-11.5, -7.5], [0.5, -7.5], [-11.5, 0.5], [0.5, 0.5]].map(([px, py]) => (
        <g key={`${px}${py}`}>
          <rect x={px} y={py} width="11" height="6" rx="1.5" fill="#7a4a35" />
          <path d={`M${px + 1} ${py + 5} V${py + 1} H${px + 10}`} fill="none" stroke="#a06a50" strokeWidth="0.9" strokeLinecap="round" />
        </g>
      ))}
      <path d="M-12 -8.5 L-5 -8.5 L-12.5 3 Z" fill="#fff" opacity="0.13" />
    </g>
  );
}

function Rosette({ cream }: { cream: string }) {
  return (
    <>
      <ellipse cy="6" rx="10.5" ry="3.2" fill="rgba(122, 82, 70, 0.14)" />
      <circle r="9.6" fill={cream} stroke="rgba(122, 82, 70, 0.26)" strokeWidth="1" />
      {Array.from({ length: 8 }, (_, k) => (
        <path key={k} d="M0 -2 Q5 -4 8.6 -1" fill="none" stroke="rgba(122, 82, 70, 0.24)" strokeWidth="1.1" strokeLinecap="round" transform={`rotate(${k * 45})`} />
      ))}
      <path d="M-4 1 Q-4 -5 0 -8 Q4 -5 4 1 Q0 3 -4 1 Z" fill={cream} stroke="rgba(122, 82, 70, 0.28)" strokeWidth="0.9" />
      <ellipse cx="-1.4" cy="-4" rx="1.2" ry="2" fill="#fff" opacity="0.75" />
    </>
  );
}

export function Topping({ id, x, y, i = 0, cream }: { id: string; x: number; y: number; i?: number; cream?: string }) {
  const at = `translate(${x} ${y})`;
  switch (id) {
    case 'strawberry':
      return (
        <g transform={at}>
          <Strawberry />
        </g>
      );
    case 'blueberry':
      return (
        <g transform={at}>
          <ellipse cy="9" rx="12" ry="2.6" fill="rgba(40, 50, 110, 0.16)" />
          <Berry x={-6.4} y={2} r={6.6} c="#4b59aa" />
          <Berry x={6.6} y={2.6} r={6.4} c="#5464ba" />
          <Berry x={0} y={-6} r={6.6} c="#4553a2" />
        </g>
      );
    case 'macaron':
      return (
        <g transform={at}>
          <Macaron c={['#ffb3c8', '#cbb8f2', '#bfe6c8'][i % 3]} />
        </g>
      );
    case 'chocolate':
      return (
        <g transform={at}>
          <ChocolatePiece tilt={i % 2 ? 14 : -14} />
        </g>
      );
    case ROSETTE:
      return (
        <g transform={at}>
          <Rosette cream={cream ?? '#fffdf7'} />
        </g>
      );
    default:
      return null;
  }
}

/* ---------- the cake ---------- */

const DRIPS = [18, 28, 14, 24, 32, 16, 26, 20, 14];
/** Which drips appear first as the cream goes on. */
const DRIP_ORDER = [4, 1, 7, 2, 6, 0, 8, 3, 5];
const TOP_SPOTS: [number, number][] = [[112, 94], [150, 88], [188, 94], [130, 106], [170, 106]];
const SLICES = [74, 104, 134, 166, 196, 226];
const BEADS = Array.from({ length: 16 }, (_, k) => 64 + k * 11.5);

/** The cake top is an ellipse rx 90, ry 18 centred at (150, top); this is its front edge. */
const frontEdge = (x: number, top: number) => top + 18 * Math.sqrt(Math.max(0, 1 - ((x - 150) / 90) ** 2));
/** Whether a point lands on the cake top (a little inside the rim) when the cake is fully risen. */
export const onCakeTop = (x: number, y: number) => ((x - 150) / 82) ** 2 + ((y - 100) / 16) ** 2 <= 1;

function mix(a: string, b: string, t: number) {
  const c = (h: string, i: number) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16);
  const k = Math.max(0, Math.min(1, t));
  return `#${[0, 1, 2].map(i => Math.round(c(a, i) + (c(b, i) - c(a, i)) * k).toString(16).padStart(2, '0')).join('')}`;
}

/** Pale while underbaked, browning past golden, nearly black when burnt. */
function spongeColor(base: string, done: number | undefined) {
  if (done === undefined) return base;
  if (done < 0.5) return mix(base, '#fffaf0', (0.5 - done) * 1.3);
  if (done > 0.74) return mix(base, '#4a2a1c', ((done - 0.74) / 0.26) * 0.8);
  return base;
}

/** The cream lip along the front rim of the top, with drips hanging off it. */
function frostingPath(top: number, drips: number[], lip: number, stretch: number) {
  const e = (x: number) => frontEdge(x, top);
  const along = (x0: number, x1: number) => {
    let s = '';
    for (let x = x0 + 5; x < x1; x += 5) s += ` L${x.toFixed(1)} ${(e(x) + lip).toFixed(1)}`;
    return s;
  };
  let d = `M60 ${top} L60 ${top + lip}`;
  let x = 60;
  for (const i of [...drips].sort((a, b) => a - b)) {
    const cx = 68 + i * 20;
    const hw = 6.4;
    const y0 = e(cx);
    const len = Math.min(96, DRIPS[i] * stretch);
    d += along(x, cx - hw) + ` L${cx - hw} ${(e(cx - hw) + lip).toFixed(1)}`;
    d += ` C${cx - hw} ${(y0 + len * 0.55).toFixed(1)} ${cx - hw - 1.6} ${(y0 + len + 2).toFixed(1)} ${cx} ${(y0 + len + 2).toFixed(1)}`;
    d += ` C${cx + hw + 1.6} ${(y0 + len + 2).toFixed(1)} ${cx + hw} ${(y0 + len * 0.55).toFixed(1)} ${cx + hw} ${(e(cx + hw) + lip).toFixed(1)}`;
    x = cx + hw;
  }
  return `${d}${along(x, 240)} L240 ${top + lip} L240 ${top} A90 18 0 0 1 60 ${top} Z`;
}

/** A lace doily: a scalloped ellipse under the cake. */
const DOILY = (() => {
  const n = 30;
  const pt = (a: number, k: number) => `${(150 + Math.cos(a) * 108 * k).toFixed(1)} ${(213 + Math.sin(a) * 20 * k).toFixed(1)}`;
  let d = `M${pt(0, 1)}`;
  for (let i = 0; i < n; i++) d += ` Q${pt(((i + 0.5) / n) * Math.PI * 2, 1.09)} ${pt(((i + 1) / n) * Math.PI * 2, 1)}`;
  return `${d} Z`;
})();
const DOILY_HOLES = Array.from({ length: 30 }, (_, i) => {
  const a = ((i + 0.5) / 30) * Math.PI * 2;
  return [150 + Math.cos(a) * 108 * 0.95, 213 + Math.sin(a) * 20 * 0.95];
});

interface CakeProps {
  choice: CakeChoice;
  /** Oven doneness 0–1 while baking: the sponge rises and browns with it. */
  done?: number;
  /** How much cream is spread, where 1 is exactly enough; fully frosted when undefined. */
  frost?: number;
  /** Freely placed decorations; without them the chosen topping sits in a ring. */
  decor?: Decor[];
  /** Makes the top clickable, reporting where it was tapped. */
  onPlace?: (x: number, y: number) => void;
}

export function Cake({ choice, done, frost, decor, onPlace }: CakeProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const id = (n: string) => `${uid}-${n}`;
  const url = (n: string) => `url(#${id(n)})`;

  const base = cakeItem('base', choice.base);
  const cream = cakeItem('cream', choice.cream);
  const top = 200 - 100 * (done === undefined ? 1 : Math.min(1, 0.4 + done));
  const mid = (top + 200) / 2;
  const sponge = base ? spongeColor(base.color!, done) : '#ffffff';
  const crust = mix(sponge, '#9a5a2c', done !== undefined && done < 0.5 ? 0.1 : 0.3);
  const f = cream ? (frost ?? 1) : 0;
  const cover = Math.min(1, f / 0.9);
  const drips = DRIP_ORDER.slice(0, Math.round(DRIPS.length * cover));
  const stretch = f > 1 ? 1 + (f - 1) * 5 : 1;
  const frosting = cream ? frostingPath(top, drips, 3 + 4 * cover, stretch) : '';
  const items = decor ?? (choice.top ? TOP_SPOTS.map(([x, y]) => ({ id: choice.top!, x, y })) : []);
  const body = `M60 ${top} V200 A90 18 0 0 0 240 200 V${top} Z`;

  const tap = (e: PointerEvent<SVGSVGElement>) => {
    if (!onPlace) return;
    const svg = e.currentTarget;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(svg.getScreenCTM()!.inverse());
    // decorations are stored as if the cake were fully risen
    const y = p.y - (top - 100);
    if (onCakeTop(p.x, y)) onPlace(Math.round(p.x), Math.round(y));
  };

  return (
    <svg viewBox="0 0 300 260" xmlns="http://www.w3.org/2000/svg" onPointerDown={tap}>
      <defs>
        <linearGradient id={id('plate')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#fbe1ea" />
        </linearGradient>
        {/* lit from the left, like a round cake on a counter */}
        <linearGradient id={id('side')} x1="60" y1="0" x2="240" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={mix(sponge, '#ffffff', 0.3)} />
          <stop offset="0.32" stopColor={sponge} />
          <stop offset="0.8" stopColor={mix(sponge, '#6b3f2e', 0.1)} />
          <stop offset="1" stopColor={mix(sponge, '#6b3f2e', 0.24)} />
        </linearGradient>
        <radialGradient id={id('crust')} cx="0.45" cy="0.4" r="0.7">
          <stop offset="0" stopColor={mix(sponge, '#ffffff', 0.18)} />
          <stop offset="1" stopColor={crust} />
        </radialGradient>
        <pattern id={id('crumb')} width="18" height="12" patternUnits="userSpaceOnUse">
          <g fill={mix(sponge, '#5a3424', 0.35)} opacity="0.4">
            <ellipse cx="3" cy="3" rx="1.2" ry="0.8" />
            <ellipse cx="11" cy="7" rx="1.5" ry="1" />
            <ellipse cx="15.5" cy="2" rx="0.9" ry="0.6" />
            <ellipse cx="6" cy="10" rx="1" ry="0.7" />
          </g>
        </pattern>
        {cream && (
          <radialGradient id={id('cream')} cx="0.42" cy="0.32" r="0.75">
            <stop offset="0" stopColor={mix(cream.color!, '#ffffff', 0.6)} />
            <stop offset="0.6" stopColor={cream.color} />
            <stop offset="1" stopColor={mix(cream.color!, '#8a5a44', 0.14)} />
          </radialGradient>
        )}
      </defs>

      {/* plate and doily */}
      <ellipse cx="150" cy="232" rx="122" ry="14" fill="rgba(201, 85, 124, 0.12)" />
      <ellipse cx="150" cy="222" rx="128" ry="25" fill={url('plate')} stroke="#f2bccd" strokeWidth="2.4" />
      <ellipse cx="150" cy="219" rx="116" ry="20" fill="none" stroke="#fde3ea" strokeWidth="2" />
      <path d={DOILY} fill="#fffbfd" stroke="#f5cfdc" strokeWidth="1.2" />
      {DOILY_HOLES.map(([x, y], k) => (
        <circle key={k} cx={x} cy={y} r="1.5" fill="#f7d6e1" />
      ))}
      <ellipse cx="150" cy="213" rx="92" ry="15" fill="none" stroke="#f9dfe8" strokeWidth="1" strokeDasharray="2 3" />
      {f > 1.1 && cream && <ellipse cx="150" cy="214" rx={Math.min(118, 96 + (f - 1.1) * 140)} ry="11" fill={url('cream')} />}

      {!base ? (
        <g stroke="#f2a7bd" strokeWidth="3" strokeDasharray="8 8" fill="none">
          <path d="M60 100 V200 A90 18 0 0 0 240 200 V100" />
          <ellipse cx="150" cy="100" rx="90" ry="18" />
          <text x="150" y="168" textAnchor="middle" fontFamily="Jua, Fredoka, sans-serif" fontSize="44" fill="#f2a7bd" stroke="none">?</text>
        </g>
      ) : (
        <>
          {/* sponge */}
          <path d={body} fill={url('side')} />
          <path d={body} fill={url('crumb')} />
          <path d="M60 194 A90 18 0 0 0 240 194" fill="none" stroke={crust} strokeWidth="4" opacity="0.35" />
          <path d={`M66 ${top + 10} V192`} stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.22" />

          {/* the filling between the two layers */}
          <path
            d={`M60 ${mid - 5} A90 18 0 0 0 240 ${mid - 5} V${mid + 6} A90 18 0 0 1 60 ${mid + 6} Z`}
            fill={cream ? url('cream') : mix(sponge, '#ffffff', 0.45)}
            opacity={cream ? Math.max(0.4, cover) : 0.55}
          />
          {cream && cover > 0.5 && choice.top === 'strawberry' &&
            SLICES.map(x => (
              <g key={x} transform={`translate(${x} ${frontEdge(x, mid) + 1})`}>
                <path d="M-6.4 0 A6.4 5.4 0 0 1 6.4 0 Z" fill="#ee4262" />
                <path d="M-4 0 A4 3.2 0 0 1 4 0 Z" fill="#ffd3dc" />
              </g>
            ))}
          <path d={body} fill="none" stroke="rgba(122, 82, 70, 0.24)" strokeWidth="1.6" />

          {/* top: a golden domed crust, or the frosting */}
          <ellipse cx="150" cy={top} rx="90" ry="18" fill={url('crust')} stroke="rgba(122, 82, 70, 0.24)" strokeWidth="1.6" />
          {!cream && <ellipse cx="150" cy={top} rx="90" ry="18" fill={url('crumb')} opacity="0.6" />}
          {!cream && <ellipse cx="130" cy={top - 4} rx="44" ry="6" fill="#fff" opacity="0.18" />}
          {cream && cover > 0 && (
            <g opacity={Math.max(0.35, cover)}>
              <path d={frosting} fill={mix(sponge, '#3a2016', 0.5)} opacity="0.22" transform="translate(1.6 2.6)" />
              <path d={frosting} fill={cream.color} stroke="rgba(122, 82, 70, 0.18)" strokeWidth="1.2" strokeLinejoin="round" />
              <ellipse cx="150" cy={top} rx="89" ry="17.4" fill={url('cream')} />
              {/* glossy highlights */}
              <ellipse cx="126" cy={top - 5} rx="36" ry="4.4" fill="#fff" opacity="0.4" transform={`rotate(-4 126 ${top - 5})`} />
              <path
                d={`M72 ${frontEdge(72, top) + 2} Q110 ${top + 22} 150 ${top + 20.4}`}
                fill="none"
                stroke="#fff"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.55"
              />
              {drips.map(i => {
                const x = 68 + i * 20;
                const len = Math.min(96, DRIPS[i] * stretch);
                return <ellipse key={i} cx={x - 2.4} cy={frontEdge(x, top) + len - 3} rx="1.4" ry="2.6" fill="#fff" opacity="0.6" />;
              })}
              {/* piped beads around the base once it's properly frosted */}
              {cover >= 0.95 &&
                BEADS.map(x => {
                  const y = frontEdge(x, 200) - 1;
                  return (
                    <g key={x}>
                      <circle cx={x} cy={y} r="5.6" fill={cream.color} stroke="rgba(122, 82, 70, 0.2)" strokeWidth="0.9" />
                      <circle cx={x - 1.8} cy={y - 2} r="1.6" fill="#fff" opacity="0.7" />
                    </g>
                  );
                })}
            </g>
          )}

          {[...items]
            .sort((a, b) => a.y - b.y)
            .map((d, i) => (
              <Topping key={i} id={d.id} x={d.x} y={d.y + top - 100} i={i} cream={cream?.color} />
            ))}
          {onPlace && items.length === 0 && <ellipse className="place-hint" cx="150" cy={top} rx="70" ry="12" fill="none" stroke="#f48fb1" strokeWidth="2.5" strokeDasharray="6 6" />}
        </>
      )}
    </svg>
  );
}
