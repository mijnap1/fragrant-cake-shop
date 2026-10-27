import type { Expr } from '../story/types';
import { Blush, Fx, Inked, Limb, Mirror, VIEWBOX, flip, line, lock } from './parts';
import type { SpriteProps } from './types';

/** Outfits she can wear; the casual one is her default for now. */
export type KaoOutfit = 'casual' | 'uniform';

const SKIN = '#ffebe2';
const SKIN_SHADE = '#f6d2c5';
const SKIN_INK = '#b98576';
const HAIR = 'url(#kao-hair)';
const HAIR_INK = '#1b1524';
const LASH = '#1c1626';

/* ---------- face ---------- */

const FACE_D = 'M66.8 96 Q66 114.7 72.3 128.2 Q84.2 144.3 100 147.4 Q115.8 144.3 127.7 128.2 Q134 114.7 133.2 96 Q132.5 62.7 100 60.6 Q67.5 62.7 66.8 96 Z';
// Her ear, peeking out between the side lock and the long hair.
const EAR_D = 'M68.6 104.6 C62.6 101.4 58.8 106.6 60.4 114.6 C61.4 121 64.4 126 70.4 126 Z';
const EYE_D = 'M73.5 111 Q75.6 104.4 84 103.8 Q91.8 104 94 108.6 Q93.4 117.6 85 120.8 Q77 120.4 73.5 111 Z';

function Eye({ e, blink }: { e: Expr; blink: boolean }) {
  // Closed, smiling ^^ eyes.
  if (e === 'smile') {
    return (
      <g>
        <path d="M73 113.4 Q83.5 104 94.4 111" {...line(LASH, 2.2)} />
        <path d="M73.6 112.8 L69.4 114.6 M74.8 110.8 L70.8 110.6" {...line(LASH, 1.2)} />
      </g>
    );
  }
  if (blink) {
    return (
      <g>
        <path d="M73 111.4 Q83.5 117.4 94.4 110.4" {...line(LASH, 2)} />
        <path d="M73.6 111.6 L69.4 110" {...line(LASH, 1.2)} />
      </g>
    );
  }
  const shock = e === 'surprised';
  const sparkle = e === 'happy';
  return (
    <g>
      <path d={EYE_D} fill="#fff" />
      <g clipPath="url(#kao-eye-clip)">
        <ellipse cx={84.5} cy={113} rx={shock ? 5.8 : 6.8} ry={shock ? 7 : 8.2} fill="url(#kao-iris)" stroke="#232a63" strokeWidth={0.7} />
        <ellipse cx={84.5} cy={113.8} rx={shock ? 2 : 2.8} ry={shock ? 2.8 : 3.8} fill="#141838" />
        <ellipse cx={84.5} cy={118.4} rx={4.6} ry={2.2} fill="#c3d3ff" opacity={0.6} />
        <path d="M72 108.4 Q84 111.6 95 107.4 L95 100 L72 100 Z" fill="#1c2150" opacity={0.42} />
        <circle cx={81.6} cy={109.6} r={sparkle ? 2.7 : 2.3} fill="#fff" />
        <circle cx={87.8} cy={116.6} r={1.1} fill="#fff" />
        <circle cx={86.4} cy={111.2} r={0.7} fill="#a6f5e6" />
      </g>
      {/* upper lash line: thick, flaring at the outer corner */}
      <path d="M72 112.6 Q74 104.8 84 103.2 Q91.8 102.8 94.6 108.6 Q91 105.4 84 105.6 Q76.4 106.4 72 112.6 Z" fill={LASH} stroke={LASH} strokeWidth={1.1} strokeLinejoin="round" />
      <path d="M73 109.6 L68.4 108.4 M73.8 107.2 L69.8 104.8 M75.8 105.2 L73 101.8" {...line(LASH, 1.1)} />
      <path d="M76.6 119.8 Q85 122 91.6 118.4" {...line(LASH, 0.8)} opacity={0.55} />
      <path d="M75.2 118.4 L73.6 119.8 M76.6 119.6 L75.6 121.4" {...line(LASH, 0.7)} opacity={0.6} />
      <path d="M87.6 101.2 Q91 100.8 93 102.6" {...line(LASH, 0.7)} opacity={0.35} />
    </g>
  );
}

