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
import { Hut, Tree, TulsiChaura, Treeline, Palms } from '../components/art/Village';
import { Chulha, Handi, Kalash, Matka, Plate, Smoke, Thali, Banana } from '../components/art/Props';
import { AnimatedSun } from '../components/AnimatedSun';
import { Diya } from '../components/Diyas';
import { cv } from '../lib/utils';

const HORIZON = 470;
const SUN_X = 300;
const RIM = '#ffb25a';

const SKY: readonly SkyKey[] = [
  { at: 0, top: '#4f6aa8', mid: '#f3a766', bottom: '#ffd488' },
  { at: 0.45, top: '#2e2d70', mid: '#c4505e', bottom: '#f4893f' },
  { at: 1, top: '#0b1030', mid: '#25204e', bottom: '#6c3a5a' },
];

/** Chapter 2 — Kharna: dusk in the village kitchen; kheer, roti, puja and prasad. */
export function Kharna({ progress }: SceneProps) {
  const sunY = useTransform(progress, [0, 0.6], [330, 585]);
  const sunScale = useTransform(progress, [0, 0.6], [1.15, 1.55]);
  const sunRed = useTransform(progress, [0, 0.6], [0.25, 0.95]);
  const sunGlow = useTransform(progress, [0, 0.5, 0.65], [1, 0.8, 0]);
  const starOp = useTransform(progress, [0.4, 0.8], [0, 1]);
  const cloudTint = useTransform(progress, [0, 0.45, 1], ['#ffd9a8', '#e48a6a', '#3a3463']);
  const birdOp = useTransform(progress, [0.2, 0.45], [1, 0]);
  const night = useTransform(progress, [0, 0.6, 1], [0.0, 0.42, 0.62]);
  const fire = useTransform(progress, [0, 0.2], [0.35, 1]);
  const fireGlow = useTransform(progress, [0, 0.3, 1], [0.35, 0.8, 1]);
  const doorGlow = useTransform(progress, [0.3, 0.8], [0, 1]);

  return (
    <SceneSvg focusX={820}>
      <Sky progress={progress} keys={SKY} horizon={HORIZON} />
      <Stars opacity={starOp} count={80} maxY={360} seed={31} />
      <ParallaxLayer depth={6}>
        <AnimatedSun x={SUN_X} y={sunY} r={64} scale={sunScale} redness={sunRed} glow={sunGlow} />
        <Clouds tint={cloudTint} count={5} yMin={90} yMax={330} opacity={0.8} seed={9} speed={190} />
      </ParallaxLayer>
      <motion.g style={{ opacity: birdOp }}>
        <Birds flocks={2} birdsPerFlock={6} y={170} color="#2a1830" speed={30} seed={15} />
      </motion.g>

      <ParallaxLayer depth={10}>
        <Treeline baseY={HORIZON + 6} color="#4a3a63" seed={12} height={70} />
        <Palms baseY={HORIZON + 6} color="#3a2e55" seed={14} count={9} />
        <Treeline baseY={HORIZON + 12} color="#2f4a3e" seed={19} height={44} />
      </ParallaxLayer>

      {/* village backdrop */}
      <ParallaxLayer depth={14}>
        <rect x={-200} y={HORIZON} width={2000} height={500} fill="#6b4328" />
        <Tree x={110} y={560} s={1.1} seed={4} color="#2a4a2c" light="#3f6a36" />
        <Hut x={1330} y={585} s={1.25} wall="#b4784c" />
        <motion.circle cx={1330} cy={560} r={90} fill="url(#g-diya-glow)" style={{ opacity: doorGlow }} />
        <Tree x={1560} y={560} s={0.9} seed={6} color="#2a4a2c" light="#3f6a36" />
        <TulsiChaura x={1120} y={600} s={1.1} />
      </ParallaxLayer>

      {/* courtyard floor */}
      <ellipse cx={800} cy={640} rx={900} ry={190} fill="#8c5c38" />
      <ellipse cx={800} cy={600} rx={820} ry={120} fill="#9a683f" opacity={0.7} />
      <g stroke="#7a4d2c" strokeWidth={2} fill="none" opacity={0.5}>
        <path d="M120,640 Q420,620 700,640" />
        <path d="M900,650 Q1200,628 1480,650" />
        <path d="M200,730 Q600,712 1000,730" />
      </g>

      {/* dusk grade */}
      <motion.rect x={-200} y={-100} width={2000} height={1100} fill="#0c0f30" style={{ opacity: night }} pointerEvents="none" />

      {/* firelight pooling on the ground */}
      <motion.g style={{ opacity: fireGlow }}>
        <ellipse cx={760} cy={590} rx={420} ry={120} fill="url(#g-diya-glow)" className="anim-glow" style={cv({ '--dur': '1.3s' })} />
        <ellipse cx={980} cy={595} rx={220} ry={70} fill="url(#g-diya-glow)" className="anim-glow" style={cv({ '--dur': '1.7s' })} />
      </motion.g>

      <ParallaxLayer depth={24}>
        <g transform="translate(0 -118)">
        {/* the main chulha with gur wali kheer */}
        <Chulha x={760} y={700} s={1.2} fire={fire} />
        <Handi x={760} y={626} s={0.95} content="kheer" />
        <Smoke x={770} y={540} color="#cfc4d8" />
        <Particles count={26} x={720} y={600} width={90} height={60} variant="ember" rise={-190} drift={40} duration={[2.5, 5]} seed={41} />

        {/* cook stirring the kheer */}
        <Reveal progress={progress} at={0.04} dx={-30}>
          <Person x={640} y={710} s={1.25} seated pose="reach" hand={[36, -96]} armClass="arm-stir" color="#e8a317" rim={RIM}>
            <line x1={36} y1={-96} x2={92} y2={-162} stroke="#7a5a22" strokeWidth={3.4} strokeLinecap="round" />
          </Person>
        </Reveal>

        {/* roti on a tawa */}
        <Reveal progress={progress} at={0.16} dy={14}>
          <Chulha x={990} y={706} s={0.78} fire={fire} />
          <ellipse cx={990} cy={652} rx={52} ry={8} fill="#1b1b22" />
          <g className="anim-puff" style={cv({ '--dur': '2.6s' })}>
            <ellipse cx={986} cy={649} rx={24} ry={5.5} fill="#e9c27a" />
          </g>
          <Smoke x={992} y={620} count={3} color="#e9dfd0" />
          <Person x={1140} y={716} s={1.2} flip seated pose="reach" hand={[30, -92]} armClass="arm-roll" color="#d6371f" rim={RIM}>
            <line x1={14} y1={-90} x2={58} y2={-90} stroke="#c9a64a" strokeWidth={6} strokeLinecap="round" />
          </Person>
          <Plate x={1092} y={726} s={1.7}>
            <ellipse cy={-2} rx={15} ry={3.5} fill="#f1d9a2" />
          </Plate>
        </Reveal>

        {/* Kharna puja */}
        <Reveal progress={progress} at={0.4} dy={12}>
          <Thali x={330} y={716} s={1.5}>
            <Diya x={-16} y={-4} s={0.7} delay={0.3} />
            <Diya x={16} y={-4} s={0.7} delay={0.9} />
          </Thali>
          <Kalash x={448} y={718} s={1.15} />
          <Plate x={400} y={738} s={1.7}>
            <ellipse cx={-6} cy={-3} rx={10} ry={3.5} fill="#c4863a" />
            <ellipse cx={8} cy={-4} rx={8} ry={3} fill="#e9c27a" />
          </Plate>
          <Banana x={520} y={722} s={0.9} />
          <Matka x={540} y={700} s={0.9} />
        </Reveal>
        <Reveal progress={progress} at={0.42} out={[0.7, 0.76]} dx={-26}>
          <Person x={250} y={720} s={1.35} seated pose="namaste" color="#f2b705" rim={RIM} />
        </Reveal>

        {/* handing out the prasad */}
        <Reveal progress={progress} at={0.74} dx={-12}>
          <Person x={250} y={720} s={1.35} seated pose="reach" hand={[34, -90]} armClass="arm-give" armDur="3.6s" color="#f2b705" rim={RIM}>
            <Plate x={40} y={-90} s={0.95}>
              <ellipse cx={-5} cy={-3} rx={8} ry={3} fill="#c4863a" />
              <ellipse cx={7} cy={-3} rx={6} ry={2.6} fill="#e9c27a" />
            </Plate>
          </Person>
        </Reveal>
        <Reveal progress={progress} at={0.76} dx={30}>
          <Person x={560} y={742} s={1.3} flip kind="man" pose="reach" hand={[30, -96]} armClass="arm-give" armDur="3.6s" color="#d6371f" rim={RIM} />
        </Reveal>
        <Reveal progress={progress} at={0.82} dx={30}>
          <Person x={640} y={752} s={0.8} flip pose="namaste" color="#e2582b" rim={RIM} />
        </Reveal>
        <Reveal progress={progress} at={0.87} dx={30}>
          <Person x={420} y={758} s={1.1} pose="namaste" color="#f6efe0" hair="#d9d4cc" rim={RIM} />
        </Reveal>
        </g>
      </ParallaxLayer>

      <Particles count={40} x={0} y={300} width={1600} height={450} rise={-200} drift={50} size={[4, 9]} seed={52} />
      <rect x={0} y={640} width={1600} height={260} fill="url(#g-vignette-bottom)" pointerEvents="none" />
    </SceneSvg>
  );
}
