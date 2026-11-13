import { useMemo } from 'react';
import { motion, type MotionValue } from 'framer-motion';
import { cv, mulberry32 } from '../../lib/utils';

interface Props {
  /** Fill colour — can be animated with the sky. */
  tint: MotionValue<string> | string;
  count?: number;
  yMin?: number;
  yMax?: number;
  opacity?: number;
  seed?: number;
  /** Seconds for one full crossing; smaller = faster. */
  speed?: number;
}

/** Soft cloud banks drifting slowly across the sky (CSS-animated, no re-renders). */
export function Clouds({ tint, count = 6, yMin = 60, yMax = 300, opacity = 0.8, seed = 3, speed = 150 }: Props) {
  const clouds = useMemo(() => {
    const r = mulberry32(seed);
    return Array.from({ length: count }, (_, i) => {
      const scale = 0.6 + r() * 1.1;
      return {
        y: yMin + r() * (yMax - yMin),
        scale,
        dur: speed * (0.8 + r() * 0.6),
        delay: -(i / count) * speed - r() * 20,
        puffs: Array.from({ length: 5 }, (_, k) => ({
          dx: (k - 2) * 46 + (r() - 0.5) * 20,
          dy: -Math.abs(k - 2) * 7 + (r() - 0.5) * 8,
          rx: 52 + r() * 40,
          ry: 16 + r() * 12,
        })),
      };
    });
  }, [count, yMin, yMax, seed, speed]);

  return (
    <motion.g style={{ fill: tint }} opacity={opacity}>
      {clouds.map((c, i) => (
        <g key={i} className="anim-drift" style={cv({ '--dur': `${c.dur}s`, animationDelay: `${c.delay}s` })}>
          <g transform={`translate(0 ${c.y}) scale(${c.scale})`}>
            {c.puffs.map((p, k) => (
              <ellipse key={k} cx={p.dx} cy={p.dy} rx={p.rx} ry={p.ry} />
            ))}
          </g>
        </g>
      ))}
    </motion.g>
  );
}
