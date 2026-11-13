import { motion, useTransform } from 'framer-motion';
import type { SceneProps } from '../types';
import { SceneSvg } from '../components/art/SceneSvg';
import { Sky, Stars, type SkyKey } from '../components/art/Sky';
import { Clouds } from '../components/art/Clouds';
import { Birds } from '../components/art/Birds';
import { Particles } from '../components/art/Particles';
import { ParallaxLayer } from '../components/art/ParallaxLayer';
import { Reveal } from '../components/art/Reveal';
import { CrowdRow, Person } from '../components/art/Person';
import { Treeline, Palms } from '../components/art/Village';
import { BigSoop, Daura, Kalash, Matka, Sugarcane, Thekua, Coconut, Banana, Fruit, Marigold } from '../components/art/Props';
import { AnimatedSun } from '../components/AnimatedSun';
import { AnimatedRiver, WaterVeil } from '../components/AnimatedRiver';
import { Diya, Diyas, FloatingDiyas, type DiyaSpec } from '../components/Diyas';
import { cv } from '../lib/utils';

const HORIZON = 430;
const SUN_X = 800;
const RIM = '#ffb25a';
const TONE = '#2a0f2a';

const SKY: readonly SkyKey[] = [
  { at: 0, top: '#3c5ca2', mid: '#f5a05a', bottom: '#ffd27a' },
  { at: 0.5, top: '#3a2a6a', mid: '#e0603c', bottom: '#ff9a3c' },
  { at: 0.72, top: '#1a1745', mid: '#a8405a', bottom: '#f0703a' },
  { at: 1, top: '#080b26', mid: '#14163e', bottom: '#2a2050' },
];

const NOTES = ['♪', '♫', '♩', '♬'];

/** Elephant of clay (mitti ka haathi) — the centrepiece of the Kosi ritual. */
function ClayElephant({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cy={4} rx={130} ry={12} fill="#000" opacity={0.3} />
      {[-72, -34, 22, 60].map((lx) => (
        <rect key={lx} x={lx} y={-54} width={22} height={54} rx={9} fill="url(#g-clay)" />
      ))}
      <path d="M-90,-70 Q-90,-132 -20,-134 Q70,-136 94,-86 Q102,-52 82,-48 L-70,-48 Q-92,-50 -90,-70Z" fill="url(#g-clay)" />
      <path d="M-84,-74 Q0,-60 88,-74" stroke="#f3e6c9" strokeWidth={2.4} fill="none" strokeDasharray="3 6" opacity={0.85} />
      <ellipse cx={-100} cy={-92} rx={38} ry={42} fill="url(#g-clay)" />
      <path d="M-128,-84 Q-150,-60 -138,-26 Q-134,-8 -118,-14" stroke="#b0653a" strokeWidth={17} fill="none" strokeLinecap="round" />
      <path d="M-128,-84 Q-150,-60 -138,-26 Q-134,-8 -118,-14" stroke="#f3e6c9" strokeWidth={2} fill="none" strokeDasharray="2 7" />
      <ellipse cx={-80} cy={-96} rx={21} ry={30} fill="#8f4a28" />
      <circle cx={-114} cy={-102} r={3.4} fill="#1e0c05" />
      <path d="M-122,-72 Q-150,-62 -146,-44" stroke="#fff3d8" strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d="M-34,-132 L70,-132 L86,-68 L-48,-68 Z" fill="#c4262a" />
      <path d="M-34,-132 L70,-132 L86,-68 L-48,-68 Z" fill="none" stroke="#f2c14e" strokeWidth={4} />
      <g fill="#f2c14e">
        {[-20, 6, 32, 58].map((dx) => (
          <circle key={dx} cx={dx} cy={-98} r={4} />
        ))}
      </g>
      <Kalash x={18} y={-132} s={0.85} />
      <Diya x={-50} y={-136} s={0.55} delay={0.2} glow={false} />
      <Diya x={78} y={-134} s={0.55} delay={0.6} glow={false} />
    </g>
  );
}

