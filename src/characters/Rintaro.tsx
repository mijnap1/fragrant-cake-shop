import type { Expr } from '../story/types';
import { Blush, Fx, Inked, Limb, Mirror, VIEWBOX, flip, line } from './parts';
import type { SpriteProps } from './types';

const SKIN = '#ffe8da';
const SKIN_SHADE = '#f1c9b6';
const SKIN_INK = '#a8786a';
const LASH = '#21160f';
const HAIR = 'url(#rin-hair)';
const HAIR_INK = '#6f5a3a';
const SHIRT = '#fcfbf9';
const SHIRT_INK = '#a7a0a0';
const APRON = 'url(#rin-apron)';
const APRON_INK = '#c47a68';

/* ---------- face ---------- */

const FACE_D = 'M66 72 Q65 100 68 118 Q76 136 92 148 Q100 152 108 148 Q124 136 132 118 Q135 100 134 72 Q134 40 100 38 Q66 40 66 72 Z';
const EAR_D = 'M68 97 Q60 90 57 98 Q55.6 111 61 120 Q64 125 69 122 Z';
const EYE_D = 'M72.6 102.6 Q77.6 99.2 83 99.4 Q90 99.6 93.4 101.8 Q90.4 106.4 83 107 Q76 107 72.6 102.6 Z';
// A smile lifts the lower lid into a gentle curve.
const EYE_SMILE = 'M72.6 102.6 Q77.6 99.2 83 99.4 Q90 99.6 93.4 101.8 Q89.6 103.8 83 104.6 Q76.4 104.4 72.6 102.6 Z';
const EYE_WIDE = 'M72.6 102.4 Q77 97.4 83 97.4 Q90 97.6 93.4 101.4 Q90.6 108 83 108.6 Q75.6 108.4 72.6 102.4 Z';

/** `look` shifts the iris sideways; both eyes get the same world-space shift so they glance together. */
function Eye({ e, blink, look }: { e: Expr; blink: boolean; look: number }) {
  // A wide grin closes his eyes into arcs; a small smile just softens them.
  if (e === 'happy') return <path d="M72.4 104 Q82.6 97 93.4 103" {...line(LASH, 1.9)} />;
  if (blink) return <path d="M71 103.4 Q82 105.6 93.4 102.4" {...line(LASH, 1.9)} />;
  const shock = e === 'surprised';
  const smile = e === 'smile';
  const cy = shock ? 103 : 102.8;
  return (
    <g>
      <path d={shock ? EYE_WIDE : smile ? EYE_SMILE : EYE_D} fill="#fff" />
      <g clipPath={shock ? 'url(#rin-eye-wide)' : smile ? 'url(#rin-eye-smile)' : 'url(#rin-eye)'}>
        <circle cx={84 + look} cy={cy} r={shock ? 2.7 : 3.5} fill="url(#rin-iris)" stroke="#3a2614" strokeWidth={0.6} />
        <circle cx={84 + look} cy={cy + 0.2} r={shock ? 1.1 : 1.5} fill="#1a110a" />
        <circle cx={83 + look} cy={cy - 1.2} r={0.75} fill="#fff" />
        <path d="M70 101.4 Q83 104.6 96 101.4 L96 96 L70 96 Z" fill="#8b7262" opacity={0.25} />
      </g>
      {/* heavy upper lid with a winged outer corner */}
      <path
        d={shock ? 'M69.6 104 Q73 97 82 96.4 Q90 96.4 93.8 101 Q90 98.6 82 98.6 Q75 99.2 69.6 104 Z' : 'M69.6 104.2 Q74 99 82 98.2 Q90 98 93.8 101.6 Q90 100 82 100.2 Q75.4 100.8 69.6 104.2 Z'}
        fill={LASH}
        stroke={LASH}
        strokeWidth={0.9}
        strokeLinejoin="round"
      />
      <path d={shock ? 'M75 108 Q83 109.8 91 106.6' : smile ? 'M75.4 104 Q83 105.4 91 103.4' : 'M75.4 106.2 Q83 107.8 91 105.4'} {...line(LASH, 0.7)} opacity={0.6} />
      <path d="M74 97.2 Q82 94.6 91 96.2" {...line('#9a6f5e', 0.8)} opacity={0.6} />
    </g>
  );
}

function Brow({ e }: { e: Expr }) {
  const d =
    e === 'surprised'
      ? 'M71.6 86.4 Q80 83 92 85.2'
      : e === 'troubled' || e === 'blush'
        ? 'M71.6 90.4 Q81 89.6 92 86'
        : e === 'smile' || e === 'happy'
          ? 'M71.6 89 Q80 86.6 92 88.2'
          : 'M71.6 89.4 Q80 87.4 92 89.2';
  return (
    <g>
      <ellipse cx={88} cy={92} rx={5} ry={1.6} fill="#e3b29d" opacity={0.45} />
      <path d={d} {...line('#86653f', 1.5)} />
    </g>
  );
}

