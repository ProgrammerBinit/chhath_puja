import { useId, useMemo } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { cv, mulberry32 } from '../../lib/utils';

export interface SkyKey {
  at: number;
  top: string;
  mid: string;
  bottom: string;
}

interface SkyProps {
  progress: MotionValue<number>;
  keys: readonly SkyKey[];
  /** y where the sky meets the horizon. */
  horizon: number;
  /** Optional: expose colours so other layers (water, haze) can match the sky. */
  children?: never;
}

/** A sky whose three gradient stops are driven by the chapter clock. */
export function Sky({ progress, keys, horizon }: SkyProps) {
  const id = useId().replace(/:/g, '');
  const at = keys.map((k) => k.at);
  const top = useTransform(progress, at, keys.map((k) => k.top));
  const mid = useTransform(progress, at, keys.map((k) => k.mid));
  const bottom = useTransform(progress, at, keys.map((k) => k.bottom));
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sky`} gradientUnits="userSpaceOnUse" x1="0" y1="-40" x2="0" y2={horizon}>
          <motion.stop offset="0%" style={{ stopColor: top }} />
          <motion.stop offset="55%" style={{ stopColor: mid }} />
          <motion.stop offset="100%" style={{ stopColor: bottom }} />
        </linearGradient>
      </defs>
      <rect x={-1400} y={-1600} width={4400} height={horizon + 1600 + 4} fill={`url(#${id}-sky)`} />
    </g>
  );
}

/** Returns the three animated colours of a sky, for tinting haze / water / clouds. */
export function useSkyColors(progress: MotionValue<number>, keys: readonly SkyKey[]) {
  const at = keys.map((k) => k.at);
  return {
    top: useTransform(progress, at, keys.map((k) => k.top)),
    mid: useTransform(progress, at, keys.map((k) => k.mid)),
    bottom: useTransform(progress, at, keys.map((k) => k.bottom)),
  };
}

interface StarsProps {
  opacity: MotionValue<number>;
  count?: number;
  maxY?: number;
  seed?: number;
}

export function Stars({ opacity, count = 90, maxY = 420, seed = 7 }: StarsProps) {
  const stars = useMemo(() => {
    const r = mulberry32(seed);
    return Array.from({ length: count }, () => ({
      x: r() * 1700 - 50,
      y: r() * maxY,
      r: 0.7 + r() * 1.7,
      dur: 1.8 + r() * 3.5,
      delay: -r() * 4,
    }));
  }, [count, maxY, seed]);
  return (
    <motion.g style={{ opacity }}>
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill="#fff7dc"
          className="anim-twinkle"
          style={cv({ '--dur': `${s.dur}s`, animationDelay: `${s.delay}s` })}
        />
      ))}
    </motion.g>
  );
}
