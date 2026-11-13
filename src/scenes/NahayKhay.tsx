import { motion, useTransform } from 'framer-motion';
import type { SceneProps } from '../types';
import { SceneSvg } from '../components/art/SceneSvg';
import { Sky, Stars, type SkyKey } from '../components/art/Sky';
import { Clouds } from '../components/art/Clouds';
import { Birds } from '../components/art/Birds';
import { Particles } from '../components/art/Particles';
import { ParallaxLayer } from '../components/art/ParallaxLayer';
import { Reveal } from '../components/art/Reveal';
import { Person } from '../components/art/Person';
import { Hut, Tree, Bamboo, TulsiChaura, Treeline, Palms } from '../components/art/Village';
import { Chulha, Handi, Matka, Smoke, Broom, Lauki, Thali, Marigold } from '../components/art/Props';
import { AnimatedSun } from '../components/AnimatedSun';
import { AnimatedRiver, Ripples, WaterVeil } from '../components/AnimatedRiver';
import { Diya } from '../components/Diyas';
import { cv } from '../lib/utils';

const HORIZON = 566;
const SUN_X = 1010;
const RIM = '#ffd27a';

const SKY: readonly SkyKey[] = [
  { at: 0, top: '#1b2559', mid: '#8a4a7a', bottom: '#f08a4b' },
  { at: 0.35, top: '#3d6aa8', mid: '#f0a070', bottom: '#ffc872' },
  { at: 1, top: '#6fb4e8', mid: '#fbd69a', bottom: '#fff0c0' },
];