function Mouth({ e, talk }: { e: Expr; talk: boolean }) {
  const INK = '#5a2f2a';
  if (e === 'happy' && !talk) {
    // big toothy grin
    return (
      <g>
        <path d="M90.6 128.6 Q100 131 109.4 128.4 Q107.4 138 100 138.6 Q92.6 138 90.6 128.6 Z" fill="#fff" stroke={INK} strokeWidth={1.1} strokeLinejoin="round" />
        <path d="M92 133.4 Q100 135 108 133.2" {...line('#c9b8b4', 0.7)} />
      </g>
    );
  }
  if (e === 'surprised') {
    return (
      <g>
        <path d="M95.6 130.4 Q100 129.6 104.4 130.4 L103.4 136 Q100 137.2 96.6 136 Z" fill="#a8434f" stroke={INK} strokeWidth={0.9} strokeLinejoin="round" />
      </g>
    );
  }
  if (talk) return <path d="M96 131 Q100 131.6 104 131 Q103 135.6 100 135.8 Q97 135.6 96 131 Z" fill="#a8434f" stroke={INK} strokeWidth={0.8} strokeLinejoin="round" />;
  if (e === 'smile') return <path d="M94.6 131.6 Q99 133.6 104.8 130.6" {...line(INK, 1.2)} />;
  if (e === 'blush') return <path d="M95.4 132.6 Q97.6 131.2 100 132.6 Q102.4 134 104.6 132.6" {...line(INK, 1.1)} />;
  if (e === 'troubled') return <path d="M95.4 133.4 Q100 131 104.6 133.4" {...line(INK, 1.1)} />;
  return <path d="M95 132 Q100 131.6 105 132.2" {...line(INK, 1.2)} />;
}

/* ---------- hair ---------- */

// The ragged hairline across his forehead, temple to temple.
const HAIRLINE =
  'Q131 76 126 72 L122 74.4 L118 68.6 L113.4 73.2 L108.4 67.4 L103.4 72.4 L98.6 66.8 L93.6 72.2 L88.6 67.4 L83.4 73.2 L78.6 69 L74.4 74.2 Q69 76 67 92';

/**
 * Short, spiky ash-blond hair swept up and back off the forehead: an oval mass
 * whose rim is broken into sharp strands that flick upward, longest on top.
 */
function spikyHair() {
  const [cx, cy, rx, ry] = [100, 74, 42, 40];
  // [length, width] of each strand around the rim, left temple → right temple
  const STRANDS = [
    [9, 1], [12, 1.4], [7, 0.8], [14, 1.3], [11, 1.1], [15, 1.5], [10, 0.9], [14, 1.2], [12, 1.4],
    [8, 0.8], [13, 1.2], [15, 1.4], [10, 1], [13, 1.3], [8, 0.9], [12, 1.2], [10, 1.1], [7, 0.8],
  ];
  const at = (deg: number, grow: number) => {
    const a = (deg * Math.PI) / 180;
    const [nx, ny] = [Math.cos(a), -Math.sin(a)];
    // top strands are brushed up; the ones over the temples droop outward
    const lean = grow * (0.5 * Math.sin(a) - 0.15);
    return [cx + rx * nx + nx * grow + Math.sign(nx) * grow * 0.2, cy + ry * ny + ny * grow - lean].map(v => +v.toFixed(1));
  };
  const from = 204;
  const total = STRANDS.reduce((sum, [, w]) => sum + w, 0);
  const unit = (from - (180 - from)) / total;
  let deg = from;
  let d = `M64 112 L62 100 L${at(from, 0).join(' ')}`;
  for (const [len, w] of STRANDS) {
    const tip = at(deg - unit * w * 0.6, len);
    deg -= unit * w;
    const base = at(deg, 0);
    // a slightly curved edge on the way up, a straight one back down
    d += ` Q${at(deg + unit * w * 0.85, len * 0.55).join(' ')} ${tip.join(' ')} L${base.join(' ')}`;
  }
  return `${d} L138 100 L136 112 L133 92 ${HAIRLINE} Z`;
}
const HAIR_D = spikyHair();
const ROOTS = 'M67 92 Q69 76 74.4 74.2 L78.6 69 L83.4 73.2 L88.6 67.4 L93.6 72.2 L98.6 66.8 L103.4 72.4 L108.4 67.4 L113.4 73.2 L118 68.6 L122 74.4 L126 72 Q131 76 133 92 L130 80 Q126 66 100 63 Q74 66 70 80 Z';

/* ---------- outfit ---------- */