/** The Kosi at night: a canopy of sugarcane, a clay elephant and a ring of lit lamps. */
function Kosi() {
  const BASE = 700;
  const H = 410;
  const canes = [
    { x: 700, h: H - 20 },
    { x: 900, h: H - 20 },
    { x: 560, h: H },
    { x: 1040, h: H },
    { x: 620, h: H + 14 },
    { x: 980, h: H + 14 },
  ].map((c) => ({ ...c, tilt: (Math.asin((800 - c.x) / (c.h + 20)) * 180) / Math.PI }));

  const ring: DiyaSpec[] = [];
  for (let i = 0; i < 14; i += 1) {
    const a = (i / 14) * Math.PI * 2;
    ring.push({ x: 800 + Math.cos(a) * 290, y: BASE + 40 + Math.sin(a) * 44, s: 0.7 + Math.sin(a) * 0.12 + 0.12, delay: i * 0.31 });
  }

  return (
    <g transform="translate(0 -110)">
      {/* ground with a rangoli-style border */}
      <ellipse cx={800} cy={BASE + 40} rx={460} ry={96} fill="#2a1a1a" />
      <ellipse cx={800} cy={BASE + 40} rx={400} ry={78} fill="none" stroke="#f3e6c9" strokeWidth={3} strokeDasharray="4 10" opacity={0.7} />
      <ellipse cx={800} cy={BASE + 40} rx={340} ry={62} fill="none" stroke="#ff9f43" strokeWidth={2} opacity={0.5} />
      <ellipse cx={800} cy={BASE + 20} rx={380} ry={110} fill="url(#g-diya-glow)" className="anim-glow" style={cv({ '--dur': '2.2s' })} />

      {/* back canes */}
      {canes.slice(0, 2).map((c, i) => (
        <Sugarcane key={`b${i}`} x={c.x} y={BASE} h={c.h} tilt={c.tilt} />
      ))}
      <ClayElephant x={800} y={BASE + 34} s={1.45} />
      {/* front canes */}
      {canes.slice(2).map((c, i) => (
        <Sugarcane key={`f${i}`} x={c.x} y={BASE + 6} h={c.h} tilt={c.tilt} />
      ))}

      {/* cloth and marigold where the canes meet */}
      <g transform={`translate(800 ${BASE - H + 10})`}>
        <ellipse rx={50} ry={16} fill="#c4262a" />
        <path d="M-50,0 Q0,22 50,0" stroke="#f2c14e" strokeWidth={4} fill="none" />
        {[-36, -18, 0, 18, 36].map((mx) => (
          <Marigold key={mx} x={mx} y={12 + Math.abs(mx) * 0.1} s={0.7} />
        ))}
      </g>
      <path d={`M580,${BASE - 296} Q700,${BASE - 252} 800,${BASE - H + 20} Q900,${BASE - 252} 1020,${BASE - 296}`} stroke="#ff9f1c" strokeWidth={6} fill="none" strokeDasharray="2 9" strokeLinecap="round" />

      {/* offerings arranged underneath */}
      <BigSoop x={480} y={BASE + 70} s={1.15} />
      <BigSoop x={1120} y={BASE + 70} s={1.15} />
      <Daura x={420} y={BASE + 28} s={0.9} />
      <Daura x={1180} y={BASE + 28} s={0.9} />
      <Matka x={640} y={BASE + 82} s={0.95} />
      <Matka x={960} y={BASE + 82} s={0.95} />
      <Thekua x={690} y={BASE + 100} s={1.1} />
      <Thekua x={712} y={BASE + 106} s={1} />
      <Coconut x={900} y={BASE + 104} s={1.1} />
      <Banana x={930} y={BASE + 108} s={1.1} />
      <Fruit x={880} y={BASE + 112} s={1.1} color="#ff9f1c" />
      <Diyas items={ring} />
    </g>
  );
}

