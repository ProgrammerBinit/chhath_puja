import { useMemo } from 'react';
import { easeInOut, motion, useTransform } from 'framer-motion';
import type { SceneProps } from '../types';
import { SceneSvg } from '../components/art/SceneSvg';
import { Sky, Stars, type SkyKey } from '../components/art/Sky';
import { Clouds } from '../components/art/Clouds';
import { Birds } from '../components/art/Birds';
import { Particles } from '../components/art/Particles';
import { ParallaxLayer } from '../components/art/ParallaxLayer';
import { Reveal } from '../components/art/Reveal';
import { CrowdRow, Person } from '../components/art/Person';
import { Hut, Tree, TulsiChaura, Treeline, Palms } from '../components/art/Village';
import { BigSoop, Daura, Chulha, Handi, Smoke, Sugarcane, Thali, Thekua, Fruit, Banana, Coconut, Marigold } from '../components/art/Props';
import { AnimatedSun } from '../components/AnimatedSun';
import { AnimatedRiver, WaterVeil } from '../components/AnimatedRiver';
import { Diya, FloatingDiyas } from '../components/Diyas';
import { cv, mulberry32 } from '../lib/utils';

const HORIZON = 430;
const SUN_X = 800;
const RIM = '#ffd98a';
const TONE = '#1a1038';
const SKIN = '#9a6038';
const HAIR = '#160a06';

const SKY_A: readonly SkyKey[] = [
  { at: 0, top: '#070b2a', mid: '#141a4a', bottom: '#2a2a66' },
  { at: 0.22, top: '#1a2260', mid: '#6a3a7a', bottom: '#d8625a' },
  { at: 0.5, top: '#4a6ab4', mid: '#f29a5a', bottom: '#ffd27a' },
];
const SKY_B: readonly SkyKey[] = [
  { at: 0.5, top: '#6aa8e0', mid: '#f8cf98', bottom: '#fff0c0' },
  { at: 1, top: '#79bdee', mid: '#fcdca6', bottom: '#fff6d2' },
];

/** A wide shallow pan with thekua frying in oil. */
function Kadhai({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-52,-14 Q-46,10 0,12 Q46,10 52,-14 Z" fill="#2a1a14" />
      <ellipse cy={-14} rx={52} ry={10} fill="#1a0e0a" />
      <ellipse cy={-14} rx={46} ry={7.5} fill="#c98a1e" />
      {[-26, -4, 18].map((tx, i) => (
        <g key={tx} className="anim-puff" style={cv({ '--dur': `${1.8 + i * 0.4}s`, animationDelay: `${-i * 0.5}s` })}>
          <ellipse cx={tx} cy={-15 + (i % 2) * 2} rx={13} ry={5} fill="#b5651d" />
          <ellipse cx={tx} cy={-16 + (i % 2) * 2} rx={10} ry={3.4} fill="#d98a35" />
        </g>
      ))}
      {[-38, -14, 8, 30].map((bx, i) => (
        <circle key={bx} className="anim-bubble" cx={bx} cy={-14} r={2.4} fill="#ffe9a8" style={cv({ '--dur': `${1.2 + i * 0.3}s`, animationDelay: `${-i * 0.35}s` })} />
      ))}
    </g>
  );
}

/** Marigold petals drifting down during the family celebration. */
function Petals({ count = 26 }: { count?: number }) {
  const items = useMemo(() => {
    const r = mulberry32(404);
    return Array.from({ length: count }, () => ({
      x: r() * 1600,
      dur: 8 + r() * 6,
      delay: -r() * 12,
      dx: (r() - 0.5) * 180,
      rot: 200 + r() * 300,
      hue: r() < 0.65 ? '#ff9f1c' : '#ffcf3a',
      s: 0.8 + r() * 0.9,
    }));
  }, [count]);
  return (
    <g>
      {items.map((p, i) => (
        <g key={i} className="anim-petal" style={cv({ '--dur': `${p.dur}s`, '--dx': `${p.dx}px`, '--rot': `${p.rot}deg`, animationDelay: `${p.delay}s` })}>
          <ellipse cx={p.x} cy={60} rx={5 * p.s} ry={8 * p.s} fill={p.hue} />
        </g>
      ))}
    </g>
  );
}

