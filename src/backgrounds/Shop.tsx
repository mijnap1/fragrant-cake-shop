/* Inside the cake shop: menu boards, kitchen pass-through, curved glass showcase. */

const CHALK = '#2f3b37';
const FRAME = '#b9825b';
const STEEL = '#cfd5da';

type Mini = 'short' | 'roll' | 'tart' | 'round' | 'mont' | 'melon' | 'choco';

/** Small cakes for the showcase; (x, y) is the bottom-centre on the shelf. */
function MiniCake({ type, x, y }: { type: Mini; x: number; y: number }) {
  const shadow = <ellipse cx={x} cy={y} rx="30" ry="5" fill="#000" opacity="0.08" />;
  switch (type) {
    case 'short':
      return (
        <g>
          {shadow}
          <path d={`M${x - 28} ${y} V${y - 30} L${x + 6} ${y - 40} L${x + 26} ${y - 30} V${y} Z`} fill="#ffe0a0" />
          <path d={`M${x - 28} ${y - 30} L${x + 6} ${y - 40} L${x + 26} ${y - 30} L${x - 8} ${y - 22} Z`} fill="#fffaf2" />
          <rect x={x - 28} y={y - 18} width="54" height="6" fill="#fffaf2" />
          {[-20, -8, 4, 16].map(dx => (
            <ellipse key={dx} cx={x + dx} cy={y - 15} rx="4" ry="2.4" fill="#f27b8e" />
          ))}
          <path d={`M${x} ${y - 46} q-6 -2 -5 6 q5 7 10 0 q1 -8 -5 -6`} fill="#ef4f6c" />
        </g>
      );
    case 'roll':
      return (
        <g>
          {shadow}
          <rect x={x - 26} y={y - 38} width="40" height="38" rx="4" fill="#f3c48a" />
          <circle cx={x + 14} cy={y - 19} r="19" fill="#ffe3a3" stroke="#e9b071" strokeWidth="3" />
          <path d={`M${x + 14} ${y - 19} m0 -3 a3 3 0 1 1 -3 3 a7 7 0 1 1 7 -7 a11 11 0 1 1 -11 11`} stroke="#fffaf2" strokeWidth="4" fill="none" />
        </g>
      );
    case 'tart':
    case 'melon':
      return (
        <g>
          {shadow}
          <path d={`M${x - 28} ${y - 16} L${x - 24} ${y} H${x + 24} L${x + 28} ${y - 16} Z`} fill="#e2a464" />
          <ellipse cx={x} cy={y - 16} rx="28" ry="7" fill={type === 'melon' ? '#bfe08e' : '#fff3d6'} />
          {type === 'melon'
            ? [-16, -6, 4, 14].map(dx => <path key={dx} d={`M${x + dx - 6} ${y - 16} q6 -12 12 0 z`} fill="#93c45a" />)
            : [
                [-14, '#ef4f6c'],
                [-3, '#ffb347'],
                [8, '#4f5fae'],
                [17, '#7fbf6a'],
              ].map(([dx, c]) => <circle key={dx} cx={x + Number(dx)} cy={y - 20} r="5" fill={String(c)} />)}
        </g>
      );
    case 'mont':
      return (
        <g>
          {shadow}
          <rect x={x - 20} y={y - 10} width="40" height="10" rx="3" fill="#e9c08a" />
          <path d={`M${x - 20} ${y - 10} Q${x - 20} ${y - 44} ${x} ${y - 46} Q${x + 20} ${y - 44} ${x + 20} ${y - 10} Z`} fill="#c99a63" />
          {[-12, -4, 4, 12].map(dx => (
            <path key={dx} d={`M${x + dx} ${y - 12} Q${x + dx * 0.6} ${y - 30} ${x + dx * 0.2} ${y - 42}`} stroke="#b07f4b" strokeWidth="2" fill="none" />
          ))}
          <circle cx={x} cy={y - 50} r="6" fill="#8a5a32" />
        </g>
      );
    default: {
      const top = type === 'choco' ? '#7a4a36' : '#ffc8d6';
      return (
        <g>
          {shadow}
          <rect x={x - 22} y={y - 34} width="44" height="34" rx="5" fill={type === 'choco' ? '#8a5a44' : '#fff3f6'} />
          <ellipse cx={x} cy={y - 34} rx="22" ry="6" fill={top} />
          <circle cx={x} cy={y - 42} r="6" fill="#ef4f6c" />
          <path d={`M${x - 22} ${y - 24} q5 5 11 0 t11 0 t11 0 t11 0`} stroke={top} strokeWidth="3" fill="none" />
        </g>
      );
    }
  }
}