/** Chapter 3 — Sandhya Arghya: a vast ghat at sunset, then the Kosi by lamplight. */
export function SandhyaArghya({ progress }: SceneProps) {
  const sunY = useTransform(progress, [0, 0.66], [240, 462]);
  const sunScale = useTransform(progress, [0, 0.66], [1, 1.5]);
  const sunRed = useTransform(progress, [0, 0.5, 0.66], [0, 0.45, 0.9]);
  const sunGlow = useTransform(progress, [0, 0.6, 0.72], [1, 1, 0]);
  const cloudTint = useTransform(progress, [0, 0.45, 0.7], ['#ffd9a8', '#f08a5a', '#5a3a6a']);
  const waterTop = useTransform(progress, [0, 0.5, 0.72, 1], ['#f2b878', '#f08a4a', '#a04a5a', '#14163e']);
  const waterBottom = useTransform(progress, [0, 0.5, 0.72, 1], ['#3f6a8c', '#5a3a6a', '#2a2050', '#0a0c28']);
  const reflectOp = useTransform(progress, [0, 0.15, 0.62, 0.72], [0.4, 1, 1, 0]);
  const birdOp = useTransform(progress, [0.45, 0.66], [1, 0]);
  const diyaOp = useTransform(progress, [0.1, 0.4, 0.7, 0.76], [0.25, 1, 1, 0]);
  const actA = useTransform(progress, [0.68, 0.8], [1, 0]);
  const actB = useTransform(progress, [0.68, 0.82], [0, 1]);
  const dusk = useTransform(progress, [0.3, 0.7], [0, 0.35]);
  const starOpB = useTransform(progress, [0.7, 0.85], [0, 1]);

  return (
    <SceneSvg focusX={800}>
      {/* ───────────── ACT A · the ghat at sunset ───────────── */}
      <motion.g style={{ opacity: actA }}>
        <Sky progress={progress} keys={SKY} horizon={HORIZON} />
        <ParallaxLayer depth={6}>
          <AnimatedSun x={SUN_X} y={sunY} r={78} scale={sunScale} redness={sunRed} glow={sunGlow} />
          <Clouds tint={cloudTint} count={7} yMin={60} yMax={330} opacity={0.85} seed={17} speed={200} />
        </ParallaxLayer>
        <motion.g style={{ opacity: birdOp }}>
          <Birds flocks={3} birdsPerFlock={8} y={110} color="#3a1f3a" speed={28} seed={6} />
        </motion.g>

        <ParallaxLayer depth={9}>
          <Treeline baseY={HORIZON + 6} color="#6a4a68" seed={25} height={62} />
          <Palms baseY={HORIZON + 6} color="#52385a" seed={27} count={11} />
          <Treeline baseY={HORIZON + 10} color="#3e3350" seed={31} height={34} />
          {/* a far boat with a lamp */}
          <g transform="translate(300 436)">
            <path d="M-46,0 Q0,14 46,0 L38,-8 L-38,-8 Z" fill="#2a1a26" />
            <path d="M-4,-8 L-4,-34 L22,-10 Z" fill="#3a2330" />
            <Diya x={-24} y={-8} s={0.3} glow={false} />
          </g>
        </ParallaxLayer>

        <AnimatedRiver top={HORIZON + 8} topColor={waterTop} bottomColor={waterBottom} reflectX={SUN_X} reflectOpacity={reflectOp} waves={14} waveOpacity={0.4} seed={33} />

        {/* hundreds of devotees standing in the river, row after row */}
        <ParallaxLayer depth={12}>
          <CrowdRow y={484} scale={0.4} count={96} xMin={-40} xMax={1640} sunX={SUN_X} dark={0.78} tone={TONE} rim={RIM} seed={1} />
          <WaterVeil y={452} height={480} color={waterTop} opacity={0.86} amp={2.5} dur={16} />
        </ParallaxLayer>
        <ParallaxLayer depth={15}>
          <CrowdRow y={548} scale={0.6} count={62} xMin={-40} xMax={1640} sunX={SUN_X} dark={0.62} tone={TONE} rim={RIM} seed={2} />
          <WaterVeil y={502} height={440} color={waterTop} opacity={0.86} amp={3} dur={13} />
        </ParallaxLayer>
        <ParallaxLayer depth={18}>
          <CrowdRow y={628} scale={0.85} count={36} xMin={-40} xMax={1640} sunX={SUN_X} dark={0.45} tone={TONE} rim={RIM} seed={3} />
          <Person x={540} y={632} s={0.88} pose="pour" armDur="7s" waterY={-82} color="#f2b705" skin="#5a3520" hair="#0e0705" rim={RIM} />
          <Person x={1070} y={636} s={0.88} flip pose="pour" armDur="7.8s" waterY={-82} color="#d6371f" skin="#5a3520" hair="#0e0705" rim={RIM} />
          <WaterVeil y={562} height={400} color={waterTop} opacity={0.88} amp={4} dur={11} />
        </ParallaxLayer>

        {/* floating diyas and river light */}
        <FloatingDiyas count={20} xMin={80} xMax={1100} yMin={470} yMax={760} travel={480} opacity={diyaOp} seed={4} />

        {/* ghats with offerings and family groups */}
        <ParallaxLayer depth={26}>
          <path d="M-120,560 L110,596 L400,780 L400,960 L-120,960 Z" fill="#6a4a3a" />
          <path d="M-120,560 L110,596 L400,780" stroke="#8a6a52" strokeWidth={6} fill="none" />
          <g stroke="#4a3024" strokeWidth={3} opacity={0.7} fill="none">
            <path d="M-120,640 L170,650 L400,780" />
            <path d="M-120,720 L260,740 L400,800" />
          </g>
          <path d="M1720,560 L1490,596 L1200,780 L1200,960 L1720,960 Z" fill="#6a4a3a" />
          <path d="M1720,560 L1490,596 L1200,780" stroke="#8a6a52" strokeWidth={6} fill="none" />
          <g stroke="#4a3024" strokeWidth={3} opacity={0.7} fill="none">
            <path d="M1720,640 L1430,650 L1200,780" />
            <path d="M1720,720 L1340,740 L1200,800" />
          </g>

          {/* left family: praying together */}
          <Reveal progress={progress} at={0.08} dx={-24}>
            <Person x={118} y={716} s={1.5} pose="soop" color="#f08a24" rim={RIM} skin="#6a3e24" hair="#120805" />
            <Person x={226} y={740} s={1.6} kind="man" pose="namaste" color="#d6371f" rim={RIM} skin="#6a3e24" hair="#120805" />
            <Person x={304} y={770} s={0.95} pose="namaste" color="#e2582b" rim={RIM} skin="#6a3e24" hair="#120805" />
          </Reveal>
          {/* right family: offering Arghya with a stream of water */}
          <Reveal progress={progress} at={0.14} dx={24}>
            <Person x={1360} y={716} s={1.6} flip pose="pour" armDur="6.4s" waterY={46} color="#f2b705" rim={RIM} skin="#6a3e24" hair="#120805" />
            <Person x={1452} y={736} s={1.55} flip kind="man" pose="raise" color="#f08a24" rim={RIM} skin="#6a3e24" hair="#120805" />
            <Person x={1268} y={774} s={0.92} flip pose="namaste" color="#c0267a" rim={RIM} skin="#6a3e24" hair="#120805" />
          </Reveal>

          {/* offerings: soop, daura, sugarcane */}
          <Sugarcane x={30} y={840} h={330} tilt={-6} />
          <Sugarcane x={66} y={846} h={300} tilt={4} />
          <Sugarcane x={1568} y={840} h={330} tilt={6} />
          <Sugarcane x={1532} y={846} h={300} tilt={-4} />
          <BigSoop x={190} y={812} s={1.25} />
          <Daura x={330} y={834} s={1} />
          <BigSoop x={1410} y={812} s={1.25} />
          <Daura x={1270} y={834} s={1} />
        </ParallaxLayer>

        {/* folk-song atmosphere: notes drifting up from the ghats */}
        <g fill="#ffe29a" fontSize={34} fontFamily="serif" opacity={0.9}>
          {[
            [150, 640, 0],
            [280, 660, 2.6],
            [1330, 640, 1.3],
            [1460, 660, 4],
            [70, 690, 5.2],
            [1540, 690, 3.4],
          ].map(([nx, ny, nd], i) => (
            <text key={i} className="anim-note" x={nx} y={ny} style={cv({ '--dur': `${7 + (i % 3)}s`, animationDelay: `${-(nd ?? 0)}s` })}>
              {NOTES[i % NOTES.length]}
            </text>
          ))}
        </g>

        <Particles count={46} x={0} y={300} width={1600} height={420} rise={-210} drift={50} size={[4, 10]} seed={61} />
        <motion.rect x={-100} y={-100} width={1900} height={1100} fill="#2a1030" style={{ opacity: dusk }} pointerEvents="none" />
      </motion.g>

      {/* ───────────── ACT B · the Kosi at night ───────────── */}
      <motion.g style={{ opacity: actB }}>
        <defs>
          <linearGradient id="sa-night" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="900">
            <stop offset="0%" stopColor="#070a22" />
            <stop offset="60%" stopColor="#14122f" />
            <stop offset="100%" stopColor="#241220" />
          </linearGradient>
        </defs>
        <rect x={-200} y={-200} width={2000} height={1200} fill="url(#sa-night)" />
        <Stars opacity={starOpB} count={110} maxY={460} seed={77} />
        <ParallaxLayer depth={10}>
          <Treeline baseY={600} color="#171a38" seed={44} height={90} />
          <Palms baseY={600} color="#12142e" seed={45} count={9} />
        </ParallaxLayer>
        <rect x={-200} y={590} width={2000} height={400} fill="#241418" />
        <ParallaxLayer depth={22}>
          <Reveal progress={progress} at={0.76} span={0.12} dy={20}>
            <Kosi />
          </Reveal>
        </ParallaxLayer>
        <Particles count={50} x={300} y={300} width={1000} height={420} variant="ember" rise={-220} drift={60} seed={88} />
        <Particles count={26} x={200} y={300} width={1200} height={400} rise={-160} drift={50} size={[5, 11]} seed={89} />
        <Reveal progress={progress} at={0.8} span={0.1} dy={-10}>
          <text x={800} y={150} textAnchor="middle" fontSize={40} fill="#ffe29a" fontFamily="'Tiro Devanagari Hindi', 'Noto Serif Devanagari', serif" style={{ filter: 'drop-shadow(0 0 14px rgba(255,170,60,0.7))' }}>
            रात्रि · कोसी भराई
          </text>
          <text x={800} y={184} textAnchor="middle" fontSize={22} fill="#fff" opacity={0.75} fontStyle="italic" fontFamily="'Cormorant Garamond', Georgia, serif">
            Night · the Kosi ritual
          </text>
        </Reveal>
      </motion.g>

      <rect x={0} y={640} width={1600} height={260} fill="url(#g-vignette-bottom)" pointerEvents="none" />
    </SceneSvg>
  );
}