/**
 * White shirt and the shop's apron, with a little cake on the pocket.
 * The shirt's sides are his hanging arms; with `raised`, his left arm (viewer's right)
 * is left off so the raised arm can be drawn instead.
 */
function ShopApron({ raised = false }: { raised?: boolean }) {
  return (
    <g>
      <Inked
        d={[
          raised
            ? 'M12 410 Q10 240 16 214 Q20 194 42 188 Q66 182 86 176 L114 176 Q134 182 158 188 Q166 192 167 204 Q174 290 170 410 Z'
            : 'M12 410 Q10 240 16 214 Q20 194 42 188 Q66 182 86 176 L114 176 Q134 182 158 188 Q180 194 184 214 Q190 240 188 410 Z',
        ]}
        fill={SHIRT}
        ink={SHIRT_INK}
        w={2}
      />
      <path d={raised ? 'M34 200 Q26 290 30 410' : 'M34 200 Q26 290 30 410 M166 200 Q174 290 170 410'} {...line(SHIRT_INK, 1.4)} />
      <path d={raised ? 'M20 250 Q24 300 20 360' : 'M20 250 Q24 300 20 360 M180 250 Q176 300 180 360'} {...line('#e6e0de', 2)} />
      {/* open band collar */}
      <path d="M90 172 L100 198 L110 172 Z" fill={SKIN_SHADE} />
      <Mirror>
        <path d="M86 162 L84 178 L98 198 L99.4 190 L91 178 L91 166 Z" fill={SHIRT} stroke={SHIRT_INK} strokeWidth={1.2} strokeLinejoin="round" />
      </Mirror>
      <path d="M100 198 L100 410" {...line(SHIRT_INK, 1)} />
      {/* neck strap */}
      <Mirror>
        <path d="M74 214 L88 174" {...line(APRON_INK, 6.4)} />
        <path d="M74 214 L88 174" {...line('#f4b8a8', 4)} />
      </Mirror>
      {/* bib and skirt */}
      <Inked d={['M68 212 Q100 206 132 212 L135 288 Q156 294 158 410 L42 410 Q44 294 65 288 Z']} fill={APRON} ink={APRON_INK} w={2} />
      <path d="M72 218 Q100 213 128 218" {...line('#fff1ec', 1)} strokeDasharray="3 3" />
      <path d="M58 320 Q62 350 56 410 M142 320 Q138 350 144 410" {...line(APRON_INK, 1)} opacity={0.5} />
      {/* waist tie with a bow at his side */}
      <path d="M44 290 Q100 298 156 290" {...line(APRON_INK, 7)} />
      <path d="M44 290 Q100 298 156 290" {...line('#f1ae9c', 4.6)} />
      <path d="M150 292 Q164 280 166 292 Q164 302 150 292 Q160 306 158 318 M150 292 Q148 306 142 316" {...line(APRON_INK, 2.6)} />
      {/* pocket with a cake */}
      <rect x={86} y={232} width={28} height={22} rx={6} fill="#fbdcd2" stroke={APRON_INK} strokeWidth={1.4} />
      <path d="M93.6 249 h12.8 v-6 h-12.8 z M93.6 243 q6.4 -6.6 12.8 0" fill="#fff7f1" stroke={APRON_INK} strokeWidth={1.1} strokeLinejoin="round" />
      <circle cx={100} cy={236.6} r={1.9} fill="#ef4f6c" />
      <rect x={70} y={318} width={60} height={36} rx={4} fill="none" stroke={APRON_INK} strokeWidth={1} strokeDasharray="3 2.4" />
    </g>
  );
}

/* ---------- sprite ---------- */