function PriceCard({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y - 22} width="44" height="20" rx="2" fill="#fff" stroke="#e6dcd2" strokeWidth="1.5" />
      <path d={`M${x + 6} ${y - 15} h24 M${x + 6} ${y - 9} h32`} stroke="#c9b8a8" strokeWidth="2" />
    </g>
  );
}

const SHELVES: { y: number; cakes: Mini[] }[] = [
  { y: 660, cakes: ['short', 'round', 'tart', 'roll', 'mont', 'choco', 'short', 'melon', 'round'] },
  { y: 770, cakes: ['roll', 'melon', 'short', 'choco', 'tart', 'round', 'mont', 'roll', 'short'] },
  { y: 872, cakes: ['round', 'mont', 'roll', 'short', 'melon', 'tart', 'choco', 'round', 'mont'] },
];

function Pendant({ x, y, i }: { x: number; y: number; i: number }) {
  return (
    <g>
      <line x1={x} y1="0" x2={x} y2={y - 26} stroke="#6b5a52" strokeWidth="3" />
      <rect x={x - 7} y={y - 34} width="14" height="10" rx="2" fill="#5d4d45" />
      <circle className="glow" style={{ animationDelay: `${-i * 1.1}s` }} cx={x} cy={y} r="90" fill="url(#sh-bulb)" />
      <circle cx={x} cy={y} r="27" fill="#fff8e6" opacity="0.55" stroke="#ead6b4" strokeWidth="2" />
      <path d={`M${x - 6} ${y + 4} q6 -14 12 0`} stroke="#ffcf7a" strokeWidth="2.5" fill="none" />
      <circle cx={x - 9} cy={y - 10} r="5" fill="#fff" opacity="0.8" />
    </g>
  );
}

function MenuBoards() {
  const chalk = { fontFamily: "'Fredoka', 'Jua', sans-serif" };
  return (
    <g>
      <rect x="432" y="104" width="290" height="186" rx="4" fill={FRAME} />
      <rect x="444" y="116" width="266" height="162" fill={CHALK} />
      <text x="458" y="148" {...chalk} fontSize="22" fill="#fff" transform="rotate(-8 458 148)">Plain</text>
      <text x="520" y="150" {...chalk} fontSize="21" fill="#fff6c9">♡ This month</text>
      {['• Fruit Tart', '• Strawberry Crêpe', '• Melon Tart'].map((t, i) => (
        <text key={t} x="468" y={186 + i * 28} {...chalk} fontSize="19" fill="#ffe873">{t}</text>
      ))}
      <path d="M640 170 q20 -20 40 0 q10 20 -10 30 q-20 4 -26 -12" stroke="#e8f0ec" strokeWidth="2" fill="none" />
      <circle cx="655" cy="182" r="3" fill="#e8f0ec" />
      <circle cx="668" cy="182" r="3" fill="#e8f0ec" />
      <path d="M640 236 q14 -16 28 0 t28 0" stroke="#e8f0ec" strokeWidth="2" fill="none" />

      <rect x="732" y="104" width="290" height="186" rx="4" fill={FRAME} />
      <rect x="744" y="116" width="266" height="162" fill={CHALK} />
      <path d="M760 136 q10 -8 20 0 M984 136 q10 -8 20 0" stroke="#b9e08a" strokeWidth="2.5" fill="none" />
      <text x="877" y="146" textAnchor="middle" {...chalk} fontSize="24" fill="#d8f0b0">Cafe Menu</text>
      <rect x="846" y="156" width="64" height="20" fill="none" stroke="#fff" strokeWidth="1.5" />
      <text x="878" y="171" textAnchor="middle" {...chalk} fontSize="13" fill="#fff">DRINKS</text>
      {['• Coffee 300', '• Caffe Latte 350', '• Tea 300', '• Royal Milk Tea 400'].map((t, i) => (
        <text key={t} x="812" y={198 + i * 20} {...chalk} fontSize="15" fill="#fff">{t}</text>
      ))}
      <path d="M764 180 h26 l-4 60 h-18 Z M770 196 h14" stroke="#fff" strokeWidth="2" fill="none" />
      <path d="M778 176 l10 -18" stroke="#fff" strokeWidth="2" />
      <path d="M958 238 h34 q0 18 -17 18 q-17 0 -17 -18 Z M992 242 q8 0 6 8 q-2 4 -7 2" stroke="#fff" strokeWidth="2" fill="none" />
      <path d="M966 230 q-4 -8 2 -14 M978 228 q-4 -8 2 -14" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.7" />
      <path d="M770 266 q20 -10 40 0 t40 0 t40 0 t40 0 t40 0" stroke="#b9e08a" strokeWidth="2.5" fill="none" />
    </g>
  );
}

