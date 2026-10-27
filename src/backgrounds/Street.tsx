/*
 * The street where Chidori High (left, plain concrete) and Kikyo Girls' High
 * (right, red brick with a green copper tower) stand side by side.
 * Drawn twice: an afternoon version and a sunset version.
 */

type Time = 'day' | 'sunset';

interface Palette {
  sky: [string, string, string];
  cloud: string;
  cloudShade: string;
  glass: string;
  glassHi: string;
  lines: string;
  /** Warm multiply overlay for sunset; null in daytime. */
  tint: string | null;
}

const PAL: Record<Time, Palette> = {
  day: {
    sky: ['#7cc2ef', '#bfe3f7', '#f1f9fd'],
    cloud: '#ffffff',
    cloudShade: '#c8dcef',
    glass: '#8fb2cb',
    glassHi: '#d8ebf6',
    lines: '#4d4a58',
    tint: null,
  },
  sunset: {
    sky: ['#b9a3ec', '#ffb3c4', '#ffe0bd'],
    cloud: '#fff1f4',
    cloudShade: '#eeb3c9',
    glass: '#d99aae',
    glassHi: '#ffe0c6',
    lines: '#5b4a62',
    tint: '#ff9f80',
  },
};

// Chidori concrete
const CON = '#ebe2d2';
const CON_SHADE = '#d3c6b0';
const CON_SLAB = '#f7f1e6';
const CON_PILLAR = '#f1eadd';
// Kikyo brick & stone
const BRICK = '#b5483d';
const BRICK_DARK = '#93362e';
const STONE = '#f3e9de';
const IRON = '#2f2a35';

function starPath(outer: number, inner: number) {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 ? inner : outer;
    d += `${i ? 'L' : 'M'}${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`;
  }
  return d + 'Z';
}
const BELL = starPath(17, 9);

/** Bellflowers (桔梗 = "kikyo") in the planting strip. */
function Bellflower({ i }: { i: number }) {
  const x = 14 + i * 50 + (i % 3) * 8;
  const y = 712 + (i % 2) * 14;
  const s = 0.62 + (i % 3) * 0.1;
  const col = i % 5 === 4 ? '#ffb3c8' : i % 2 ? '#a58be0' : '#8d72d4';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="flower" style={{ animationDelay: `${-i * 0.37}s` }}>
        <path d="M0 4 Q-4 24 2 44" stroke="#6fa86e" strokeWidth="4" fill="none" />
        <ellipse cx="-9" cy="30" rx="9" ry="4" fill="#82bf80" transform="rotate(-30 -9 30)" />
        <path d={BELL} fill={col} stroke={col} strokeWidth="6" strokeLinejoin="round" />
        <path d="M0 -12 L0 -3 M-11 -4 L-3 -1 M11 -4 L3 -1" stroke="#fff" strokeWidth="1.2" opacity="0.5" />
        <circle r="4" fill="#fff6c9" />
      </g>
    </g>
  );
}

/** Puffs of each cloud shape as [cx, cy, r], spread around the cloud's centre. */
const CLOUD_SHAPES: [number, number, number][][] = [
  [[-12, -30, 46], [32, -18, 38], [-52, -10, 32], [70, -2, 28], [10, -2, 34], [-84, 6, 22], [-34, 10, 28], [44, 10, 26], [98, 12, 18]],
  [[-18, -20, 36], [18, -24, 32], [-50, -2, 26], [48, -6, 28], [0, 4, 28], [76, 8, 18], [-74, 10, 18]],
  [[-8, -12, 28], [22, -6, 24], [-34, 2, 20], [6, 6, 20], [44, 8, 15]],
];

/** A soft cumulus cloud: every puff shades from bright on top to blue-grey underneath, over a flat shaded base. */
function Cloud({ x, y, s, shape, url, flip }: { x: number; y: number; s: number; shape: number; url: (n: string) => string; flip?: boolean }) {
  const puffs = [...CLOUD_SHAPES[shape]].sort((a, b) => a[1] - b[1]);
  const left = Math.min(...puffs.map(([cx, , r]) => cx - r * 0.7));
  const right = Math.max(...puffs.map(([cx, , r]) => cx + r * 0.7));
  const base = Math.max(...puffs.map(([, cy, r]) => cy + r * 0.55));
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {/* faint wisps trailing under the cloud */}
      <ellipse cx={(left + right) / 2 + 20} cy={base + 6} rx={(right - left) / 2 + 30} ry={5} fill={url('cloudWisp')} />
      {puffs.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={url('puff')} />
      ))}
      <rect x={left} y={base - 22} width={right - left} height={24} rx={12} fill={url('cloudBase')} />
      {/* sunlit rims on the upper puffs */}
      {puffs.slice(0, 3).map(([cx, cy, r], i) => (
        <path key={i} d={`M${cx - r * 0.72} ${cy - r * 0.28} A${r * 0.86} ${r * 0.86} 0 0 1 ${cx + r * 0.2} ${cy - r * 0.8}`} fill="none" stroke={url('rim')} strokeWidth={r * 0.14} strokeLinecap="round" opacity={0.9} />
      ))}
    </g>
  );
}