function Brow({ e }: { e: Expr }) {
  // Soft, gently arched brows that taper towards the temple.
  const brow = (d: string) => <path d={d} fill="#3b3054" opacity={0.85} />;
  if (e === 'troubled' || e === 'blush') return brow('M75.6 97.8 Q84 97.6 92.2 93.6 Q84 96.2 75.6 97.8 Z');
  if (e === 'surprised' || e === 'happy') return brow('M75.6 94.6 Q83 90.4 92.2 93 Q83 92 75.6 94.6 Z');
  return brow('M75.6 96.6 Q83 93 92.2 95.4 Q83 94.6 75.6 96.6 Z');
}

function Mouth({ e, talk }: { e: Expr; talk: boolean }) {
  const RED = '#c24f5f';
  const INK = '#7d3a44';
  // An open smile: a wide soft D with a row of teeth and a little tongue.
  const openSmile = (w: number, h: number) => {
    const [l, r, top, bot] = [100 - w, 100 + w, 130.2, 130.2 + h];
    return (
      <g>
        <path d={`M${l} ${top} Q100 ${top + 1.8} ${r} ${top} Q${r - 1.2} ${bot} 100 ${bot + 0.4} Q${l + 1.2} ${bot} ${l} ${top} Z`} fill={RED} stroke={INK} strokeWidth={0.9} strokeLinejoin="round" />
        <path d={`M${100 - w * 0.6} ${bot - h * 0.36} Q100 ${bot - h * 0.62} ${100 + w * 0.6} ${bot - h * 0.36} Q${100 + w * 0.3} ${bot + 0.2} 100 ${bot + 0.2} Q${100 - w * 0.3} ${bot + 0.2} ${100 - w * 0.6} ${bot - h * 0.36} Z`} fill="#ef8b92" />
        <path d={`M${l + 0.6} ${top + 0.4} Q100 ${top + 2.2} ${r - 0.6} ${top + 0.4} L${r - 0.9} ${top + 1.8} Q100 ${top + 3.2} ${l + 0.9} ${top + 1.8} Z`} fill="#fff" />
      </g>
    );
  };
  if (e === 'happy') return openSmile(talk ? 6.4 : 6.8, talk ? 7.2 : 8.4);
  if (e === 'smile') return openSmile(5.2, talk ? 6.2 : 5.4);
  if (e === 'surprised') return <ellipse cx={100} cy={132.4} rx={2.4} ry={talk ? 2.4 : 3.1} fill={RED} stroke={INK} strokeWidth={0.8} />;
  if (talk) return <path d="M96.2 130.6 Q100 131.6 103.8 130.6 Q102.8 135.6 100 135.8 Q97.2 135.6 96.2 130.6 Z" fill={RED} stroke={INK} strokeWidth={0.8} strokeLinejoin="round" />;
  if (e === 'blush') return <path d="M96.4 132 Q98.2 130.6 100 132 Q101.8 133.4 103.6 132" {...line(INK, 1.1)} />;
  if (e === 'troubled') return <path d="M96.6 133 Q100 130.8 103.4 133" {...line(INK, 1.1)} />;
  // a soft, sweet closed smile with little upturned corners
  return <path d="M94.8 130.4 Q95.4 131 95.8 130.8 Q100 134.6 104.2 130.8 Q104.6 131 105.2 130.4" {...line(INK, 1.2)} />;
}

/* ---------- hair ---------- */