/** Chapter 4 — Usha Arghya: dawn at the ghat, then prasad, parana and family celebration. */
export function UshaArghya({ progress }: SceneProps) {
  const sunY = useTransform(progress, [0, 0.14, 0.5], [560, 470, 290]);
  const sunScale = useTransform(progress, [0, 0.5], [1.35, 1]);
  const sunRed = useTransform(progress, [0, 0.2, 0.5], [0.9, 0.45, 0]);
  const sunGlow = useTransform(progress, [0, 0.2, 0.5], [0.3, 1, 1]);
  const starOp = useTransform(progress, [0, 0.28], [1, 0]);
  const cloudTint = useTransform(progress, [0, 0.25, 0.5], ['#3a3a80', '#e0807a', '#ffe0b0']);
  const waterTop = useTransform(progress, [0, 0.22, 0.5], ['#1a2260', '#d8725e', '#f4c88a']);
  const waterBottom = useTransform(progress, [0, 0.22, 0.5], ['#080b26', '#3a2a5a', '#2f7f94']);
  const reflectOp = useTransform(progress, [0.08, 0.2, 0.46], [0, 1, 0.9]);
  const raysOp = useTransform(progress, [0.12, 0.3, 0.46], [0, 0.9, 0.7]);
  const diyaOp = useTransform(progress, [0, 0.3, 0.5], [1, 0.7, 0]);
  const dim = useTransform(progress, [0, 0.22], [0.5, 0]);
  const warm = useTransform(progress, [0.2, 0.5], [0, 0.22]);
  const panAy = useTransform(progress, [0.46, 0.6], [0, -900], { ease: easeInOut });
  const panBy = useTransform(progress, [0.46, 0.6], [900, 0], { ease: easeInOut });
  const birdOp = useTransform(progress, [0.1, 0.2, 0.44, 0.5], [0, 1, 1, 0]);
  const sunYB = useTransform(progress, [0.5, 1], [200, 160]);
  const sunGlowB = useTransform(progress, [0.5, 1], [0.8, 1]);
  const petalOp = useTransform(progress, [0.78, 0.86], [0, 1]);

  return (
    <SceneSvg focusX={800}>
      {/* ───────────── ACT A · dawn at the ghat ───────────── */}
      <motion.g style={{ y: panAy }}>
        <Sky progress={progress} keys={SKY_A} horizon={HORIZON} />
        <Stars opacity={starOp} count={120} maxY={400} seed={63} />
        <ParallaxLayer depth={6}>
          <AnimatedSun x={SUN_X} y={sunY} r={74} scale={sunScale} redness={sunRed} glow={sunGlow} />
          <Clouds tint={cloudTint} count={6} yMin={70} yMax={320} opacity={0.8} seed={23} speed={210} />
        </ParallaxLayer>
        <motion.g style={{ opacity: birdOp }}>
          <Birds flocks={3} birdsPerFlock={7} y={140} color="#3a2236" speed={24} seed={19} />
        </motion.g>

        <ParallaxLayer depth={9}>
          <Treeline baseY={HORIZON + 6} color="#4a4a78" seed={51} height={60} />
          <Palms baseY={HORIZON + 6} color="#3a3a66" seed={53} count={11} />
          <Treeline baseY={HORIZON + 10} color="#34385a" seed={55} height={32} />
        </ParallaxLayer>

        <AnimatedRiver top={HORIZON + 8} topColor={waterTop} bottomColor={waterBottom} reflectX={SUN_X} reflectOpacity={reflectOp} waves={14} waveOpacity={0.4} seed={57} />

        {/* golden rays fanning over the water */}
        <motion.g style={{ opacity: raysOp }} className="anim-pulse-ray">
          <polygon points={`${SUN_X},300 ${SUN_X - 520},900 ${SUN_X - 260},900`} fill="#ffe9a8" opacity={0.14} />
          <polygon points={`${SUN_X},300 ${SUN_X - 180},900 ${SUN_X + 40},900`} fill="#ffe9a8" opacity={0.12} />
          <polygon points={`${SUN_X},300 ${SUN_X + 200},900 ${SUN_X + 480},900`} fill="#ffe9a8" opacity={0.12} />
        </motion.g>

        <ParallaxLayer depth={12}>
          <CrowdRow y={484} scale={0.4} count={92} xMin={-40} xMax={1640} sunX={SUN_X} dark={0.6} tone={TONE} rim={RIM} seed={7} />
          <WaterVeil y={452} height={480} color={waterTop} opacity={0.86} amp={2.5} dur={16} />
        </ParallaxLayer>
        <ParallaxLayer depth={15}>
          <CrowdRow y={548} scale={0.6} count={60} xMin={-40} xMax={1640} sunX={SUN_X} dark={0.45} tone={TONE} rim={RIM} seed={8} />
          <WaterVeil y={502} height={440} color={waterTop} opacity={0.86} amp={3} dur={13} />
        </ParallaxLayer>
        <ParallaxLayer depth={18}>
          <CrowdRow y={628} scale={0.85} count={34} xMin={-40} xMax={1640} sunX={SUN_X} dark={0.3} tone={TONE} rim={RIM} seed={9} />
          <Person x={520} y={632} s={0.9} pose="pour" armDur="7s" waterY={-82} color="#f2b705" skin={SKIN} hair={HAIR} rim={RIM} />
          <Person x={1090} y={636} s={0.9} flip pose="pour" armDur="7.8s" waterY={-82} color="#d6371f" skin={SKIN} hair={HAIR} rim={RIM} />
          <WaterVeil y={562} height={400} color={waterTop} opacity={0.88} amp={4} dur={11} />
        </ParallaxLayer>

        <FloatingDiyas count={14} xMin={100} xMax={1100} yMin={480} yMax={720} travel={460} opacity={diyaOp} seed={21} />

        {/* ghats: women offering Arghya to the rising sun, then final prayers */}
        <ParallaxLayer depth={26}>
          <path d="M-120,560 L110,596 L400,780 L400,960 L-120,960 Z" fill="#6a4a3a" />
          <path d="M-120,560 L110,596 L400,780" stroke="#8a6a52" strokeWidth={6} fill="none" />
          <path d="M1720,560 L1490,596 L1200,780 L1200,960 L1720,960 Z" fill="#6a4a3a" />
          <path d="M1720,560 L1490,596 L1200,780" stroke="#8a6a52" strokeWidth={6} fill="none" />
          <Reveal progress={progress} at={0.1} dx={-24}>
            <Person x={150} y={716} s={1.6} pose="pour" armDur="6.6s" waterY={52} color="#f08a24" rim={RIM} skin={SKIN} hair={HAIR} />
            <Person x={250} y={740} s={1.55} kind="man" pose="namaste" color="#d6371f" rim={RIM} skin={SKIN} hair={HAIR} />
            <Person x={320} y={770} s={0.95} pose="namaste" color="#e2582b" rim={RIM} skin={SKIN} hair={HAIR} />
          </Reveal>
          <Reveal progress={progress} at={0.16} dx={24}>
            <Person x={1380} y={716} s={1.6} flip pose="raise" color="#f2b705" rim={RIM} skin={SKIN} hair={HAIR} />
            <Person x={1470} y={740} s={1.55} flip pose="namaste" color="#c0267a" rim={RIM} skin={SKIN} hair={HAIR} />
            <Person x={1290} y={774} s={0.92} flip kind="man" pose="namaste" color="#f08a24" rim={RIM} skin={SKIN} hair={HAIR} />
          </Reveal>
          <Sugarcane x={30} y={840} h={330} tilt={-6} />
          <Sugarcane x={1568} y={840} h={330} tilt={6} />
          <BigSoop x={1410} y={820} s={1.2} />
        </ParallaxLayer>

        <Particles count={40} x={0} y={300} width={1600} height={420} rise={-200} drift={50} size={[4, 10]} seed={71} />
        <motion.rect x={-100} y={-100} width={1900} height={1100} fill="#0a1030" style={{ opacity: dim }} pointerEvents="none" />
        <motion.rect x={-100} y={-100} width={1900} height={1100} fill="#ffb347" style={{ opacity: warm }} pointerEvents="none" />
      </motion.g>

      {/* ───────────── ACT B · prasad, parana and celebration at home ───────────── */}
      <motion.g style={{ y: panBy }}>
        <defs>
          <clipPath id="ush-b-clip">
            <rect x={-300} y={0} width={2200} height={900} />
          </clipPath>
        </defs>
        <g clipPath="url(#ush-b-clip)">
        <Sky progress={progress} keys={SKY_B} horizon={HORIZON} />
        <ParallaxLayer depth={6}>
          <AnimatedSun x={1180} y={sunYB} r={58} glow={sunGlowB} />
          <Clouds tint="#fff3da" count={5} yMin={60} yMax={300} opacity={0.85} seed={29} speed={180} />
        </ParallaxLayer>
        <Birds flocks={2} birdsPerFlock={6} y={150} color="#3a2236" speed={26} seed={33} />
        <ParallaxLayer depth={10}>
          <Treeline baseY={HORIZON + 6} color="#8aa07a" seed={61} height={60} />
          <Palms baseY={HORIZON + 6} color="#6f8a62" seed={63} count={10} />
          <Treeline baseY={HORIZON + 10} color="#5f8a50" seed={65} height={34} />
        </ParallaxLayer>
        <rect x={-200} y={HORIZON} width={2000} height={520} fill="#7f9a46" />
        <ParallaxLayer depth={14}>
          <Tree x={80} y={560} s={1.15} seed={8} />
          <Hut x={1420} y={575} s={1.25} wall="#c18a58" />
          <TulsiChaura x={1250} y={590} s={1.1} />
          <Tree x={1590} y={560} s={0.9} seed={5} color="#2a5230" light="#44763a" />
        </ParallaxLayer>
        <ellipse cx={800} cy={640} rx={900} ry={190} fill="#b58a5c" />
        <ellipse cx={800} cy={610} rx={820} ry={130} fill="#c49a68" opacity={0.7} />
        <ellipse cx={800} cy={620} rx={560} ry={90} fill="none" stroke="#f3e6c9" strokeWidth={3} strokeDasharray="4 12" opacity={0.7} />

        <ParallaxLayer depth={24}>
          <g transform="translate(0 -40)">
            {/* prasad preparation: thekua in the kadhai */}
            <Chulha x={290} y={640} s={1.15} />
            <Kadhai x={290} y={574} s={1.05} />
            <Smoke x={300} y={500} color="#e8ddd0" />
            <Person x={170} y={650} s={1.25} seated pose="reach" hand={[36, -96]} armClass="arm-stir" color="#e8a317" rim={RIM} skin={SKIN} hair={HAIR}>
              <line x1={36} y1={-96} x2={92} y2={-148} stroke="#7a5a22" strokeWidth={3.4} strokeLinecap="round" />
            </Person>

            {/* kasar laddus, rasia and a tray of thekua */}
            <Thali x={500} y={662} s={1.35}>
              {[-20, -7, 7, 20].map((lx, i) => (
                <circle key={lx} cx={lx} cy={-5 - (i % 2) * 2} r={7} fill="#c47a2a" />
              ))}
              <circle cx={0} cy={-12} r={7} fill="#d98a35" />
            </Thali>
            <Handi x={606} y={660} s={0.95} content="kheer" />
            <Thali x={720} y={664} s={1.3}>
              <Thekua x={-18} y={-6} />
              <Thekua x={4} y={-8} />
              <Thekua x={-8} y={-14} s={0.95} />
              <Thekua x={20} y={-6} s={0.9} />
            </Thali>

            {/* fruits and the soop for the family puja */}
            <rect x={870} y={640} width={470} height={46} rx={6} fill="#c4262a" opacity={0.9} />
            <rect x={870} y={640} width={470} height={46} rx={6} fill="none" stroke="#f2c14e" strokeWidth={3} />
            <Sugarcane x={1330} y={650} h={300} tilt={4} />
            <Sugarcane x={1360} y={654} h={280} tilt={9} />
            <BigSoop x={1000} y={660} s={1.2} />
            <Daura x={1130} y={650} s={1} />
            <Coconut x={1230} y={664} s={1.1} />
            <Banana x={1260} y={666} s={1.1} />
            <Fruit x={1196} y={668} s={1.1} color="#e2392b" />
            <Diya x={870} y={634} s={0.7} delay={0.3} />
            <Diya x={1330} y={638} s={0.7} delay={0.8} />

            {/* parana: the vratin accepts prasad and shares it */}
            <Reveal progress={progress} at={0.58} dx={-20}>
              <Person x={880} y={690} s={1.4} seated pose="namaste" color="#f2b705" rim={RIM} skin={SKIN} hair={HAIR} />
            </Reveal>
            <Reveal progress={progress} at={0.66} dx={24}>
              <Person x={1090} y={730} s={1.35} flip kind="man" pose="reach" hand={[30, -96]} armClass="arm-give" armDur="3.8s" color="#d6371f" rim={RIM} skin={SKIN} hair={HAIR} />
            </Reveal>
            <Reveal progress={progress} at={0.7} dx={24}>
              <Person x={970} y={742} s={0.82} flip pose="namaste" color="#e2582b" rim={RIM} skin={SKIN} hair={HAIR} />
            </Reveal>
            <Reveal progress={progress} at={0.74} dx={-24}>
              <Person x={760} y={744} s={1.2} pose="reach" hand={[32, -92]} armClass="arm-give" armDur="4.2s" color="#f6efe0" hair="#d9d4cc" skin={SKIN} rim={RIM} />
            </Reveal>
            <Marigold x={820} y={676} s={0.9} />
            <Marigold x={940} y={674} s={0.8} />
          </g>
        </ParallaxLayer>

        <motion.g style={{ opacity: petalOp }}>
          <Petals />
        </motion.g>
        <Particles count={44} x={0} y={260} width={1600} height={420} rise={-200} drift={50} size={[4, 10]} seed={79} />
        </g>
      </motion.g>

      <rect x={0} y={640} width={1600} height={260} fill="url(#g-vignette-bottom)" pointerEvents="none" />
    </SceneSvg>
  );
}