/* ---------------- Chidori High ---------------- */

const CH_PILLARS = [44, 160, 276, 392, 508, 624];
const CH_ROWS = [306, 391, 476];

function Chidori({ url }: { url: (n: string) => string }) {
  return (
    <g>
      {/* rooftop stair house + water tank */}
      <rect x="440" y="196" width="118" height="60" fill={CON} />
      <rect x="434" y="190" width="130" height="10" fill={CON_SLAB} />
      <rect x="456" y="214" width="28" height="42" fill="#b8ad9b" />
      <rect x="500" y="212" width="40" height="22" rx="3" fill={url('glass')} stroke="#fff" strokeWidth="3" />
      <circle cx="499" cy="171" r="14" fill="#fff" stroke="#a59a88" strokeWidth="4" />
      <path d="M499 171 v-8 M499 171 h6" stroke="#7d7365" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="120" y="206" width="60" height="44" rx="6" fill="#cfd4d8" />
      <rect x="128" y="198" width="44" height="10" rx="4" fill="#b7bec4" />
      <path d="M134 250 v-10 M166 250 v-10" stroke="#9aa1a8" strokeWidth="4" />

      {/* roof railing */}
      <path d="M48 232 H632" stroke="#a9a196" strokeWidth="3" />
      {Array.from({ length: 30 }, (_, i) => (
        <line key={i} x1={50 + i * 20} y1="232" x2={50 + i * 20} y2="252" stroke="#a9a196" strokeWidth="2" />
      ))}

      {/* side face for a bit of depth */}
      <path d="M0 262 L40 250 V650 H0 Z" fill={CON_SHADE} />
      {[300, 385, 470, 555].map(y => (
        <path key={y} d={`M0 ${y + 10} L40 ${y} v13 L0 ${y + 23} Z`} fill="#c6b89f" />
      ))}

      {/* main facade */}
      <rect x="40" y="250" width="600" height="400" fill={CON} />
      <rect x="34" y="250" width="612" height="44" fill={CON_SLAB} />
      <rect x="34" y="290" width="612" height="4" fill={CON_SHADE} opacity="0.6" />
      {[377, 462, 547].map(y => (
        <g key={y}>
          <rect x="34" y={y} width="612" height="14" fill={CON_SLAB} />
          <rect x="34" y={y + 14} width="612" height="3" fill={CON_SHADE} opacity="0.7" />
        </g>
      ))}
      <rect x="226" y="262" width="228" height="20" rx="3" fill="#fffaf0" stroke="#d8cdb9" strokeWidth="2" />
      <rect x="244" y="269" width="192" height="6" rx="3" fill="#cfc4b0" />

      {/* window bays */}
      {CH_ROWS.map((y, r) =>
        CH_PILLARS.slice(0, -1).map((px, b) => {
          const x = px + 16;
          const curtain = (r * 3 + b * 2) % 5 === 0;
          return (
            <g key={`${r}-${b}`}>
              <rect x={x} y={y} width="100" height="58" fill={url('glass')} />
              {curtain && <rect x={x + 2} y={y + 2} width="32" height="28" fill="#fbf4ea" opacity="0.85" />}
              <path d={`M${x + 33} ${y} v58 M${x + 67} ${y} v58`} stroke="#fff" strokeWidth="3" />
              <rect x={x} y={y} width="100" height="58" fill="none" stroke="#fffaf2" strokeWidth="3" />
              <rect x={x - 2} y={y + 58} width="104" height="5" fill={CON_SHADE} />
              <path d={`M${x + 6} ${y + 50} L${x + 26} ${y + 8}`} stroke="#fff" strokeWidth="5" opacity="0.35" strokeLinecap="round" />
            </g>
          );
        }),
      )}
      {/* ground floor: windows + entrance */}
      {CH_PILLARS.slice(0, -1).map((px, b) =>
        b === 2 ? (
          <g key={b}>
            <rect x={px + 16} y="566" width="100" height="84" fill="#5f6f7d" />
            <path d={`M${px + 41} 566 v84 M${px + 66} 566 v84 M${px + 91} 566 v84`} stroke="#d9dee2" strokeWidth="3" />
            <rect x={px + 6} y="552" width="120" height="12" fill={CON_SLAB} stroke={CON_SHADE} strokeWidth="2" />
          </g>
        ) : (
          <g key={b}>
            <rect x={px + 16} y="572" width="100" height="50" fill={url('glass')} />
            <path d={`M${px + 49} 572 v50 M${px + 83} 572 v50`} stroke="#fff" strokeWidth="3" />
          </g>
        ),
      )}
      {CH_PILLARS.map(x => (
        <rect key={x} x={x} y="294" width="16" height="356" fill={CON_PILLAR} />
      ))}
      <path d="M636 300 V650" stroke="#c8bba5" strokeWidth="5" />
    </g>
  );
}