// Long hair falling behind her back: close to the head, then flowing in soft waves.
const BACK_HAIR = [
  'M100 48 C68 48 53 70 52 100 C50 120 46 138 46 156 C46 176 40 190 40 210 C40 232 44 246 36 266 C30 282 20 294 24 312 C26 324 20 334 22 348 Q32 342 38 332 ' +
    'L162 332 Q168 342 178 348 C180 334 174 324 176 312 C180 294 170 282 164 266 C156 246 160 232 160 210 C160 190 154 176 152 156 C154 138 150 120 148 100 C147 70 132 48 100 48 Z',
  'M25 306 Q9 320 13 342 Q19 332 28 326 Z',
  'M175 306 Q191 320 187 342 Q181 332 172 326 Z',
];
const BACK_STRANDS = 'M56 112 Q52 140 50 166 Q44 190 46 214 Q46 238 38 262 Q28 284 28 310 M62 150 Q58 180 54 204';

const CROWN = 'M63 104 C56 72 72 50 100 49 C128 50 144 72 137 104 Q130 80 100 70 Q70 80 63 104 Z';

// Thin see-through bangs: even strands that fall from a high hairline and flick
// slightly to the right at the tips, with her forehead showing between them.
const hairlineY = (x: number) => 74 + ((x - 100) / 34) ** 2 * 14;
const BANG_LEN = [26, 21, 27, 23, 29, 25, 28, 22, 27, 21, 25];
const BANGS = [
  'M66 90 Q66 59 100 56 Q134 59 134 90 Q124 78 100 74 Q76 78 66 90 Z',
  ...BANG_LEN.map((len, i) => {
    const x1 = 64.6 + i * 6.3;
    const x2 = x1 + 7.2;
    const mid = (x1 + x2) / 2;
    return lock([x1, hairlineY(x1)], [x2, hairlineY(x2)], [mid + 3.4, hairlineY(mid) + len], -1.8);
  }),
];
const BANG_LINES = 'M83 62 Q82 70 82.6 76 M92 59 Q91.4 68 92.4 74 M108 59 Q107.6 68 108.6 74.5 M117 62 Q116.6 70 117.6 76 M100 57 L100 62';


// Thin face-framing strand in front of the ear; its top tucks under the crown.
const SIDE = 'M67.4 88 C66.2 99 67 108 68.8 117 Q69.8 108 71.4 101 C72 96 72.2 92 72 89 Z';
// The long wavy lock over each shoulder, curling at the tip.
const FRONT_L =
  'M57 98 C52 118 50 140 52 160 C54 180 44 190 42 210 C40 230 50 242 44 262 C40 276 26 284 28 302 C29 312 38 318 44 310 Q36 306 39 298 ' +
  'C44 286 56 278 56 262 C56 244 48 232 52 214 C56 198 66 186 64 168 C62 152 57 132 59 100 Z';
const FRONT_R = flip(FRONT_L);
const FRONT_STRANDS = 'M55 116 Q52 140 54 162 Q48 182 46 210 Q46 232 51 248 Q48 268 36 286 M64 176 Q54 194 50 214 Q50 230 54 242';

// A highlight band with a zigzag lower edge, rotated `a` degrees about its start.
const zig = (x: number, y: number, w: number, h: number) => {
  const teeth = [[0.88, 1], [0.76, 0.35], [0.62, 1.25], [0.5, 0.4], [0.36, 1.05], [0.24, 0.3], [0.12, 0.85]];
  return `M${x} ${y} Q${x + w / 2} ${y - 1.6} ${x + w} ${y} ` + teeth.map(([fx, fy]) => `L${x + w * fx} ${y + h * fy}`).join(' ') + ' Z';
};
const HIGHLIGHTS: [number, number, number, number, number][] = [
  // [x, y, width, depth, angle]
  [72, 76, 9, 6, -40], [82, 68, 10, 7, -18], [94, 65, 8, 6, -4],
];
// Thin lens-shaped streaks running down the long hair.
const streak = (x: number, y: number, h: number) => `M${x} ${y} Q${x + 1.4} ${y + h * 0.5} ${x + 0.3} ${y + h} Q${x - 0.9} ${y + h * 0.5} ${x} ${y} Z`;
const STREAKS = [[64, 114, 12], [57, 158, 14], [62, 166, 8], [48, 212, 14], [44, 262, 12], [50, 120, 10]]
  .map(([x, y, h]) => streak(x, y, h))
  .join(' ');

