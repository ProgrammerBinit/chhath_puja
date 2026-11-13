import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { SceneMeta } from '../types';

interface Props {
  scene: SceneMeta;
  progress: MotionValue<number>;
}

/** The big chapter card that opens each chapter, then melts away into the scene. */
export function ChapterTitle({ scene, progress }: Props) {
  const opacity = useTransform(progress, [0, 0.025, 0.1, 0.17], [0, 1, 1, 0]);
  const y = useTransform(progress, [0, 0.025, 0.1, 0.17], [24, 0, 0, -26]);
  const blur = useTransform(progress, [0.1, 0.17], ['blur(0px)', 'blur(10px)']);
  const line = useTransform(progress, [0.01, 0.07], [0, 1]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-[17%] z-10 flex flex-col items-center px-6 text-center"
      style={{ opacity, y, filter: blur }}
    >
      <span className="font-sub text-sm uppercase tracking-[0.5em] text-gold-300/90 sm:text-base">
        {scene.dayEn} · {scene.number}
      </span>
      <h2
        lang="hi"
        className="mt-2 font-deva text-5xl text-white sm:text-7xl md:text-8xl"
        style={{ textShadow: '0 4px 40px rgba(255,150,40,0.6), 0 2px 10px rgba(0,0,0,0.6)' }}
      >
        <span className="mr-3 text-gold-400">{scene.numberHi}</span>
        {scene.titleHi}
      </h2>
      <motion.div className="mt-3 h-px w-48 origin-center bg-gradient-to-r from-transparent via-gold-400 to-transparent sm:w-72" style={{ scaleX: line }} />
      <span className="mt-3 font-sub text-xl italic text-white/85 sm:text-2xl">
        {scene.dayHi} · {scene.titleEn}
      </span>
    </motion.div>
  );
}
