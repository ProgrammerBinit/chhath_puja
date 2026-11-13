import { useMemo } from 'react';
import { motion, type MotionValue } from 'framer-motion';
import { cv, mulberry32 } from '../../lib/utils';

interface Props {
  count?: number;
  x: number;
  y: number;
  width: number;
  height: number;
  /** Glowing dots (default), or raw coloured embers. */
  variant?: 'glow' | 'ember' | 'dust';
  size?: [number, number];
  /** Rise distance in SVG units (negative = up). */
  rise?: number;
  drift?: number;
  duration?: [number, number];
  opacity?: MotionValue<number>;
  seed?: number;
  color?: string;
}

/** Floating golden dust, embers or fireflies. */
export function Particles({
  count = 30,
  x,
  y,
  width,
  height,
  variant = 'glow',
  size = [5, 12],
  rise = -170,
  drift = 40,
  duration = [7, 13],
  opacity,
  seed = 5,
  color = '#ffcf6a',
}: Props) {
  const items = useMemo(() => {
    const r = mulberry32(seed);
    return Array.from({ length: count }, () => ({
      cx: x + r() * width,
      cy: y + r() * height,
      s: size[0] + r() * (size[1] - size[0]),
      dur: duration[0] + r() * (duration[1] - duration[0]),
      delay: -r() * duration[1],
      dx: (r() - 0.5) * drift * 2,
      op: 0.55 + r() * 0.45,
    }));
  }, [count, x, y, width, height, size, duration, drift, seed]);

  return (
    <motion.g style={opacity ? { opacity } : undefined}>
      {items.map((p, i) => (
        <g
          key={i}
          className="anim-float"
          style={cv({
            '--dur': `${p.dur}s`,
            '--dx': `${p.dx}px`,
            '--dy': `${rise}px`,
            '--op': p.op,
            animationDelay: `${p.delay}s`,
          })}
        >
          {variant === 'glow' ? (
            <circle cx={p.cx} cy={p.cy} r={p.s} fill="url(#g-dot)" />
          ) : (
            <circle cx={p.cx} cy={p.cy} r={variant === 'ember' ? p.s * 0.22 : p.s * 0.3} fill={variant === 'ember' ? '#ff8a2a' : color} />
          )}
        </g>
      ))}
    </motion.g>
  );
}