export function Rintaro({ e, blink, talk }: SpriteProps) {
  // Embarrassed or flustered → scratches the back of his head.
  const scratch = e === 'blush' || e === 'troubled';
  // glances off to the side when embarrassed
  const look = e === 'blush' ? -2 : 0;
  return (
    <svg viewBox={VIEWBOX} xmlns="http://www.w3.org/2000/svg" overflow="visible">
      <defs>
        <linearGradient id="rin-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3e4bb" />
          <stop offset="0.6" stopColor="#e4cd98" />
          <stop offset="1" stopColor="#cfb37c" />
        </linearGradient>
        <linearGradient id="rin-iris" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a2f1c" />
          <stop offset="1" stopColor="#a8784c" />
        </linearGradient>
        <linearGradient id="rin-apron" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8cdc0" />
          <stop offset="1" stopColor="#efa996" />
        </linearGradient>
        <clipPath id="rin-eye">
          <path d={EYE_D} />
        </clipPath>
        <clipPath id="rin-eye-smile">
          <path d={EYE_SMILE} />
        </clipPath>
        <clipPath id="rin-eye-wide">
          <path d={EYE_WIDE} />
        </clipPath>
      </defs>

      <g className="breathe">
        <g transform="translate(0 -12)">
          <path d="M86 138 L84 192 L116 192 L114 138 Z" fill={SKIN_SHADE} stroke={SKIN_INK} strokeWidth={1.2} />
          <path d="M91 160 Q93 170 87 186 M109 160 Q107 170 113 186 M98 168 Q100 171 102 168" {...line(SKIN_INK, 0.8)} opacity={0.6} />
          <ShopApron raised={scratch} />
        {/* scratching the back of his head: the hand is hidden behind his hair */}
        {scratch && (
          <g>
            <Limb d="M154 198 Q178 172 186 130" fill={SHIRT} outline={SHIRT_INK} w={22} />
            <path d="M178.6 132 C177 112 164 94 140 78 L148 64 C172 80 192.6 104 192 132 Z" fill={SKIN} stroke={SKIN_INK} strokeWidth={1.4} strokeLinejoin="round" />
            <path d="M187.4 118 Q182 102 168 90" {...line(SKIN_INK, 0.9)} opacity={0.4} />
            <path d="M172 126 Q185 120 198.6 126 L197.6 137.6 Q185 131.6 173 137.6 Z" fill={SHIRT} stroke={SHIRT_INK} strokeWidth={1.4} strokeLinejoin="round" />
            <path d="M172.8 131.8 Q185 125.6 198 131.8" {...line(SHIRT_INK, 1)} />
          </g>
        )}
        </g>


        <g className="headbob">
          <Mirror>
            <Inked d={[EAR_D]} fill={SKIN} ink={SKIN_INK} w={1.4} />
            <path d="M65 100 Q60.4 103 61 111 Q62 117 65.4 118.6" {...line(SKIN_INK, 0.9)} />
          </Mirror>
          {/* earrings: a hoop in each lobe and a stud on one side */}
          <circle cx={62} cy={125.4} r={3} {...line('#9aa1b3', 1.6)} />
          <circle cx={138} cy={125.4} r={3} {...line('#9aa1b3', 1.6)} />
          <circle cx={58.6} cy={113} r={1.3} fill="#dfe2ea" stroke="#868c9c" strokeWidth={0.6} />

          <Inked d={[FACE_D]} fill={SKIN} ink={SKIN_INK} w={1.6} />
          {/* the bold anime jawline */}
          <path d="M70 120 Q78 132 88 140 L74 128 Z" fill={SKIN_SHADE} opacity={0.5} />
          <Blush id="rin" x={78} y={118} amount={e === 'blush' ? 1 : 0} hatch="#e0798a" />
          <path d="M97.6 106 L97.6 109.4 M99.6 105.6 L99.6 109.6 M101.6 106 L101.6 109.4" {...line('#c89a88', 0.6)} opacity={0.7} />
          <path d="M102 110 L103 119" {...line('#e2b3a1', 1)} />
          <path d="M97.4 121.4 Q100 123.6 103.4 121.6 Q102 119.8 100.4 120.4" fill="#e8b7a4" stroke="#b07a68" strokeWidth={0.8} strokeLinejoin="round" />
          <path d="M98 135.6 L102 135.6" {...line('#c08d7c', 0.8)} />
          <Mouth e={e} talk={talk} />

          <Inked d={[HAIR_D]} fill={HAIR} ink={HAIR_INK} w={1.6} />
          <path d={ROOTS} fill="#c9ad78" opacity={0.7} />
          <path
            d="M86 66 Q80 52 72 40 M95 64 Q92 48 88 34 M105 64 Q106 48 108 34 M115 66 Q120 52 128 40 M76 72 Q68 66 62 58 M124 72 Q132 66 138 58 M70 84 Q64 80 58 76 M130 84 Q136 80 142 76"
            {...line(HAIR_INK, 0.8)}
            opacity={0.55}
          />
          <path d="M84 50 Q82 42 80 34 Q86 42 88 50 Z M100 46 Q100 38 101 30 Q104 38 103 46 Z M114 48 Q117 40 121 34 Q120 42 117 50 Z M70 60 Q64 54 60 50 Q67 53 72 57 Z" fill="#fbf4dc" />
          <path d={flip('M70 60 Q64 54 60 50 Q67 53 72 57 Z')} fill="#fbf4dc" opacity={0.7} />

          <Eye e={e} blink={blink} look={look} />
          <Brow e={e} />
          <g transform="matrix(-1 0 0 1 200 0)">
            <Eye e={e} blink={blink} look={-look} />
            <Brow e={e} />
          </g>
          <Fx e={e} accent="#e0a93b" sweat={e === 'surprised'} />
        </g>


      </g>
    </svg>
  );
}
