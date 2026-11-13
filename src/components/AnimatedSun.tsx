import { useMemo } from 'react';
import { motion, type MotionValue } from 'framer-motion';
import { cv } from '../lib/utils';

interface Props {
  x: MotionValue<number> | number;
  y: MotionValue<number>;
  /** Disc radius in SVG units. */
  r?: number;
  /** Uniform scale — suns look larger near the horizon. */
  scale?: MotionValue<number> | number;
  /** 0 → 1: how strongly the disc turns deep red-orange (low sun). */
  redness?: MotionValue<number>;
  /** Overall brightness of the halo and rays. */
  glow?: MotionValue<number>;
  rays?: boolean;
}

/**
 * The sun: layered halo, slowly rotating god-rays and a gradient disc.
 * Position / scale / colour are MotionValues so the sun travels on the chapter clock without re-renders.
 */
export function AnimatedSun({ x, y, r = 70, scale = 1, redness, glow, rays = true }: Props) {
  const rayPaths = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const a = (i / 18) * Math.PI * 2;
        const w = 0.07;
        const R = r * 9;
        const p = (ang: number, rad: number) => `${(Math.cos(ang) * rad).toFixed(1)},${(Math.sin(ang) * rad).toFixed(1)}`;
        return `M${p(a - w, r * 1.2)} L${p(a, R)} L${p(a + w, r * 1.2)} Z`;
      }),
    [r],
  );

  return (
    <motion.g style={{ x, y, scale }}>
      <motion.g style={glow ? { opacity: glow } : undefined}>
        <circle r={r * 6} fill="url(#g-sun-halo)" />
        {rays && (
          <g className="anim-spin" style={cv({ '--dur': '200s' })}>
            {rayPaths.map((d, i) => (
              <path key={i} d={d} fill="url(#g-sun-ray)" opacity={0.28} />
            ))}
          </g>
        )}
      </motion.g>
      <circle r={r} fill="url(#g-sun-disc)" />
      {redness && <motion.circle r={r} fill="#e5400f" style={{ opacity: redness }} />}
    </motion.g>
  );
}