function Kitchen() {
  return (
    <g>
      <rect x="372" y="300" width="710" height="252" fill={FRAME} />
      <rect x="388" y="316" width="678" height="236" fill="url(#sh-kitchen)" />
      <rect x="560" y="322" width="240" height="7" rx="3" fill="#fff" />
      <rect x="520" y="336" width="300" height="62" fill="#f7f8f9" stroke="#d2d7dc" strokeWidth="2" />
      {[620, 720].map(x => (
        <line key={x} x1={x} y1="336" x2={x} y2="398" stroke="#d2d7dc" strokeWidth="2" />
      ))}
      {/* baking rack */}
      <g stroke="#aeb5bc" strokeWidth="3">
        <path d="M410 360 V552 M486 360 V552" />
        {[380, 410, 440, 470, 500, 530].map(y => (
          <path key={y} d={`M410 ${y} H486`} />
        ))}
      </g>
      <rect x="840" y="400" width="120" height="152" fill="#c9cfd4" />
      <rect x="850" y="410" width="100" height="70" fill="#dfe4e8" />
      {/* stand mixer */}
      <g transform="translate(990 470)">
        <rect x="-20" y="50" width="56" height="12" rx="4" fill="#8f979e" />
        <rect x="18" y="-8" width="16" height="60" rx="6" fill="#8f979e" />
        <path d="M-24 -10 h56 q4 0 4 10 v4 h-60 Z" fill="#9aa2a9" />
        <path d="M-14 6 h30 l-4 34 h-22 Z" fill="#c4cad0" />
      </g>
      {/* "Birthday Cake" stand card */}
      <g transform="translate(700 460)">
        <rect x="-28" y="-40" width="56" height="62" rx="3" fill="#fffbe0" stroke="#e6c46a" strokeWidth="2" />
        <text x="0" y="-22" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="11" fill="#e07a9c">Birthday</text>
        <text x="0" y="-10" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="11" fill="#e07a9c">Cake</text>
        <rect x="-12" y="0" width="24" height="12" rx="2" fill="#ffc8d6" />
        <circle cx="0" cy="-2" r="3" fill="#ef4f6c" />
        <path d="M0 22 v40" stroke="#c9b28a" strokeWidth="3" />
      </g>
    </g>
  );
}

function Basket({ x, y, w, items }: { x: number; y: number; w: number; items: string[] }) {
  return (
    <g>
      {items.map((c, i) => (
        <rect key={i} x={x + 10 + i * ((w - 20) / items.length)} y={y - 22 - (i % 2) * 6} width={(w - 30) / items.length} height="30" rx="5" fill={c} stroke="#fff" strokeWidth="2" />
      ))}
      <path d={`M${x} ${y} H${x + w} L${x + w - 8} ${y + 40} H${x + 8} Z`} fill="#d9a35f" />
      {Array.from({ length: Math.floor(w / 10) }, (_, i) => (
        <line key={i} x1={x + 6 + i * 10} y1={y + 2} x2={x + 10 + i * 10} y2={y + 38} stroke="#b9823f" strokeWidth="2" />
      ))}
      <rect x={x - 3} y={y - 3} width={w + 6} height="8" rx="4" fill="#e7b874" />
    </g>
  );
}