/* ---------------- Kikyo Girls' High ---------------- */

const KK_COLS = Array.from({ length: 11 }, (_, c) => 936 + c * 62);
const KK_ROWS = [252, 334, 414, 494];

function Window({ x, y, w, h, arch, url }: { x: number; y: number; w: number; h: number; arch?: boolean; url: (n: string) => string }) {
  const d = arch
    ? `M${x} ${y + h} V${y + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} V${y + h} Z`
    : `M${x} ${y} H${x + w} V${y + h} H${x} Z`;
  return (
    <g>
      <path d={d} fill={url('glass')} stroke={STONE} strokeWidth="3.5" />
      <path d={`M${x + w / 2} ${y + (arch ? 4 : 0)} V${y + h} M${x} ${y + h * 0.62} H${x + w}`} stroke={STONE} strokeWidth="2" />
      <rect x={x - 4} y={y + h} width={w + 8} height="5" fill={STONE} />
    </g>
  );
}

function Kikyo({ url }: { url: (n: string) => string }) {
  return (
    <g>
      {/* main wing: mansard roof with dormers */}
      <path d="M902 236 L926 168 H1620 V236 Z" fill={url('copper')} />
      <path d="M926 168 H1620" stroke="#8fd0bf" strokeWidth="4" />
      {[0, 1, 2, 3, 4].map(k => {
        const x = 990 + k * 132;
        return (
          <g key={k}>
            <rect x={x - 20} y="180" width="40" height="46" fill={BRICK} />
            <path d={`M${x - 27} 184 L${x} 154 L${x + 27} 184 Z`} fill={STONE} />
            <path d={`M${x - 20} 184 L${x} 162 L${x + 20} 184 Z`} fill={url('copper')} />
            <rect x={x - 10} y="190" width="20" height="28" fill={url('glass')} stroke={STONE} strokeWidth="3" />
          </g>
        );
      })}
      <rect x="902" y="236" width="720" height="420" fill={url('brick')} />
      {[236, 322, 402, 482, 562].map(y => (
        <rect key={y} x="902" y={y} width="720" height="7" fill={STONE} />
      ))}
      {KK_ROWS.map((y, r) => KK_COLS.map(x => <Window key={`${r}-${x}`} x={x} y={y + 10} w={28} h={r === 0 ? 56 : 52} arch={r === 0} url={url} />))}

      {/* tower */}
      <rect x="790" y="150" width="114" height="506" fill={url('brick')} />
      <rect x="884" y="150" width="20" height="506" fill="#000" opacity="0.12" />
      {[150, 236, 322, 402, 482, 562].map(y => (
        <rect key={y} x="790" y={y} width="114" height="7" fill={STONE} />
      ))}
      {[178, 256, 338, 418].map((y, r) =>
        [814, 856].map(x => <Window key={`${y}-${x}`} x={x} y={y} w={22} h={r === 0 ? 50 : 56} arch url={url} />),
      )}
      <circle cx="847" cy="510" r="20" fill={STONE} />
      <circle cx="847" cy="510" r="14" fill="#fffaf2" stroke={BRICK_DARK} strokeWidth="2" />
      <path d="M847 510 v-9 M847 510 h7" stroke={IRON} strokeWidth="2.4" strokeLinecap="round" />
      {/* copper pyramid roof */}
      <path d="M798 152 L847 60 L896 152 Z" fill={url('copper')} />
      <path d="M847 60 L896 152 H847 Z" fill="#000" opacity="0.14" />
      <path d="M812 126 H882 M824 102 H870" stroke="#8fd0bf" strokeWidth="2.5" opacity="0.7" />
      <path d="M847 60 V36" stroke="#3d7f73" strokeWidth="3" />
      <circle cx="847" cy="34" r="4" fill="#d9b860" />
      {/* corner turrets */}
      {[776, 900].map(x => (
        <g key={x}>
          <rect x={x} y="122" width="22" height="534" fill={BRICK_DARK} />
          <rect x={x - 3} y="118" width="28" height="8" fill={STONE} />
          <path d={`M${x - 2} 118 L${x + 11} 92 L${x + 24} 118 Z`} fill={url('copper')} />
          {[200, 300, 400, 500].map(y => (
            <rect key={y} x={x + 7} y={y} width="8" height="24" rx="4" fill={url('glass')} />
          ))}
        </g>
      ))}
    </g>
  );
}

