/* The Tsumugi family's cake shop, seen from the street. */

const TILE = '#d6b77c';
const WOOD_DARK = '#4f2a1d';
const PANE = '#fff3dc';

/** Warm, lit-up shop interior seen through glass. */
function Interior({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const bulbs = [0.12, 0.28, 0.6, 0.76, 0.9].map(f => x + w * f);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="url(#sf-room)" />
      <rect x={x} y={y} width={w} height={h * 0.14} fill="#f6dcc0" />
      {bulbs.map((bx, i) => (
        <g key={bx}>
          <line x1={bx} y1={y} x2={bx} y2={y + 46 + (i % 2) * 14} stroke="#8a6a55" strokeWidth="2" />
          <circle className="glow" style={{ animationDelay: `${-i * 0.7}s` }} cx={bx} cy={y + 52 + (i % 2) * 14} r="34" fill="url(#sf-bulb)" />
          <circle cx={bx} cy={y + 52 + (i % 2) * 14} r="7" fill="#fffbe8" />
        </g>
      ))}
      {/* kitchen pass-through + picture + shelves */}
      <rect x={x + 26} y={y + h * 0.36} width={w * 0.22} height={h * 0.3} fill="#eef1f2" stroke="#c99f7a" strokeWidth="6" />
      <rect x={x + 40} y={y + h * 0.42} width={w * 0.08} height={h * 0.08} fill="#d9dfe3" />
      <rect x={x + w * 0.86} y={y + h * 0.3} width={w * 0.07} height={h * 0.13} fill="#bfe3c8" stroke="#e8d3b5" strokeWidth="5" />
      <rect x={x + w * 0.42} y={y + h * 0.34} width={w * 0.16} height={h * 0.26} fill="#e9c7a6" />
      {[0.42, 0.5, 0.58].map(f => (
        <rect key={f} x={x + w * f} y={y + h * 0.34} width="10" height="26" fill="#d6ad86" opacity="0.6" />
      ))}
      {/* counter and showcase */}
      <rect x={x} y={y + h * 0.66} width={w} height={h * 0.07} fill="#d9b48c" />
      <rect x={x} y={y + h * 0.73} width={w} height={h * 0.27} fill="#f3e3cf" />
      {Array.from({ length: 9 }, (_, i) => (
        <g key={i}>
          <rect x={x + 30 + i * (w / 9)} y={y + h * 0.78} width="30" height="20" rx="4" fill={['#ffe3a3', '#ffc8d6', '#b5d39a'][i % 3]} />
          <circle cx={x + 45 + i * (w / 9)} cy={y + h * 0.77} r="5" fill="#ef4f6c" />
        </g>
      ))}
      <rect x={x} y={y} width={w} height={h} fill="url(#sf-warm)" />
      {/* glass reflections */}
      <path d={`M${x + w * 0.08} ${y + h} L${x + w * 0.3} ${y} H${x + w * 0.36} L${x + w * 0.14} ${y + h} Z`} fill="#fff" opacity="0.12" />
      <path d={`M${x + w * 0.62} ${y + h} L${x + w * 0.8} ${y} H${x + w * 0.83} L${x + w * 0.65} ${y + h} Z`} fill="#fff" opacity="0.1" />
    </g>
  );
}

function Panes({ x, y, n, size }: { x: number; y: number; n: number; size: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <rect key={i} x={x + i * (size + 4)} y={y} width={size} height={size * 0.7} fill={PANE} />
      ))}
    </g>
  );
}

function Hedge() {
  const leaves = [];
  for (let i = 0; i < 40; i++) {
    const x = 584 + i * 19.5;
    leaves.push(
      <circle key={`a${i}`} cx={x} cy={624 + (i % 3) * 8} r={28 + (i % 4) * 4} fill="#6f9b43" />,
      <circle key={`b${i}`} cx={x + 8} cy={604 + (i % 5) * 6} r={20 + (i % 3) * 3} fill="#88b552" />,
    );
    if (i % 2 === 0) leaves.push(<circle key={`c${i}`} cx={x - 4} cy={596 + (i % 4) * 5} r={9} fill="#b3d77a" opacity="0.8" />);
  }
  return <g>{leaves}</g>;
}