function Shine() {
  // Jagged lavender sheen, the zigzag highlights her hair has in the anime.
  return (
    <Mirror>
      {HIGHLIGHTS.map(([x, y, w, h, a]) => (
        <path key={`${x}-${y}`} d={zig(x, y, w, h)} transform={`rotate(${a} ${x} ${y})`} fill="#9e86cf" opacity={0.75} />
      ))}
      <path d={STREAKS} fill="#9e86cf" opacity={0.6} />
    </Mirror>
  );
}

/* ---------- outfits ---------- */

const SWEATER = '#f2b7ae';
const SWEATER_INK = '#c4817a';
const SKIRT = '#2f2c3b';

/** A ribbed sleeve cuff centred at (x, y), turned to sit across the arm. */
function Cuff({ x, y, angle, fill, ink }: { x: number; y: number; angle: number; fill: string; ink: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <rect x={-9.4} y={-4} width={18.8} height={8} rx={3} fill={fill} stroke={ink} strokeWidth={1.2} />
      <path d="M-5.6 -3 V3 M-1.9 -3.4 V3.4 M1.9 -3.4 V3.4 M5.6 -3 V3" {...line(ink, 0.7)} opacity={0.6} />
    </g>
  );
}

const hand = { fill: SKIN, stroke: SKIN_INK, strokeWidth: 1.2, strokeLinejoin: 'round' as const };

/** Hands clasped in front of her chest: one hand's fingers wrap over the other, thumb on top. */
function ClaspedHands({ sleeve, ink }: { sleeve: string; ink: string }) {
  const finger = (y: number, end: number) => <Limb d={`M90 ${y} L${end} ${y}`} fill={SKIN} outline={SKIN_INK} w={4.4} />;
  return (
    <g>
      <Limb d="M54 204 Q42 262 62 280 Q76 279 86 270" fill={sleeve} outline={ink} w={16} />
      <Limb d="M146 204 Q158 262 138 280 Q124 279 114 270" fill={sleeve} outline={ink} w={16} />
      <Cuff x={87.4} y={267} angle={44} fill={sleeve} ink={ink} />
      <Cuff x={112.6} y={267} angle={-44} fill={sleeve} ink={ink} />
      {/* the hand underneath */}
      <path d="M95 252 C95 247 99.6 245 104.4 245.8 C109.4 246.6 112 250.6 111.6 256 C111.2 261.6 107.6 265.2 102.4 265 C97.6 264.8 95 260.6 95 252 Z" {...hand} />
      {/* the other hand's palm and fingers wrapped over it */}
      <path d="M86.4 253 C86.4 249 89 247.4 92 248 L93.4 265.4 C90 266.6 86.6 263.6 86.4 259 Z" {...hand} />
      {finger(250.6, 105.6)}
      {finger(254.8, 107.4)}
      {finger(259, 106.8)}
      {finger(263, 104.4)}
      <Limb d="M103 247.4 Q98.6 243 94.4 245" fill={SKIN} outline={SKIN_INK} w={4.4} />
      <ellipse cx={98} cy={250.2} rx={3} ry={0.9} fill="#fff" opacity={0.4} />
    </g>
  );
}