/** Black iron railings with spear tips, between brick pillars. */
function IronFence({ x0, x1, y = 604, h = 52 }: { x0: number; x1: number; y?: number; h?: number }) {
  const bars = Math.floor((x1 - x0) / 12);
  return (
    <g>
      <rect x={x0} y={y + 8} width={x1 - x0} height="3" fill={IRON} />
      <rect x={x0} y={y + h - 10} width={x1 - x0} height="3" fill={IRON} />
      {Array.from({ length: bars }, (_, i) => {
        const x = x0 + 6 + i * 12;
        return (
          <g key={i}>
            <rect x={x - 1.2} y={y} width="2.4" height={h} fill={IRON} />
            <path d={`M${x - 3} ${y + 2} L${x} ${y - 6} L${x + 3} ${y + 2} Z`} fill={IRON} />
          </g>
        );
      })}
    </g>
  );
}

function BrickPillar({ x, y, w, h, url, lamp }: { x: number; y: number; w: number; h: number; url: (n: string) => string; lamp?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={url('brick')} />
      <rect x={x - 4} y={y - 10} width={w + 8} height="12" fill={STONE} />
      <path d={`M${x} ${y - 10} L${x + w / 2} ${y - 22} L${x + w} ${y - 10} Z`} fill={STONE} />
      <rect x={x + w - 6} y={y} width="6" height={h} fill="#000" opacity="0.12" />
      {lamp && (
        <g>
          <rect x={x + w / 2 - 2} y={y - 34} width="4" height="12" fill={IRON} />
          <path d={`M${x + w / 2 - 9} ${y - 34} h18 l-4 -20 h-10 Z`} fill="#fff4c4" stroke={IRON} strokeWidth="2.5" />
          <path d={`M${x + w / 2 - 7} ${y - 54} L${x + w / 2} ${y - 61} L${x + w / 2 + 7} ${y - 54} Z`} fill={IRON} />
        </g>
      )}
    </g>
  );
}