/** Chapter 1 — an early morning in a Bihari village: sunrise, holy bath, cleaning, cooking. */
export function NahayKhay({ progress }: SceneProps) {
  const sunY = useTransform(progress, [0, 0.55, 1], [650, 390, 305]);
  const sunScale = useTransform(progress, [0, 0.55, 1], [1.4, 1.1, 1]);
  const sunRed = useTransform(progress, [0, 0.4, 1], [0.75, 0.15, 0]);
  const sunGlow = useTransform(progress, [0, 0.4, 1], [0.5, 1, 1]);
  const starOp = useTransform(progress, [0, 0.22], [0.8, 0]);
  const cloudTint = useTransform(progress, [0, 0.4, 1], ['#f2a98c', '#ffd9b0', '#fff4da']);
  const waterTop = useTransform(progress, [0, 0.5, 1], ['#b4687e', '#e9a77a', '#8fcad6']);
  const waterBottom = useTransform(progress, [0, 0.5, 1], ['#1c2850', '#4a7a8e', '#2a7e92']);
  const dawnDim = useTransform(progress, [0, 0.5], [0.5, 0]);
  const reflectOp = useTransform(progress, [0, 0.2, 1], [0.2, 1, 0.9]);
  const mist = useTransform(progress, [0, 0.6, 1], [0.5, 0.25, 0.12]);
  const raysOp = useTransform(progress, [0, 0.3, 1], [0, 0.9, 0.6]);

  return (
    <SceneSvg focusX={880}>
      <Sky progress={progress} keys={SKY} horizon={HORIZON} />
      <Stars opacity={starOp} count={60} maxY={300} seed={2} />
      <ParallaxLayer depth={6}>
        <AnimatedSun x={SUN_X} y={sunY} r={62} scale={sunScale} redness={sunRed} glow={sunGlow} />
        <Clouds tint={cloudTint} count={6} yMin={70} yMax={300} opacity={0.85} seed={5} speed={170} />
      </ParallaxLayer>
      <Birds flocks={3} birdsPerFlock={7} y={120} color="#3a2236" speed={26} seed={4} />

      {/* far horizon */}
      <ParallaxLayer depth={10}>
        <Treeline baseY={HORIZON + 4} color="#5e5a78" seed={3} height={70} />
        <Palms baseY={HORIZON + 4} color="#4e4a6a" seed={8} count={9} />
        <Treeline baseY={HORIZON + 8} color="#456a52" seed={6} height={46} />
      </ParallaxLayer>

      {/* the pond / river */}
      <AnimatedRiver
        top={HORIZON + 6}
        topColor={waterTop}
        bottomColor={waterBottom}
        reflectX={SUN_X}
        reflectOpacity={reflectOp}
        waves={12}
        seed={14}
      />
      <motion.rect x={-100} y={HORIZON - 36} width={1900} height={96} fill="url(#g-mist)" style={{ opacity: mist }} className="anim-glow" />

      {/* light shafts from the rising sun */}
      <motion.g style={{ opacity: raysOp }} className="anim-pulse-ray" aria-hidden>
        <polygon points={`${SUN_X},330 ${SUN_X - 380},900 ${SUN_X - 160},900`} fill="#ffe9a8" opacity={0.12} />
        <polygon points={`${SUN_X},330 ${SUN_X - 700},900 ${SUN_X - 480},900`} fill="#ffe9a8" opacity={0.09} />
        <polygon points={`${SUN_X},330 ${SUN_X + 120},900 ${SUN_X + 320},900`} fill="#ffe9a8" opacity={0.08} />
      </motion.g>

      {/* lotus pads on the water */}
      <ParallaxLayer depth={14}>
        {[
          [1330, 640, 0.7],
          [1450, 700, 0.9],
          [1230, 700, 0.8],
          [1520, 650, 0.6],
        ].map(([lx, ly, ls], i) => (
          <g key={i} transform={`translate(${lx} ${ly}) scale(${ls})`} className="anim-bob" style={cv({ '--dur': `${3 + i * 0.4}s`, '--amp': '2px' })}>
            <ellipse rx={34} ry={7} fill="#2f6a3a" />
            <ellipse cx={4} cy={-1} rx={22} ry={4} fill="#4a8d4a" opacity={0.8} />
            {i % 2 === 0 && (
              <g fill="#ffb3c8">
                <path d="M0,-3 Q-8,-16 0,-24 Q8,-16 0,-3Z" />
                <path d="M-2,-3 Q-16,-10 -14,-20 Q-4,-14 -2,-3Z" fill="#ff8fb0" />
                <path d="M2,-3 Q16,-10 14,-20 Q4,-14 2,-3Z" fill="#ff8fb0" />
              </g>
            )}
          </g>
        ))}
      </ParallaxLayer>

      {/* the village yard (left bank) */}
      <ParallaxLayer depth={16}>
        <path
          d={`M-200,${HORIZON + 2} L560,${HORIZON + 2} C690,${HORIZON + 14} 760,${HORIZON + 50} 800,660 C850,740 815,830 770,960 L-200,960 Z`}
          fill="#6f8f3e"
        />
        <path d="M-200,640 Q300,610 700,650 L760,960 L-200,960Z" fill="#7c9a46" opacity={0.7} />
        {/* swept mud courtyard */}
        <ellipse cx={330} cy={760} rx={420} ry={120} fill="#b58a5c" />
        <ellipse cx={330} cy={760} rx={420} ry={120} fill="none" stroke="#8d6338" strokeWidth={3} opacity={0.5} />
        <g stroke="#9c7243" strokeWidth={2} fill="none" opacity={0.55}>
          <path d="M-20,780 Q150,770 300,782" />
          <path d="M40,815 Q200,806 360,818" />
          <path d="M300,770 Q480,760 640,790" />
          <path d="M260,835 Q440,828 620,842" />
        </g>
        {/* reeds on the bank */}
        <g stroke="#4f6a2a" strokeWidth={3} fill="none" className="anim-sway" style={cv({ '--dur': '4s' })}>
          <path d="M790,690 Q784,650 796,620" />
          <path d="M802,696 Q812,654 800,628" />
          <path d="M778,700 Q770,664 780,640" />
        </g>
        <g fill="#6a4a2a">
          <ellipse cx={796} cy={620} rx={3.5} ry={11} />
          <ellipse cx={800} cy={628} rx={3.5} ry={10} />
        </g>

        <Tree x={40} y={640} s={1.15} seed={1} />
        <Bamboo x={-30} y={640} s={0.62} />
        <Hut x={235} y={655} s={0.85} />
        <Hut x={520} y={685} s={0.95} wall="#c18a58" roof="#a9482a" />
        <Tree x={690} y={650} s={0.8} seed={3} color="#2a5230" light="#44763a" />

        {/* bottle gourds (lauki) hanging on the roof */}
        <Lauki x={520} y={560} s={1.1} rot={20} />
        <Lauki x={560} y={566} s={1} rot={-14} />
        <Lauki x={472} y={566} s={0.9} rot={10} />
      </ParallaxLayer>

      <ParallaxLayer depth={26}>
        <g transform="translate(0 -92)">
        <TulsiChaura x={375} y={798} s={1.1} />
        <Marigold x={335} y={792} s={0.8} />
        <Matka x={150} y={858} s={0.9} />
        <Matka x={190} y={866} s={0.7} />

        {/* open kitchen: earthen chulha with lauki-chana dal */}
        <Reveal progress={progress} at={0.18} dy={10}>
          <Chulha x={640} y={850} s={0.62} />
          <Handi x={640} y={806} s={0.78} content="dal" />
          <Smoke x={650} y={760} />
        </Reveal>
        <Reveal progress={progress} at={0.2} dx={-30}>
          <Person
            x={548}
            y={858}
            s={1.0}
            seated
            pose="reach"
            hand={[36, -96]}
            armClass="arm-stir"
            color="#e8a317"
            rim={RIM}
            skin="#7a4a2e"
          >
            <line x1={36} y1={-96} x2={92} y2={-58} stroke="#7a5a22" strokeWidth={3.4} strokeLinecap="round" />
          </Person>
        </Reveal>

        {/* elder woman washing arwa chawal (rice) */}
        <Reveal progress={progress} at={0.32} dx={-24}>
          <Thali x={430} y={880} s={1.05}>
            <path d="M-24,-1 Q0,-14 24,-1 Q0,5 -24,-1Z" fill="#fbf4e4" />
            <g fill="#fff">
              <circle cx={-9} cy={-4} r={1.3} />
              <circle cx={0} cy={-6} r={1.3} />
              <circle cx={10} cy={-3} r={1.3} />
            </g>
          </Thali>
          <Person x={372} y={884} s={1.0} seated pose="reach" hand={[44, -92]} armClass="arm-roll" color="#f6efe0" hair="#d9d4cc" rim={RIM} />
        </Reveal>

        {/* sweeping the courtyard */}
        <Reveal progress={progress} at={0.06} dx={-26}>
          <Person x={150} y={838} s={1.2} pose="reach" hand={[24, -92]} armClass="arm-sweep" color="#d6371f" rim={RIM}>
            <Broom x={24} y={-92} />
          </Person>
          <Particles count={12} x={190} y={832} width={70} height={14} variant="dust" rise={-34} drift={22} duration={[2.2, 4]} color="#d9b98a" seed={8} />
        </Reveal>

        {/* man carrying holy water, child with soop */}
        <Reveal progress={progress} at={0.42} dx={-20}>
          <Person x={270} y={878} s={1.28} kind="man" pose="raise" color="#d6371f" rim={RIM} />
        </Reveal>
        <Reveal progress={progress} at={0.5} dx={-20}>
          <Person x={330} y={890} s={0.72} pose="soop" color="#f2b705" rim={RIM} />
        </Reveal>

        {/* morning diya at the doorway */}
        <Diya x={590} y={760} s={0.5} delay={0.7} />
        </g>
      </ParallaxLayer>

      {/* the holy bath — a vratin pouring pond water over herself */}
      <ParallaxLayer depth={22}>
        <defs>
          <clipPath id="nk-pond">
            <path d={`M600,${HORIZON} C690,${HORIZON + 14} 760,616 800,660 C850,740 815,830 770,960 L1800,960 L1800,${HORIZON} Z`} />
          </clipPath>
        </defs>
        <Person x={1130} y={790} s={1.65} flip pose="bathe" color="#f2b705" rim={RIM} armDur="7s" />
        <g clipPath="url(#nk-pond)"><WaterVeil y={662} height={260} color={waterTop} opacity={0.9} amp={4} dur={14} /></g>
        <Ripples x={1130} y={672} rx={95} count={3} />
        <Particles count={16} x={1090} y={640} width={80} height={30} variant="dust" rise={-46} drift={14} duration={[2, 3.6]} color="#d9f1ff" seed={13} />
        <Person x={1360} y={745} s={1.15} flip pose="raise" color="#d6371f" rim={RIM} />
        <g clipPath="url(#nk-pond)"><WaterVeil y={720} height={220} color={waterTop} opacity={0.92} amp={3} dur={10} /></g>
        <Reveal progress={progress} at={0.3}>
          <Person x={1500} y={780} s={1.2} flip kind="man" pose="namaste" color="#f08a24" rim={RIM} />
          <g clipPath="url(#nk-pond)"><WaterVeil y={796} height={200} color={waterBottom} opacity={0.92} amp={4} dur={9} /></g>
        </Reveal>
      </ParallaxLayer>

      <Particles count={46} x={0} y={380} width={1600} height={500} rise={-220} drift={50} size={[4, 10]} seed={23} />
      <motion.rect x={-100} y={-100} width={1900} height={1100} fill="#2a2a6a" style={{ opacity: dawnDim }} pointerEvents="none" />
      <rect x={0} y={640} width={1600} height={260} fill="url(#g-vignette-bottom)" pointerEvents="none" />
    </SceneSvg>
  );
}