/** Day off: ribbed pink turtleneck, long dark skirt and a white shoulder bag. */
function CasualOutfit({ clasp }: { clasp: boolean }) {
  const ribs = Array.from({ length: 15 }, (_, i) => 58 + i * 6);
  return (
    <g>
      <path d="M93 134 L93 156 L107 156 L107 134 Z" fill={SKIN_SHADE} />
      {/* sweater */}
      <Inked d={['M46 392 L48 300 Q50 270 46 240 Q42 214 48 200 Q54 188 66 184 Q78 179 88 173 L112 173 Q122 179 134 184 Q146 188 152 200 Q158 214 154 240 Q150 270 152 300 L154 392 Z']} fill="url(#kao-sweater)" ink={SWEATER_INK} w={1.8} />
      <path d={ribs.map(x => `M${x} ${x < 100 ? 196 + (100 - x) * 0.2 : 196 + (x - 100) * 0.2} Q${x + (x - 100) * 0.04} 250 ${x + (x - 100) * 0.06} 304`).join(' ')} {...line(SWEATER_INK, 0.6)} opacity={0.45} />
      {/* a soft hint of her figure: shading and a light line under the chest */}
      <path d="M64 226 Q78 242 95 233 Q80 237 64 226 Z M136 226 Q122 242 105 233 Q120 237 136 226 Z" fill={SWEATER_INK} opacity={0.22} />
      <path d="M66 224 Q79 238 94 232 M134 224 Q121 238 106 232" {...line(SWEATER_INK, 0.9)} opacity={0.6} />
      {/* skirt */}
      <path d="M44 300 Q100 308 156 300 L164 392 L36 392 Z" fill={SKIRT} stroke="#1a1822" strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M70 308 L64 392 M100 310 L100 392 M128 308 L136 392" {...line('#47435a', 1.2)} />
      {/* turtleneck */}
      <path d="M84 177 Q83 161 87 150 Q100 155 113 150 Q117 161 116 177 Q100 183 84 177 Z" fill={SWEATER} stroke={SWEATER_INK} strokeWidth={1.3} strokeLinejoin="round" />
      <path d="M88 153 L87.4 177 M91.6 154 L91.4 179 M95.6 154.8 L95.6 180 M100 155 L100 180.6 M104.4 154.8 L104.4 180 M108.4 154 L108.6 179 M112 153 L112.6 177" {...line(SWEATER_INK, 0.6)} opacity={0.6} />
      <path d="M84.6 164 Q100 169 115.4 164" {...line(SWEATER_INK, 0.8)} />
      {/* bag strap over her left shoulder, the bag at her hip */}
      <path d="M134 182 Q136 236 147 300" {...line('#a9a6a2', 5.4)} />
      <path d="M134 182 Q136 236 147 300" {...line('#f4f3f0', 3.6)} />
      <Inked d={['M128 302 Q126 290 137 289 L170 291 Q181 293 179 305 L175 342 Q173 352 161 352 L137 350 Q127 348 128 336 Z']} fill="#f4f3f0" ink="#a9a6a2" w={1.6} />
      <path d="M129 308 Q153 316 178 310" {...line('#c9c6c1', 1.2)} />
      <path d="M160 313 l5 -1 l-2.4 4.4 Z" fill="#e2b44c" />
      {clasp ? (
        <ClaspedHands sleeve={SWEATER} ink={SWEATER_INK} />
      ) : (
        <g>
          {/* one arm hangs relaxed: soft fingers and a thumb peeking from the cuff */}
          <Limb d="M54 204 Q44 256 47 294" fill={SWEATER} outline={SWEATER_INK} w={16} />
          <path d="M52 230 Q49 236 50 242" {...line(SWEATER_INK, 0.8)} opacity={0.6} />
          <path d="M40.8 302 C39.2 309 40.2 315.4 43.2 319.8 C45.4 323 49.4 323.6 52.2 321.6 C54.8 319.8 55.8 315.6 55.6 311 L55.2 302 Z" {...hand} />
          <path d="M45 309.6 Q46.2 315.6 48.2 320.6 M49.2 309.2 Q50.8 314.8 52.8 319.4" {...line(SKIN_INK, 0.8)} opacity={0.7} />
          <path d="M54.8 304.4 Q59.6 307.6 58 313 Q56.8 315.6 54.6 314.2" {...hand} />
          <Cuff x={47.6} y={299} angle={-3} fill={SWEATER} ink={SWEATER_INK} />
          {/* the other hand grips the bag strap */}
          <Limb d="M146 204 Q158 244 150 266 Q145 258 141 249" fill={SWEATER} outline={SWEATER_INK} w={16} />
          <path d="M150.6 252 Q153 258 151 262" {...line(SWEATER_INK, 0.8)} opacity={0.6} />
          <Cuff x={140.4} y={247} angle={-29} fill={SWEATER} ink={SWEATER_INK} />
          <path d="M129.4 229.6 Q126.8 223.4 131.2 222 Q135.6 221.2 136.8 225.8" {...hand} />
          <path d="M126.4 231 C126.4 226.6 130 224.6 134 225 C138.6 225.4 141.4 228 141.4 232 L141 239.6 C140.6 243 137.6 244.6 133.6 244.4 C129.4 244.2 126.6 242 126.4 238.6 Z" {...hand} />
          <path d="M127 230.8 Q133.6 229.4 140.8 231.2 M126.8 234.8 Q133.6 233.6 141 235.4 M127 238.8 Q133.6 237.8 140.8 239.4" {...line(SKIN_INK, 0.8)} opacity={0.75} />
          <path d="M127.4 229 q-1.4 2 0 3.6 M127.2 233 q-1.4 2 0 3.6 M127.4 237 q-1.4 2 0 3.4" {...line(SKIN_INK, 0.8)} />
          <ellipse cx={134.6} cy={228.6} rx={2.4} ry={1.1} fill="#fff" opacity={0.4} />
        </g>
      )}
    </g>
  );
}