export function Shop() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sh-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8e2cb" />
          <stop offset="1" stopColor="#efcdae" />
        </linearGradient>
        <linearGradient id="sh-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ecd2ab" />
          <stop offset="1" stopColor="#dcb486" />
        </linearGradient>
        <linearGradient id="sh-kitchen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3f5f6" />
          <stop offset="1" stopColor="#d9dee2" />
        </linearGradient>
        <radialGradient id="sh-bulb">
          <stop offset="0" stopColor="#fff6d6" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff6d6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sh-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#e3f1f5" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* ceiling + walls */}
      <rect width="1600" height="900" fill="url(#sh-wall)" />
      <rect width="1600" height="64" fill="#f1d5bb" />
      <rect y="62" width="1600" height="8" fill="#e0bb9a" />
      {[580, 1160].map(x => (
        <g key={x}>
          <ellipse cx={x} cy="40" rx="34" ry="9" fill="#fff6e0" />
          <ellipse className="glow" cx={x} cy="60" rx="120" ry="40" fill="url(#sh-bulb)" />
        </g>
      ))}
      <rect x="1470" y="70" width="130" height="830" fill="#e9c4a2" />
      <rect x="1468" y="70" width="6" height="830" fill="#dcb08c" />

      {/* side door */}
      <rect x="0" y="310" width="270" height="590" fill="#9a5c3c" />
      <rect x="0" y="318" width="262" height="582" fill="#c58457" />
      {Array.from({ length: 8 }, (_, i) => (
        <line key={i} x1={i * 32 + 14} y1="324" x2={i * 32 + 14} y2="900" stroke="#ad6d45" strokeWidth="3" />
      ))}
      <rect x="0" y="326" width="262" height="10" fill="#e2c8b0" opacity="0.6" />
      <rect x="28" y="452" width="64" height="86" fill="#fff" stroke="#eadfd4" strokeWidth="2" />

      <MenuBoards />
      <Kitchen />

      {/* back counter with baskets */}
      <rect x="372" y="552" width="1100" height="20" fill="#e6c89f" />
      <rect x="372" y="572" width="1100" height="40" fill="#d9ad80" />
      <Basket x={520} y={516} w={150} items={['#ffd6e2', '#e3d4fb', '#fff1b8']} />
      <Basket x={1236} y={516} w={210} items={['#f5d3a6', '#fbe6c6', '#f0c48e', '#fff1d6']} />

      {/* register counter */}
      <rect x="54" y="584" width="410" height="20" fill="#f0d8b4" />
      <rect x="74" y="604" width="370" height="296" fill="url(#sh-wood)" />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={86 + i * 40} y1="606" x2={86 + i * 40} y2="900" stroke="#cfa679" strokeWidth="2" />
      ))}
      <rect x="180" y="530" width="196" height="56" rx="8" fill="#f6efe9" stroke="#e0d6ce" strokeWidth="2" />
      <rect x="252" y="500" width="14" height="32" fill="#d8d0c9" />
      <rect x="196" y="418" width="126" height="86" rx="8" fill="#e9e9ee" stroke="#c9c9cf" strokeWidth="5" />
      <rect x="206" y="428" width="106" height="66" rx="4" fill="#b9c4d1" />
      <rect x="336" y="548" width="26" height="30" rx="4" fill="#5a5a62" />

      {/* steel cart, bottom left */}
      <g stroke={STEEL} strokeWidth="6">
        <path d="M-10 660 H70 M-10 760 H70 M-10 860 H70 M66 650 V900" />
      </g>

      {/* curved glass showcase */}
      <rect x="456" y="586" width="1144" height="314" fill="#f7f1ea" />
      {SHELVES.map(({ y, cakes }) => (
        <g key={y}>
          <rect x="470" y={y} width="1130" height="8" fill="#e6f1f3" />
          <rect x="470" y={y + 8} width="1130" height="3" fill="#cfdde1" />
          {cakes.map((c, i) => {
            const x = 530 + i * 122;
            return (
              <g key={i}>
                <MiniCake type={c} x={x} y={y} />
                <PriceCard x={x + 30} y={y} />
              </g>
            );
          })}
        </g>
      ))}
      <path d="M452 900 V612 Q452 580 486 578 H1600 V900 Z" fill="url(#sh-glass)" />
      <path d="M452 900 V612 Q452 580 486 578 H1600" fill="none" stroke={STEEL} strokeWidth="7" />
      <path d="M470 880 V622 Q470 598 494 596 H1300" fill="none" stroke="#fff" strokeWidth="4" opacity="0.7" />
      {[700, 1060, 1380].map(x => (
        <path key={x} d={`M${x} 900 L${x + 90} 600 H${x + 120} L${x + 30} 900 Z`} fill="#fff" opacity="0.12" />
      ))}

      <Pendant x={96} y={250} i={0} />
      <Pendant x={524} y={250} i={1} />
      <Pendant x={938} y={250} i={2} />
      <Pendant x={1560} y={300} i={3} />
    </svg>
  );
}