function Fronts({ url }: { url: (n: string) => string }) {
  return (
    <g>
      {/* Chidori: concrete wall + green mesh fence, gate gap at the entrance */}
      <path d="M0 602 H268 V646 H0 Z M396 602 H700 V646 H396 Z" fill={url('mesh')} />
      {[0, 78, 156, 234, 396, 474, 552, 630].map(x => (
        <rect key={x} x={x} y="596" width="5" height="54" fill="#5f8f6e" />
      ))}
      <path d="M0 598 H268 V602 H0 Z M396 598 H700 V602 H396 Z" fill="#5f8f6e" />
      <path d="M-10 642 H272 V700 H-10 Z M392 642 H702 V700 H392 Z" fill="#ddd6cb" />
      <rect x="-10" y="636" width="282" height="10" fill="#efe9df" />
      <rect x="392" y="636" width="310" height="10" fill="#efe9df" />
      <rect x="272" y="650" width="120" height="50" fill="#e6dccd" />
      <rect x="262" y="616" width="12" height="84" fill="#cbc3b7" />
      <rect x="390" y="616" width="12" height="84" fill="#cbc3b7" />
      <rect x="250" y="648" width="10" height="30" rx="2" fill="#b9b0a3" />
      {[30, 120, 520, 610].map(x => (
        <path key={x} d={`M${x} 660 q8 10 2 30`} stroke="#c9c0b3" strokeWidth="3" fill="none" opacity="0.6" />
      ))}

      {/* the wall between the two schools */}
      <rect x="700" y="566" width="64" height="134" fill="#e4ddd3" />
      <rect x="696" y="558" width="72" height="12" fill="#f1ece4" />
      <path d="M716 600 q6 30 -2 70 M748 590 q-4 40 4 90" stroke="#cfc6ba" strokeWidth="3" fill="none" />

      {/* Kikyo: brick pillars, iron railings, main gate */}
      <rect x="764" y="656" width="858" height="44" fill={url('brick')} />
      <rect x="764" y="650" width="858" height="8" fill={STONE} />
      <IronFence x0={764} x1={918} />
      <IronFence x0={1062} x1={1622} />
      {[1180, 1320, 1460, 1600].map(x => (
        <BrickPillar key={x} x={x} y={594} w={30} h={106} url={url} />
      ))}
      <rect x="946" y="574" width="68" height="126" fill="#eadfd0" />
      <g>
        <path d="M946 590 Q980 556 1014 590" stroke={IRON} strokeWidth="5" fill="none" />
        {Array.from({ length: 9 }, (_, i) => {
          const x = 950 + i * 7.5;
          const top = 590 - Math.sin(((x - 946) / 68) * Math.PI) * 30;
          return <rect key={i} x={x - 1.2} y={top} width="2.4" height={700 - top} fill={IRON} />;
        })}
        <path d="M946 616 H1014 M946 686 H1014 M980 586 V700" stroke={IRON} strokeWidth="3.5" />
        <circle cx="980" cy="640" r="12" fill="none" stroke={IRON} strokeWidth="3" />
        <path d="M980 628 C972 636 972 644 980 652 C988 644 988 636 980 628 Z" fill="none" stroke={IRON} strokeWidth="2" />
      </g>
      <BrickPillar x={902} y={566} w={44} h={134} url={url} lamp />
      <BrickPillar x={1014} y={566} w={44} h={134} url={url} lamp />
      <rect x="912" y="600" width="24" height="34" fill={STONE} />
      <path d="M917 610 h14 M917 617 h14 M917 624 h10" stroke="#b9a99a" strokeWidth="2" />
    </g>
  );
}

function Trees() {
  return (
    <g>
      {/* conifer behind the tower */}
      {[[738, 300, 1], [1080, 420, 0.8]].map(([x, y, s]) => (
        <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
          <rect x="-6" y="200" width="12" height="120" fill="#7a5a48" />
          <path d="M0 0 L-46 110 H46 Z M0 50 L-62 180 H62 Z M0 110 L-76 250 H76 Z" fill="#4f8a66" />
          <path d="M0 0 L46 110 H0 Z M0 50 L62 180 H0 Z M0 110 L76 250 H0 Z" fill="#3e7457" />
        </g>
      ))}
      {/* round broadleaf trees */}
      {[
        [664, 520, 1],
        [1130, 560, 0.75],
        [1540, 560, 0.85],
      ].map(([x, y, s]) => (
        <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
          <rect x="-8" y="10" width="16" height="110" fill="#7a5a48" />
          <path d="M0 60 L-22 30 M0 80 L20 44" stroke="#7a5a48" strokeWidth="7" strokeLinecap="round" />
          <circle cx="-44" cy="0" r="46" fill="#6aa877" />
          <circle cx="40" cy="-6" r="50" fill="#6aa877" />
          <circle cx="0" cy="-44" r="54" fill="#7dba86" />
          <circle cx="-10" cy="20" r="42" fill="#5e9a6c" />
          <circle cx="30" cy="-50" r="16" fill="#a6d6a0" opacity="0.7" />
          <circle cx="-34" cy="-26" r="12" fill="#a6d6a0" opacity="0.6" />
        </g>
      ))}
    </g>
  );
}

function PowerLines({ color }: { color: string }) {
  const poles = [236, 1290];
  return (
    <g>
      {poles.map(x => (
        <g key={x}>
          <rect x={x - 7} y="78" width="14" height="630" fill="#8d8a90" />
          <rect x={x - 7} y="78" width="5" height="630" fill="#a9a6ac" />
          <rect x={x - 48} y="116" width="96" height="7" fill="#7b7880" />
          <rect x={x - 36} y="150" width="72" height="6" fill="#7b7880" />
          {[-40, -14, 14, 40].map(dx => (
            <rect key={dx} x={x + dx - 3} y="108" width="6" height="9" rx="2" fill="#e8e6ea" />
          ))}
          <rect x={x + 7} y="240" width="22" height="34" rx="4" fill="#9b98a0" />
        </g>
      ))}
      <g fill="none" stroke={color} strokeWidth="2" opacity="0.75">
        {[-40, -14, 14, 40].map((dx, i) => (
          <path
            key={dx}
            d={`M-40 ${126 + i * 6} Q${(236 + dx - 40) / 2} ${150 + i * 6} ${236 + dx} 110 Q${(236 + 1290) / 2 + dx} ${180 + i * 8} ${1290 + dx} 110 Q${(1290 + 1660) / 2} ${150 + i * 6} 1660 ${126 + i * 6}`}
          />
        ))}
        <path d="M-40 170 Q118 196 236 153 Q763 236 1290 153 Q1475 196 1660 170" />
      </g>
    </g>
  );
}