/** Kikyo uniform: rose dress, white sailor collar, thin black ribbon. */
function KikyoUniform({ clasp }: { clasp: boolean }) {
  const DRESS = '#d58599';
  const DRESS_INK = '#97556a';
  return (
    <g transform="translate(0 -23)">
      <path d="M92.6 148 L92 200 L108 200 L107.4 148 Z" fill={SKIN_SHADE} stroke={SKIN_INK} strokeWidth={1.2} />
      <Inked d={['M44 414 Q42 226 60 202 Q76 186 92 180 L108 180 Q124 186 140 202 Q158 226 156 414 Z']} fill="url(#kao-dress)" ink={DRESS_INK} />
      <path d="M59 216 Q52 290 54 414 M141 216 Q148 290 146 414" {...line(DRESS_INK, 1.4)} opacity={0.7} />
      <path d="M52 344 Q100 352 148 344" {...line(DRESS_INK, 1.4)} opacity={0.7} />
      {[
        [80, 292],
        [120, 292],
        [81, 324],
        [119, 324],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r={2.6} fill="#3b2b35" />
          <circle cx={x - 0.8} cy={y - 0.8} r={0.8} fill="#8a7080" />
        </g>
      ))}
      <path d="M90 182 L100 248 L110 182 Z" fill="#fbf8f8" stroke="#bfb2b8" strokeWidth={0.9} />
      <path d="M92.4 180 L100 202 L107.6 180 Z" fill={SKIN_SHADE} />
      <Mirror>
        <Inked d={['M91 181 L100 254 Q78 240 56 226 Q58 208 64 198 Q76 186 91 181 Z']} fill="#fff" ink="#a99ca6" w={1.6} />
        <path d="M58.6 220 Q78 233.4 97.8 246" {...line('#3b3346', 1.8)} />
      </Mirror>
      <path d="M100 252 Q90 244 87.4 249 Q88.6 256 100 252 Z M100 252 Q110 244 112.6 249 Q111.4 256 100 252 Z" fill="#221a26" />
      <path d="M100 252 Q96.4 266 92 284 M100 252 Q103.6 266 108.6 282" {...line('#221a26', 1.8)} />
      <circle cx={100} cy={252} r={2} fill="#221a26" />
      {clasp && (
        <g transform="translate(0 23)">
          <ClaspedHands sleeve={DRESS} ink={DRESS_INK} />
        </g>
      )}
    </g>
  );
}

/* ---------- sprite ---------- */

