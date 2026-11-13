import { useMemo } from 'react';
import { motion, type MotionValue } from 'framer-motion';
import { cv, mulberry32 } from '../lib/utils';

export interface DiyaSpec {
  x: number;
  y: number;
  s?: number;
  delay?: number;
}

interface DiyaProps extends DiyaSpec {
  /** Draw the soft halo of light behind the lamp. */
  glow?: boolean;
}

/** A single earthen lamp with a flickering flame. */
export function Diya({ x, y, s = 1, delay = 0, glow = true }: DiyaProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {glow && (
        <circle
          cy={-12}
          r={58}
          fill="url(#g-diya-glow)"
          className="anim-glow"
          style={cv({ '--dur': `${1.8 + (delay % 1)}s`, animationDelay: `${-delay}s` })}
        />
      )}
      <path d="M-19,0 Q-17,15 0,17 Q17,15 19,0 Q0,7 -19,0 Z" fill="url(#g-clay)" />
      <path d="M-19,0 Q0,7 19,0" fill="none" stroke="#f0b27a" strokeWidth={1.5} opacity={0.7} />
      <path d="M-19,0 Q-24,-3 -20,-5 Q0,2 20,-5 Q24,-3 19,0" fill="#a24d2a" />
      <g className="anim-flicker" style={cv({ '--dur': `${0.9 + (delay % 0.7)}s`, animationDelay: `${-delay}s` })}>
        <path d="M0,-30 Q9,-17 0,-5 Q-9,-17 0,-30 Z" fill="url(#g-flame)" />
        <path d="M0,-18 Q3.5,-12 0,-6 Q-3.5,-12 0,-18 Z" fill="#fffbe0" opacity={0.9} />
      </g>
    </g>
  );
}

interface DiyasProps {
  items: readonly DiyaSpec[];
  opacity?: MotionValue<number>;
}

export function Diyas({ items, opacity }: DiyasProps) {
  return (
    <motion.g style={opacity ? { opacity } : undefined}>
      {items.map((d, i) => (
        <Diya key={i} {...d} delay={d.delay ?? i * 0.37} />
      ))}
    </motion.g>
  );
}

interface FloatingProps {
  count?: number;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  /** Horizontal travel in SVG units. */
  travel?: number;
  opacity?: MotionValue<number>;
  seed?: number;
}

/** Diyas floating down the river, bobbing with a faint reflection underneath. */
export function FloatingDiyas({ count = 14, xMin, xMax, yMin, yMax, travel = 520, opacity, seed = 9 }: FloatingProps) {
  const items = useMemo(() => {
    const r = mulberry32(seed);
    return Array.from({ length: count }, (_, i) => {
      const t = r();
      return {
        x: xMin + r() * (xMax - xMin),
        y: yMin + t * (yMax - yMin),
        s: 0.45 + t * 0.7,
        dur: 55 + r() * 40,
        delay: -r() * 90,
        bob: 1.6 + r() * 1.6,
        phase: i * 0.53,
      };
    });
  }, [count, xMin, xMax, yMin, yMax, seed]);

  return (
    <motion.g style={opacity ? { opacity } : undefined}>
      {items
        .slice()
        .sort((a, b) => a.y - b.y)
        .map((d, i) => (
          <g key={i} className="anim-drift-slow" style={cv({ '--dur': `${d.dur}s`, '--dx': `${travel}px`, animationDelay: `${d.delay}s` })}>
            <g transform={`translate(${d.x} ${d.y})`}>
              <ellipse cx={0} cy={18 * d.s} rx={30 * d.s} ry={5 * d.s} fill="#ffcf6a" opacity={0.28} />
              <g className="anim-bob" style={cv({ '--dur': `${d.bob}s`, '--amp': '3px', animationDelay: `${-d.phase}s` })}>
                <Diya x={0} y={0} s={d.s} delay={d.phase} />
              </g>
            </g>
          </g>
        ))}
    </motion.g>
  );
}
