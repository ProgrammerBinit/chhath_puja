import { useMemo } from 'react';
import { cv, mulberry32 } from '../../lib/utils';

interface Props {
  /** Number of flocks crossing the sky. */
  flocks?: number;
  birdsPerFlock?: number;
  y?: number;
  color?: string;
  /** Seconds to cross the screen. */
  speed?: number;
  seed?: number;
  scale?: number;
}

/** Flocks of birds in loose V formation, wings flapping, flying across the sky. */
export function Birds({ flocks = 2, birdsPerFlock = 7, y = 160, color = '#2b1a2e', speed = 24, seed = 11, scale = 1 }: Props) {
  const data = useMemo(() => {
    const r = mulberry32(seed);
    return Array.from({ length: flocks }, (_, f) => ({
      y: y + f * 70 + r() * 40,
      dur: speed * (0.85 + r() * 0.5),
      delay: -(f / flocks) * speed - r() * 6,
      birds: Array.from({ length: birdsPerFlock }, (_, b) => {
        const side = b % 2 === 0 ? 1 : -1;
        const rank = Math.ceil(b / 2);
        return {
          dx: -rank * 34 + (r() - 0.5) * 10,
          dy: side * rank * 15 + (r() - 0.5) * 8,
          s: (0.7 + r() * 0.5) * scale,
          flapDur: 0.45 + r() * 0.3,
          flapDelay: -r(),
        };
      }),
    }));
  }, [flocks, birdsPerFlock, y, speed, seed, scale]);

  return (
    <g fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
      {data.map((f, i) => (
        <g key={i} className="anim-fly" style={cv({ '--dur': `${f.dur}s`, animationDelay: `${f.delay}s` })}>
          <g transform={`translate(0 ${f.y})`}>
            {f.birds.map((b, k) => (
              <g key={k} transform={`translate(${b.dx} ${b.dy}) scale(${b.s})`}>
                <path
                  className="anim-flap"
                  d="M-15,-5 Q-7,-13 0,0 Q7,-13 15,-5"
                  style={cv({ '--dur': `${b.flapDur}s`, animationDelay: `${b.flapDelay}s` })}
                />
              </g>
            ))}
          </g>
        </g>
      ))}
    </g>
  );
}