export function Street({ time }: { time: Time }) {
  const p = PAL[time];
  const id = (n: string) => `st-${time}-${n}`;
  const url = (n: string) => `url(#${id(n)})`;
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={id('sky')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sky[0]} />
          <stop offset="0.5" stopColor={p.sky[1]} />
          <stop offset="1" stopColor={p.sky[2]} />
        </linearGradient>
        <linearGradient id={id('puff')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.cloud} />
          <stop offset="0.58" stopColor={p.cloud} />
          <stop offset="1" stopColor={p.cloudShade} />
        </linearGradient>
        <linearGradient id={id('cloudBase')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.cloud} stopOpacity="0" />
          <stop offset="0.5" stopColor={p.cloudShade} stopOpacity="0.7" />
          <stop offset="1" stopColor={p.cloudShade} />
        </linearGradient>
        <radialGradient id={id('cloudWisp')}>
          <stop offset="0" stopColor={p.cloud} stopOpacity="0.75" />
          <stop offset="1" stopColor={p.cloud} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id('rim')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={id('sun')}>
          <stop offset="0" stopColor="#fff3c4" />
          <stop offset="1" stopColor="#fff3c4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id('glass')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={p.glassHi} />
          <stop offset="0.55" stopColor={p.glass} />
          <stop offset="1" stopColor={p.glass} />
        </linearGradient>
        <linearGradient id={id('copper')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6fbfac" />
          <stop offset="1" stopColor="#3f8c7c" />
        </linearGradient>
        <pattern id={id('brick')} width="26" height="14" patternUnits="userSpaceOnUse">
          <rect width="26" height="14" fill={BRICK} />
          <path d="M0 6.5 H26 M0 13.5 H26 M6 0 V6.5 M19 7 V14" stroke={BRICK_DARK} strokeWidth="1.2" />
          <rect x="8" y="1" width="9" height="4" fill="#c45a4d" opacity="0.6" />
        </pattern>
        <pattern id={id('mesh')} width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 0 L12 12 M12 0 L0 12" stroke="#6f9f7c" strokeWidth="1.3" />
        </pattern>
      </defs>

      <rect width="1600" height="900" fill={url('sky')} />
      {time === 'sunset' && (
        <>
          {/* the sun sets right between the two schools */}
          <circle className="glow" cx="708" cy="250" r="300" fill={url('sun')} opacity="0.85" />
          <circle cx="708" cy="262" r="74" fill="#fff1bf" />
        </>
      )}
      <g className="drift">
        <Cloud x={330} y={124} s={1.05} shape={0} url={url} />
        <Cloud x={1250} y={96} s={0.9} shape={1} url={url} flip />
        <Cloud x={760} y={206} s={0.75} shape={2} url={url} />
        <Cloud x={1520} y={240} s={0.5} shape={2} url={url} flip />
      </g>

      <Chidori url={url} />
      <Kikyo url={url} />
      <Trees />
      <Fronts url={url} />
      <PowerLines color={p.lines} />

      {/* planting strip + sidewalk */}
      <rect y="700" width="1600" height="34" fill="#93c283" />
      <rect y="700" width="1600" height="5" fill="#7fb072" />
      {Array.from({ length: 32 }, (_, i) => (
        <Bellflower key={i} i={i} />
      ))}
      <rect y="734" width="1600" height="166" fill="#eee2d4" />
      <rect y="734" width="1600" height="10" fill="#f9f2e9" />
      {Array.from({ length: 17 }, (_, i) => (
        <path key={i} d={`M${i * 100} 744 L${i * 100 - 30} 900`} stroke="#e2d4c3" strokeWidth="3" />
      ))}
      <path d="M0 820 H1600" stroke="#e2d4c3" strokeWidth="3" />

      {p.tint && <rect width="1600" height="900" fill={p.tint} opacity="0.16" style={{ mixBlendMode: 'multiply' }} />}
    </svg>
  );
}