export function ShopFront() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sf-sign" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3e5cc4" />
          <stop offset="1" stopColor="#24358f" />
        </linearGradient>
        <linearGradient id="sf-awning" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5574d6" />
          <stop offset="1" stopColor="#2d42a2" />
        </linearGradient>
        <linearGradient id="sf-room" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbe7cf" />
          <stop offset="1" stopColor="#efc9a2" />
        </linearGradient>
        <radialGradient id="sf-warm" cx="0.5" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#fff6e0" stopOpacity="0.5" />
          <stop offset="1" stopColor="#e9a46e" stopOpacity="0.25" />
        </radialGradient>
        <radialGradient id="sf-bulb">
          <stop offset="0" stopColor="#fffbe6" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fffbe6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sf-wood" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7c4330" />
          <stop offset="0.5" stopColor="#8d4e37" />
          <stop offset="1" stopColor="#713b28" />
        </linearGradient>
        <linearGradient id="sf-frost" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff2dc" />
          <stop offset="1" stopColor="#f2d6b4" />
        </linearGradient>
        <pattern id="sf-tile" width="44" height="22" patternUnits="userSpaceOnUse">
          <rect width="44" height="22" fill={TILE} />
          <rect x="2" y="2" width="40" height="8" fill="#ddc088" />
          <rect x="24" y="13" width="18" height="7" fill="#e0c690" />
          <path d="M0 11 H44 M0 22 H44 M22 0 V11 M0 11 V22 M44 11 V22" stroke="#bf9f63" strokeWidth="1.5" />
        </pattern>
        <pattern id="sf-dark-tile" width="30" height="30" patternUnits="userSpaceOnUse">
          <rect width="30" height="30" fill="#59606b" />
          <path d="M0 15 H30 M15 0 V30" stroke="#4b515b" strokeWidth="2" />
        </pattern>
      </defs>

      {/* upper floor wall + neighbours */}
      <rect width="1600" height="320" fill="#e8ddc7" />
      <rect width="1600" height="26" fill="#d6c8ad" />
      <rect x="0" y="0" width="64" height="900" fill="url(#sf-dark-tile)" />
      <rect x="1536" y="0" width="64" height="900" fill="#a9abb2" />
      {[1550, 1570, 1590].map(x => (
        <line key={x} x1={x} y1="0" x2={x} y2="900" stroke="#989aa2" strokeWidth="2" />
      ))}

      {/* sign */}
      <rect x="200" y="60" width="1200" height="150" rx="6" fill="url(#sf-sign)" stroke="#9fb3ec" strokeWidth="5" />
      <rect x="214" y="74" width="1172" height="122" rx="3" fill="none" stroke="#c5d2f7" strokeWidth="2" opacity="0.8" />
      <path d="M200 60 H700 L620 210 H200 Z" fill="#fff" opacity="0.06" />
      <g fontFamily="Georgia, 'Times New Roman', serif" fill="#e3eaff" textAnchor="middle">
        <text x="800" y="114" fontSize="34" letterSpacing="1">Patisserie</text>
        <text x="800" y="186" fontSize="88" fontWeight="700" letterSpacing="3">Plain</text>
      </g>
      <rect x="200" y="210" width="1200" height="10" fill="#000" opacity="0.1" />

      {/* storefront */}
      <rect x="64" y="300" width="1472" height="484" fill="url(#sf-tile)" />

      {/* awning */}
      <rect x="66" y="228" width="1468" height="12" fill="#2b3e95" />
      <path d="M70 238 H1530 L1556 292 H44 Z" fill="url(#sf-awning)" />
      <path d="M70 238 H1530 L1534 248 H66 Z" fill="#fff" opacity="0.15" />
      <rect x="44" y="292" width="1512" height="12" fill="#22338a" />
      <rect x="64" y="304" width="1472" height="16" fill="#000" opacity="0.14" />

      {/* small display window */}
      <rect x="100" y="334" width="180" height="276" fill={WOOD_DARK} />
      <Interior x={110} y={344} w={160} h={256} />

      {/* door */}
      <rect x="300" y="322" width="222" height="462" fill={WOOD_DARK} />
      <rect x="312" y="334" width="198" height="450" fill="url(#sf-wood)" />
      <rect x="336" y="362" width="150" height="176" fill="#5a2f20" />
      <Panes x={342} y={368} n={4} size={32} />
      <rect x="342" y="398" width="138" height="104" fill="url(#sf-frost)" />
      <circle className="glow" cx="411" cy="440" r="40" fill="url(#sf-bulb)" opacity="0.7" />
      <Panes x={342} y={508} n={4} size={32} />
      <rect x="336" y="560" width="150" height="196" fill="#7a4029" />
      {Array.from({ length: 7 }, (_, i) => (
        <line key={i} x1={354 + i * 19} y1="566" x2={354 + i * 19} y2="750" stroke="#5f301e" strokeWidth="2" />
      ))}
      <rect x="488" y="520" width="9" height="78" rx="4" fill="#d3bb8f" />
      <rect x="312" y="764" width="198" height="20" fill="#5f301e" />

      {/* wall lamp */}
      <rect x="532" y="334" width="16" height="6" fill="#3a2a22" />
      <rect x="534" y="340" width="12" height="22" rx="3" fill="#fff4cc" stroke="#3a2a22" strokeWidth="2" />
      <circle className="glow" cx="540" cy="352" r="30" fill="url(#sf-bulb)" />

      {/* big window */}
      <rect x="560" y="322" width="770" height="300" fill="#3a2820" />
      <Interior x={572} y={334} w={746} h={288} />

      {/* planter with hedge */}
      <Hedge />
      <rect x="566" y="662" width="800" height="122" fill="#9b6a4a" />
      <rect x="560" y="654" width="812" height="14" fill="#b88560" />
      {[702, 742].map(y => (
        <line key={y} x1="566" y1={y} x2="1366" y2={y} stroke="#835638" strokeWidth="3" />
      ))}
      {[766, 966, 1166].map(x => (
        <line key={x} x1={x} y1="668" x2={x} y2="784" stroke="#835638" strokeWidth="3" />
      ))}

      {/* "Birthday Cake" A-frame chalkboard */}
      <g transform="translate(96 560)">
        <path d="M14 230 L28 10 M178 230 L164 10" stroke="#6b4a33" strokeWidth="8" strokeLinecap="round" />
        <rect x="12" y="6" width="168" height="186" rx="6" fill="#2d3a38" stroke="#7b5a3e" strokeWidth="8" />
        <text x="96" y="48" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="27" fill="#ffd3e2">Birthday</text>
        <text x="104" y="78" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="27" fill="#fff1a8">Cake ♪</text>
        <g transform="translate(96 124)">
          <rect x="-26" y="-10" width="52" height="26" rx="3" fill="none" stroke="#ffe3ef" strokeWidth="2.5" />
          <path d="M-26 -2 Q-20 4 -13 -2 Q-6 4 0 -2 Q6 4 13 -2 Q20 4 26 -2" stroke="#ffe3ef" strokeWidth="2.5" fill="none" />
          <path d="M-10 -10 v-10 M0 -10 v-12 M10 -10 v-10" stroke="#fff1a8" strokeWidth="2.5" />
          <circle cx="-10" cy="-23" r="2.5" fill="#ffb37a" />
          <circle cx="0" cy="-25" r="2.5" fill="#ffb37a" />
          <circle cx="10" cy="-23" r="2.5" fill="#ffb37a" />
        </g>
        {[150, 164, 178].map((y, i) => (
          <path key={y} d={`M${34 + i * 6} ${y} q10 -4 20 0 t20 0 t20 0 t20 0 t20 0`} stroke="#cfe6ff" strokeWidth="2" fill="none" opacity="0.7" />
        ))}
      </g>

      {/* step + sidewalk */}
      <rect x="40" y="784" width="1520" height="22" fill="#bcb6ab" />
      <rect x="40" y="784" width="1520" height="4" fill="#d6d1c7" />
      <rect y="806" width="1600" height="94" fill="#cbc7c1" />
      {Array.from({ length: 17 }, (_, i) => (
        <line key={i} x1={i * 100} y1="806" x2={i * 100 - 20} y2="900" stroke="#bab5ae" strokeWidth="2" />
      ))}
      <ellipse cx="945" cy="830" rx="360" ry="22" fill="#ffd9a8" opacity="0.25" />
      <ellipse cx="410" cy="830" rx="110" ry="14" fill="#ffd9a8" opacity="0.2" />
    </svg>
  );
}