export function Kaoruko({ e, blink, talk, outfit = 'casual' }: SpriteProps & { outfit?: KaoOutfit }) {
  // Excited → hands clasped together.
  const clasp = e === 'happy' || e === 'surprised';
  const blush = e === 'blush' || e === 'happy' ? 1 : e === 'smile' ? 0.8 : 0.55;
  return (
    <svg viewBox={VIEWBOX} xmlns="http://www.w3.org/2000/svg" overflow="visible">
      <defs>
        <linearGradient id="kao-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#524a66" />
          <stop offset="0.45" stopColor="#3e3750" />
          <stop offset="1" stopColor="#4a3f62" />
        </linearGradient>
        <linearGradient id="kao-iris" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#27306e" />
          <stop offset="0.55" stopColor="#5068c4" />
          <stop offset="1" stopColor="#a6baf6" />
        </linearGradient>
        <linearGradient id="kao-sweater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6c4bb" />
          <stop offset="1" stopColor="#eaa89f" />
        </linearGradient>
        <linearGradient id="kao-dress" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#df93a6" />
          <stop offset="1" stopColor="#c87990" />
        </linearGradient>
        <clipPath id="kao-eye-clip">
          <path d={EYE_D} />
        </clipPath>
      </defs>

      <g className="breathe">
        <g className="headbob">
          <Inked d={BACK_HAIR} fill={HAIR} ink={HAIR_INK} />
          <path d={`${BACK_STRANDS} ${flip(BACK_STRANDS)}`} {...line('#2c2440', 0.8)} opacity={0.5} />
        </g>

        {outfit === 'casual' ? <CasualOutfit clasp={clasp} /> : <KikyoUniform clasp={clasp} />}

        <g className="headbob">
          {/* shadow of the chin on the neck, behind the face so the chin line stays whole */}
          <path d="M91 142 Q100 153 109 142 L109 149 Q100 160 91 149 Z" fill={SKIN_SHADE} />
          <Mirror>
            <path d={EAR_D} fill={SKIN} stroke={SKIN_INK} strokeWidth={1.2} strokeLinejoin="round" />
            <path d="M66 108.6 Q62.6 112.6 64.6 119.6" {...line(SKIN_INK, 0.8)} />
          </Mirror>
          <Inked d={[FACE_D]} fill={SKIN} ink={SKIN_INK} w={1.6} />
          <Blush id="kao" x={80.5} y={124} amount={blush} hatch="#ec7d96" />
          {blush >= 0.8 && <path d="M98.6 114.4 L98.6 116.8 M100 114 L100 116.8 M101.4 114.4 L101.4 116.8" {...line('#e0a898', 0.5)} />}
          {/* the anime's tiny dot of a nose */}
          <ellipse cx={99.8} cy={122.4} rx={0.8} ry={0.62} fill="#c98f80" />
          <Mouth e={e} talk={talk} />

          <g className="sway">
            <Inked d={[FRONT_L]} fill={HAIR} ink={HAIR_INK} w={1.6} />
            <path d={FRONT_STRANDS} {...line('#2c2440', 0.8)} opacity={0.5} />
          </g>
          <g className="sway sway-alt">
            <Inked d={[FRONT_R]} fill={HAIR} ink={HAIR_INK} w={1.6} />
            <path d={flip(FRONT_STRANDS)} {...line('#2c2440', 0.8)} opacity={0.5} />
          </g>
          <Inked d={[SIDE, flip(SIDE)]} fill={HAIR} ink={HAIR_INK} w={1.6} />

          <Inked d={[CROWN, ...BANGS]} fill={HAIR} ink={HAIR_INK} w={1.8} />
          <path d={BANG_LINES} {...line(HAIR_INK, 0.8)} opacity={0.55} />
          {/* thin headband, set back on the crown */}
          <path d="M68 80 Q71 55 100 53 Q129 55 132 80" {...line('#16121c', 2.6)} />
          <path d="M73 67 Q81 57 100 55.6 Q119 57 127 67" {...line('#6a5d84', 0.7)} />
          <Shine />

          <Mirror>
            <g transform="translate(84 112.5) scale(0.9) translate(-84 -112.5)">
              <Eye e={e} blink={blink} />
            </g>
            <Brow e={e} />
          </Mirror>
          <Fx e={e} accent="#ec7fa0" />
        </g>
      </g>
    </svg>
  );
}
