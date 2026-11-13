import { memo, useMemo } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { SceneMeta } from '../types';

/** Narration is revealed word by word between these two chapter-progress values. */
const START = 0.1;
const END = 0.46;

interface WordProps {
  word: string;
  from: number;
  to: number;
  progress: MotionValue<number>;
}

function Word({ word, from, to, progress }: WordProps) {
  const opacity = useTransform(progress, [from, to], [0, 1]);
  const y = useTransform(progress, [from, to], [14, 0]);
  const blur = useTransform(progress, [from, to], ['blur(6px)', 'blur(0px)']);
  return (
    <motion.span className="inline-block whitespace-pre" style={{ opacity, y, filter: blur }}>
      {word}
    </motion.span>
  );
}

interface Props {
  scene: SceneMeta;
  progress: MotionValue<number>;
  showEnglish: boolean;
  hidden?: boolean;
  /** Keep the text on screen for the whole chapter (reduced-motion mode). */
  persist?: boolean;
}

/** Animated Hindi narration with optional English subtitle. Screen readers get the full line at once. */
function HindiNarrationBase({ scene, progress, showEnglish, hidden = false, persist = false }: Props) {
  const words = useMemo(() => scene.narrationHi.split(' '), [scene.narrationHi]);
  const enOpacity = useTransform(progress, [END - 0.12, END], [0, 1]);
  const fadeOut = useTransform(progress, [0.66, 0.76], [1, 0]);

  return (
    <motion.div
      style={{ opacity: hidden ? 0 : persist ? 1 : fadeOut }}
      className="pointer-events-none relative mx-auto w-full max-w-4xl px-5 text-center"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -inset-y-10 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(8,6,26,0.62),rgba(8,6,26,0.35)_55%,transparent_75%)]"
      />
      <p className="sr-only-live" aria-live="polite" role="status">
        {scene.narrationHi} {showEnglish ? scene.subtitleEn : ''}
      </p>
      <p
        aria-hidden="true"
        lang="hi"
        className="font-deva text-[1.35rem] leading-[1.7] text-gold-300 sm:text-[1.75rem] md:text-[2.15rem] md:leading-[1.6]"
        style={{ textShadow: '0 2px 18px rgba(0,0,0,0.85), 0 0 28px rgba(255,170,60,0.35)' }}
      >
        {words.map((w, i) => {
          const span = (END - START) / words.length;
          const from = START + i * span;
          return <Word key={`${scene.id}-${i}`} word={i < words.length - 1 ? `${w} ` : w} from={from} to={from + span * 2.2} progress={progress} />;
        })}
      </p>
      {showEnglish && (
        <motion.p
          aria-hidden="true"
          lang="en"
          className="mx-auto mt-2 max-w-2xl font-sub text-base italic text-white/85 sm:text-lg md:text-xl"
          style={{ opacity: enOpacity, textShadow: '0 2px 14px rgba(0,0,0,0.9)' }}
        >
          {scene.subtitleEn}
        </motion.p>
      )}
    </motion.div>
  );
}

export const HindiNarration = memo(HindiNarrationBase);
