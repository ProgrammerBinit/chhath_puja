import { useEffect, useRef, type ComponentType } from 'react';
import {
  AnimatePresence,
  motion,
  useIsPresent,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import type { SceneId, SceneMeta, SceneProps } from '../types';
import { ParallaxContext } from './art/ParallaxLayer';
import { NahayKhay } from '../scenes/NahayKhay';
import { Kharna } from '../scenes/Kharna';
import { SandhyaArghya } from '../scenes/SandhyaArghya';
import { UshaArghya } from '../scenes/UshaArghya';

const SCENES: Record<SceneId, ComponentType<SceneProps>> = {
  'nahay-khay': NahayKhay,
  kharna: Kharna,
  'sandhya-arghya': SandhyaArghya,
  'usha-arghya': UshaArghya,
};

interface StageProps {
  scene: SceneMeta;
  master: MotionValue<number>;
  reducedMotion: boolean;
}

/**
 * One mounted chapter. It mirrors the master clock into its own MotionValue, but stops listening
 * as soon as it starts leaving — so the outgoing chapter freezes while it cross-fades away.
 */
function SceneStage({ scene, master, reducedMotion }: StageProps) {
  const local = useMotionValue(master.get());
  const present = useIsPresent();
  const presentRef = useRef(present);
  presentRef.current = present;

  useMotionValueEvent(master, 'change', (v) => {
    if (presentRef.current) local.set(v);
  });

  const zoom = useTransform(local, [0, 1], [1, 1.07]);
  const Scene = SCENES[scene.id];

  return (
    <motion.div
      className="absolute inset-0"
      style={{ background: scene.ground }}
      initial={{ opacity: 0, scale: reducedMotion ? 1 : 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, transition: { duration: reducedMotion ? 0.15 : 1.1, delay: reducedMotion ? 0 : 0.35 } }}
      transition={{ duration: reducedMotion ? 0.15 : 1.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div className="absolute inset-0 will-change-transform" style={{ scale: reducedMotion ? 1 : zoom }}>
        <Scene progress={local} reducedMotion={reducedMotion} />
      </motion.div>
    </motion.div>
  );
}

interface Props {
  scene: SceneMeta;
  replayKey: number;
  progress: MotionValue<number>;
  reducedMotion: boolean;
  paused: boolean;
}

/** Hosts the active chapter: cinematic cross-fade, pointer parallax, light-leak flash and vignette. */
export function SceneRenderer({ scene, replayKey, progress, reducedMotion, paused }: Props) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 38, damping: 18, mass: 0.8 });
  const sy = useSpring(my, { stiffness: 38, damping: 18, mass: 0.8 });

  useEffect(() => {
    if (reducedMotion) {
      mx.set(0);
      my.set(0);
    }
  }, [reducedMotion, mx, my]);

  const sceneKey = `${scene.id}-${replayKey}`;

  return (
    <ParallaxContext.Provider value={{ x: sx, y: sy }}>
      <div
        className={`absolute inset-0 overflow-hidden bg-midnight-950 ${paused ? 'is-paused' : ''}`}
        role="img"
        aria-label={`${scene.dayHi} — ${scene.titleHi}. ${scene.altHi}`}
        onPointerMove={(e) => {
          if (reducedMotion) return;
          const r = e.currentTarget.getBoundingClientRect();
          mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
          my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
        }}
      >
        <AnimatePresence initial={false}>
          <SceneStage key={sceneKey} scene={scene} master={progress} reducedMotion={reducedMotion} />
        </AnimatePresence>

        {/* golden light-leak between chapters */}
        {!reducedMotion && (
          <motion.div
            key={`leak-${sceneKey}`}
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(255,190,90,0.85), rgba(255,120,30,0.35) 45%, transparent 75%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.75, 0] }}
            transition={{ duration: 1.6, times: [0, 0.35, 1], ease: 'easeInOut' }}
          />
        )}

        {/* vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(4,6,20,0.55) 100%)' }}
        />
      </div>
    </ParallaxContext.Provider>
  );
}
