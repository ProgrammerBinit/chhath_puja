import { useId, useMemo } from 'react';
import { motion, type MotionValue } from 'framer-motion';
import { cv, mulberry32 } from '../lib/utils';

const PERIOD = 160; // must divide the 320px translate used by .anim-wave

/** Seamlessly tiling sine path. Translating it 320px left loops perfectly. */
function wavePath(y: number, amp: number, from = -480, to = 2200): string {
  const n = Math.ceil((to - from) / (PERIOD / 2));
  let d = `M${from},${y} q${PERIOD / 4},${-amp} ${PERIOD / 2},0`;
  for (let i = 1; i < n; i += 1) d += ` t${PERIOD / 2},0`;
  return d;
}

interface RiverProps {
  /** y of the far shoreline / horizon. */
  top: number;
  bottom?: number;
  topColor: MotionValue<string> | string;
  bottomColor: MotionValue<string> | string;
  waveColor?: string;
  waveOpacity?: number;
  waves?: number;
  /** Sun reflection column. Omit for no reflection. */
  reflectX?: MotionValue<number> | number;
  reflectOpacity?: MotionValue<number>;
  reflectColor?: string;
  seed?: number;
}

/** A flowing river: gradient body, perspective wave lines and a glittering sun-reflection path. */
export function AnimatedRiver({
  top,
  bottom = 900,
  topColor,
  bottomColor,
  waveColor = '#ffe6b0',
  waveOpacity = 0.32,
  waves = 11,
  reflectX,
  reflectOpacity,
  reflectColor = '#ffd98a',
  seed = 21,
}: RiverProps) {
  const id = useId().replace(/:/g, '');
  const height = bottom - top;

  const lines = useMemo(() => {
    const r = mulberry32(seed);
    return Array.from({ length: waves }, (_, i) => {
      const t = (i + 1) / (waves + 1);
      const k = Math.pow(t, 1.7); // perspective: lines spread out toward the viewer
      return {
        y: top + 8 + k * (height - 12),
        amp: 1.5 + k * 9,
        sw: 1 + k * 2.4,
        dur: 20 - k * 11 + r() * 3,
        offset: -r() * 160,
        op: waveOpacity * (0.5 + k * 0.7),
      };
    });
  }, [waves, top, height, seed, waveOpacity]);

  const glints = useMemo(() => {
    const r = mulberry32(seed + 5);
    return Array.from({ length: 26 }, (_, i) => {
      const t = i / 25;
      const k = Math.pow(t, 1.5);
      return {
        y: top + 6 + k * (height - 24),
        w: 26 + k * 150 + r() * 40,
        h: 2 + k * 5,
        dx: (r() - 0.5) * (30 + k * 90),
        dur: 1.6 + r() * 2.4,
        delay: -r() * 3,
      };
    });
  }, [top, height, seed]);

  return (
    <g>
      <defs>
        <linearGradient id={`${id}-w`} gradientUnits="userSpaceOnUse" x1="0" y1={top} x2="0" y2={bottom}>
          <motion.stop offset="0%" style={{ stopColor: topColor }} />
          <motion.stop offset="100%" style={{ stopColor: bottomColor }} />
        </linearGradient>
      </defs>
      <rect x={-1400} y={top} width={4400} height={height + 60} fill={`url(#${id}-w)`} />

      {reflectX !== undefined && (
        <motion.g style={{ x: reflectX, opacity: reflectOpacity }}>
          <ellipse cx={0} cy={top} rx={150} ry={height * 0.95} fill="url(#g-river-glow)" />
          {glints.map((g, i) => (
            <rect
              key={i}
              className="anim-shimmer"
              x={g.dx - g.w / 2}
              y={g.y}
              width={g.w}
              height={g.h}
              rx={g.h / 2}
              fill={reflectColor}
              style={cv({ '--dur': `${g.dur}s`, animationDelay: `${g.delay}s` })}
            />
          ))}
        </motion.g>
      )}

      <g fill="none" stroke={waveColor} strokeLinecap="round">
        {lines.map((l, i) => (
          <g key={i} opacity={l.op}>
            <path
              className="anim-wave"
              d={wavePath(l.y, l.amp)}
              strokeWidth={l.sw}
              style={cv({ '--dur': `${l.dur}s`, animationDelay: `${l.offset / 10}s` })}
            />
          </g>
        ))}
      </g>
    </g>
  );
}

interface VeilProps {
  y: number;
  height: number;
  color: MotionValue<string> | string;
  opacity?: number;
  amp?: number;
  dur?: number;
}

/** A translucent wave-edged band — layered over a row of devotees to make them stand waist-deep in water. */
export function WaterVeil({ y, height, color, opacity = 0.82, amp = 4, dur = 11 }: VeilProps) {
  const d = `${wavePath(y, amp)} L2200,${y + height} L-480,${y + height} Z`;
  return (
    <motion.g opacity={opacity} style={{ fill: color }}>
      <path className="anim-wave" d={d} style={cv({ '--dur': `${dur}s` })} />
    </motion.g>
  );
}

interface RippleProps {
  x: number;
  y: number;
  rx?: number;
  count?: number;
  color?: string;
}

/** Expanding ripple rings around something standing in water. */
export function Ripples({ x, y, rx = 60, count = 3, color = '#fff0c4' }: RippleProps) {
  return (
    <g fill="none" stroke={color} strokeWidth={1.8}>
      {Array.from({ length: count }, (_, i) => (
        <ellipse
          key={i}
          className="anim-ripple"
          cx={x}
          cy={y}
          rx={rx}
          ry={rx * 0.22}
          style={cv({ '--dur': '4.2s', animationDelay: `${(i * 4.2) / count}s` })}
        />
      ))}
    </g>
  );
}
