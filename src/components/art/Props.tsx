import { useMemo, type ReactNode } from 'react';
import { motion, type MotionValue } from 'framer-motion';
import { cv, mulberry32 } from '../../lib/utils';
import { Diya } from '../Diyas';

interface At {
  x: number;
  y: number;
  s?: number;
}

const T = ({ x, y, s = 1 }: At) => `translate(${x} ${y}) scale(${s})`;

/* ---------- small offerings ---------- */

export function Thekua({ x, y, s = 1 }: At) {
  return (
    <g transform={T({ x, y, s })}>
      <ellipse rx={14} ry={8.5} fill="#a85a18" />
      <ellipse cy={-1.5} rx={13} ry={7} fill="#c97a2c" />
      <path d="M-8,-1 L8,-1 M-5,-4 L5,2 M5,-4 L-5,2" stroke="#7a3d0e" strokeWidth={1.3} strokeLinecap="round" fill="none" />
      <ellipse cx={-4} cy={-4.5} rx={4.5} ry={1.6} fill="#f0b25a" opacity={0.6} />
    </g>
  );
}

export function Coconut({ x, y, s = 1 }: At) {
  return (
    <g transform={T({ x, y, s })}>
      <circle r={10} fill="#6b4423" />
      <circle cx={-3} cy={-3} r={5} fill="#8a5a30" opacity={0.7} />
      <circle cx={-3} cy={-2} r={1.2} fill="#2a160a" />
      <circle cx={3} cy={-2} r={1.2} fill="#2a160a" />
      <circle cy={3} r={1.2} fill="#2a160a" />
      <path d="M-3,-9 Q0,-16 3,-9 Q0,-12 -3,-9Z" fill="#c9a26a" />
    </g>
  );
}

export function Banana({ x, y, s = 1 }: At) {
  return (
    <g transform={T({ x, y, s })} fill="#f4cf3a" stroke="#a87a10" strokeWidth={1}>
      {[0, 11, 22].map((rot) => (
        <path key={rot} transform={`rotate(${rot - 14})`} d="M0,0 Q16,-6 22,-24 Q9,-11 -3,-8 Z" />
      ))}
      <path d="M-4,-3 L1,2" stroke="#4a3a10" strokeWidth={2.4} />
    </g>
  );
}

export function Fruit({ x, y, s = 1, color = '#e2392b' }: At & { color?: string }) {
  return (
    <g transform={T({ x, y, s })}>
      <circle r={8.5} fill={color} />
      <circle cx={-3} cy={-3} r={3} fill="#fff" opacity={0.25} />
      <path d="M0,-8 Q2,-13 6,-13 Q4,-9 0,-8Z" fill="#4c8a2a" />
    </g>
  );
}

export function Sugarcane({ x, y, h = 260, tilt = 0, s = 1 }: At & { h?: number; tilt?: number }) {
  const nodes = Math.floor(h / 38);
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${s})`}>
      <rect x={-5.5} y={-h} width={11} height={h} rx={3} fill="url(#g-cane)" />
      {Array.from({ length: nodes }, (_, i) => (
        <g key={i}>
          <rect x={-6.4} y={-(i + 1) * 38} width={12.8} height={3.2} rx={1.4} fill="#4b6320" />
          <path d={`M-4,${-(i + 1) * 38 + 14} L4,${-(i + 1) * 38 + 14}`} stroke="#7a9a30" strokeWidth={1} opacity={0.6} />
        </g>
      ))}
      <g fill="#6f9a2a" opacity={0.95}>
        <path d={`M0,${-h} Q-26,${-h - 18} -42,${-h + 6} Q-20,${-h - 6} 0,${-h + 4}Z`} />
        <path d={`M0,${-h} Q22,${-h - 26} 40,${-h - 6} Q18,${-h - 8} 0,${-h + 4}Z`} />
        <path d={`M0,${-h} Q-6,${-h - 34} 8,${-h - 44} Q6,${-h - 20} 2,${-h + 4}Z`} />
      </g>
    </g>
  );
}

/* ---------- baskets & vessels ---------- */

/** The bamboo soop heaped with prasad — front view. */
export function BigSoop({ x, y, s = 1, lamp = true }: At & { lamp?: boolean }) {
  return (
    <g transform={T({ x, y, s })}>
      <ellipse cy={6} rx={72} ry={10} fill="#000" opacity={0.22} />
      <ellipse rx={68} ry={18} fill="url(#g-bamboo)" stroke="#7a5a22" strokeWidth={2} />
      <ellipse cy={-2} rx={58} ry={12} fill="#c79a4a" opacity={0.85} />
      <path d="M-56,-2 Q0,14 56,-2" stroke="#8a6420" strokeWidth={1.5} fill="none" opacity={0.7} />
      <path d="M-40,2 L-30,12 M-20,4 L-12,14 M2,4 L6,15 M24,4 L26,14 M42,1 L40,11" stroke="#8a6420" strokeWidth={1.2} opacity={0.6} />
      <Thekua x={-34} y={-8} />
      <Thekua x={-18} y={-12} s={0.95} />
      <Thekua x={-27} y={-17} s={0.9} />
      <Coconut x={34} y={-12} />
      <Banana x={12} y={-8} />
      <Fruit x={48} y={-5} s={0.9} color="#ff9f1c" />
      <Fruit x={-50} y={-2} s={0.85} color="#e2392b" />
      {lamp && <Diya x={0} y={-12} s={0.8} delay={0.4} glow={false} />}
    </g>
  );
}

/** Deeper woven daura basket with fruits and sugarcane pieces. */
export function Daura({ x, y, s = 1 }: At) {
  return (
    <g transform={T({ x, y, s })}>
      <ellipse cy={4} rx={52} ry={8} fill="#000" opacity={0.22} />
      <path d="M-46,-64 L46,-64 L36,0 L-36,0 Z" fill="url(#g-bamboo)" stroke="#7a5a22" strokeWidth={2} />
      <g stroke="#8a6420" strokeWidth={1.4} opacity={0.65}>
        {[-30, -16, -2, 12, 26].map((px) => (
          <path key={px} d={`M${px},-62 L${px * 0.8},-2`} />
        ))}
        {[-48, -32, -16].map((py) => (
          <path key={py} d={`M-44,${py} L44,${py}`} />
        ))}
      </g>
      <ellipse cy={-64} rx={46} ry={9} fill="#c79a4a" stroke="#7a5a22" strokeWidth={2} />
      <Coconut x={-22} y={-74} s={0.9} />
      <Fruit x={0} y={-72} s={1} color="#e2392b" />
      <Fruit x={20} y={-72} s={0.95} color="#ff9f1c" />
      <Banana x={-4} y={-68} s={0.8} />
      <Thekua x={30} y={-70} s={0.8} />
    </g>
  );
}

/** Copper kalash with mango leaves and a coconut. */
export function Kalash({ x, y, s = 1 }: At) {
  return (
    <g transform={T({ x, y, s })}>
      <path d="M-19,-30 Q-27,-6 -11,0 L11,0 Q27,-6 19,-30 Q14,-36 8,-38 L8,-44 L-8,-44 L-8,-38 Q-14,-36 -19,-30Z" fill="url(#g-copper)" />
      <path d="M-22,-24 Q0,-18 22,-24" stroke="#ffd9a0" strokeWidth={1.4} fill="none" opacity={0.75} />
      <g fill="#4c8a2a">
        <path d="M0,-44 Q-22,-56 -26,-70 Q-8,-62 0,-44Z" />
        <path d="M0,-44 Q22,-56 26,-70 Q8,-62 0,-44Z" />
        <path d="M0,-44 Q-8,-62 -2,-78 Q6,-62 0,-44Z" />
      </g>
      <ellipse cy={-50} rx={11} ry={13} fill="#7a4a22" />
      <path d="M-9,-58 Q0,-48 9,-58" stroke="#d6211f" strokeWidth={3} fill="none" />
    </g>
  );
}

export function Matka({ x, y, s = 1 }: At) {
  return (
    <g transform={T({ x, y, s })}>
      <ellipse cy={3} rx={26} ry={5} fill="#000" opacity={0.25} />
      <path d="M-20,-36 Q-36,-14 -16,0 L16,0 Q36,-14 20,-36 Q22,-42 12,-44 L-12,-44 Q-22,-42 -20,-36Z" fill="url(#g-clay)" />
      <path d="M-28,-22 Q0,-14 28,-22" stroke="#f3dfc0" strokeWidth={2} fill="none" opacity={0.7} strokeDasharray="4 4" />
      <ellipse cy={-44} rx={12} ry={3} fill="#4a2010" />
    </g>
  );
}

export type PotContent = 'kheer' | 'dal' | 'rice' | 'empty';
const CONTENT: Record<PotContent, string> = { kheer: '#d9a45a', dal: '#d99a2b', rice: '#f6efe0', empty: '#1a0a05' };

/** A blackened cooking handi, open at the top so we can see bubbling contents. */
export function Handi({ x, y, s = 1, content = 'dal', bubbles = true, steam = true }: At & { content?: PotContent; bubbles?: boolean; steam?: boolean }) {
  return (
    <g transform={T({ x, y, s })}>
      <path d="M-32,-42 Q-42,-12 -24,0 L24,0 Q42,-12 32,-42 Z" fill="#4a2a1c" />
      <path d="M-30,-30 Q-34,-14 -22,-4" stroke="#8a5a3c" strokeWidth={3} fill="none" opacity={0.5} />
      <ellipse cy={-42} rx={33} ry={9} fill="#2a140c" />
      <ellipse cy={-42} rx={28} ry={6.5} fill={CONTENT[content]} />
      {bubbles &&
        [-14, -3, 9, 16].map((bx, i) => (
          <circle key={i} className="anim-bubble" cx={bx} cy={-42 + (i % 2) * 2} r={3.2} fill="#fff6d8" opacity={0.8} style={cv({ '--dur': `${1.4 + i * 0.35}s`, animationDelay: `${-i * 0.4}s` })} />
        ))}
      {steam &&
        [-10, 4, 14].map((sx, i) => (
          <ellipse key={i} className="anim-steam" cx={sx} cy={-48} rx={8} ry={5} fill="#fff" opacity={0.5} style={cv({ '--dur': `${3.4 + i * 0.7}s`, '--dx': `${(i - 1) * 9}px`, animationDelay: `${-i * 1.1}s` })} />
        ))}
    </g>
  );
}

export function Thali({ x, y, s = 1, children }: At & { children?: ReactNode }) {
  return (
    <g transform={T({ x, y, s })}>
      <ellipse cy={3} rx={44} ry={8} fill="#000" opacity={0.22} />
      <ellipse rx={42} ry={9} fill="url(#g-brass)" />
      <ellipse cy={-1} rx={34} ry={6} fill="#b88a1c" opacity={0.75} />
      {children}
    </g>
  );
}

/** Traditional mud stove with firewood and a living fire. */
export function Chulha({ x, y, s = 1, fire }: At & { fire?: MotionValue<number> }) {
  return (
    <g transform={T({ x, y, s })}>
      <ellipse cy={4} rx={92} ry={9} fill="#000" opacity={0.25} />
      <path d="M-76,0 Q-80,-44 -56,-64 L56,-64 Q80,-44 76,0 Z" fill="#a8623a" />
      <path d="M-70,-10 Q-72,-40 -52,-58 L-30,-60" stroke="#c98456" strokeWidth={5} fill="none" opacity={0.6} strokeLinecap="round" />
      <path d="M-76,0 Q-80,-44 -56,-64" stroke="#6b3a22" strokeWidth={4} fill="none" opacity={0.5} />
      {/* three pot-rests */}
      <rect x={-46} y={-76} width={14} height={14} rx={4} fill="#8a4a2a" />
      <rect x={-7} y={-80} width={14} height={18} rx={4} fill="#8a4a2a" />
      <rect x={32} y={-76} width={14} height={14} rx={4} fill="#8a4a2a" />
      {/* firebox */}
      <path d="M-30,0 Q-30,-42 0,-46 Q30,-42 30,0 Z" fill="#140805" />
      <motion.g style={fire ? { opacity: fire } : undefined}>
        <ellipse cy={-18} rx={42} ry={32} fill="url(#g-diya-glow)" className="anim-glow" style={cv({ '--dur': '0.9s' })} />
        <g className="anim-flicker" style={cv({ '--dur': '0.7s' })}>
          <path d="M-14,-4 Q-22,-22 -6,-40 Q-4,-26 4,-30 Q-2,-18 -14,-4Z" fill="url(#g-flame)" />
        </g>
        <g className="anim-flicker" style={cv({ '--dur': '0.85s', animationDelay: '-0.3s' })}>
          <path d="M4,-4 Q-4,-24 12,-42 Q18,-28 20,-18 Q14,-8 4,-4Z" fill="url(#g-flame)" />
        </g>
        <g className="anim-flicker" style={cv({ '--dur': '0.6s', animationDelay: '-0.5s' })}>
          <path d="M-4,-3 Q-8,-14 0,-26 Q8,-14 4,-3Z" fill="#fff1a8" opacity={0.9} />
        </g>
      </motion.g>
      {/* firewood */}
      <g stroke="#3a1d0e" strokeWidth={8} strokeLinecap="round">
        <path d="M-26,-2 L18,-12" />
        <path d="M-18,-12 L26,-2" />
      </g>
      <g stroke="#ff7a18" strokeWidth={3} strokeLinecap="round" opacity={0.85} className="anim-glow" style={cv({ '--dur': '1.2s' })}>
        <path d="M14,-11 L20,-12" />
        <path d="M-20,-12 L-14,-11" />
      </g>
      {/* stacked firewood beside */}
      <g stroke="#5a3418" strokeWidth={7} strokeLinecap="round">
        <path d="M-120,-4 L-84,-4" />
        <path d="M-118,-12 L-86,-12" />
        <path d="M-114,-20 L-90,-20" />
      </g>
      <g fill="#c98456">
        <circle cx={-120} cy={-4} r={3.4} />
        <circle cx={-118} cy={-12} r={3.4} />
        <circle cx={-114} cy={-20} r={3.4} />
      </g>
    </g>
  );
}

/** Chimney-less smoke plume rising from a point. */
export function Smoke({ x, y, count = 5, color = '#d8cfc4' }: { x: number; y: number; count?: number; color?: string }) {
  const items = useMemo(() => {
    const r = mulberry32(x + y);
    return Array.from({ length: count }, (_, i) => ({ dx: (r() - 0.3) * 40, dur: 4 + r() * 2.5, delay: -(i / count) * 6, rx: 12 + r() * 10 }));
  }, [x, y, count]);
  return (
    <g fill={color}>
      {items.map((p, i) => (
        <ellipse key={i} className="anim-smoke" cx={x} cy={y} rx={p.rx} ry={p.rx * 0.7} style={cv({ '--dur': `${p.dur}s`, '--dx': `${p.dx}px`, animationDelay: `${p.delay}s` })} />
      ))}
    </g>
  );
}

export function Broom({ x, y, s = 1 }: At) {
  return (
    <g transform={T({ x, y, s })}>
      <line x1={0} y1={0} x2={24} y2={92} stroke="#7a5a22" strokeWidth={3.5} strokeLinecap="round" />
      <path d="M20,84 L38,84 L48,106 L12,106 Z" fill="#c9a64a" stroke="#8a6a22" strokeWidth={1} />
      <path d="M20,90 L16,106 M26,90 L26,106 M32,90 L36,106" stroke="#8a6a22" strokeWidth={1} />
    </g>
  );
}

export function Lauki({ x, y, s = 1, rot = 0 }: At & { rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M-5,-22 Q-6,-10 -14,0 Q-16,16 0,18 Q16,16 14,0 Q6,-10 5,-22 Q0,-26 -5,-22Z" fill="#b9d37a" />
      <path d="M-8,0 Q-9,10 -3,14" stroke="#e6f1b4" strokeWidth={2} fill="none" opacity={0.7} />
      <path d="M0,-22 L2,-30" stroke="#6b8a2f" strokeWidth={2.5} />
    </g>
  );
}

export function Plate({ x, y, s = 1, children }: At & { children?: ReactNode }) {
  return (
    <g transform={T({ x, y, s })}>
      <ellipse cy={2} rx={22} ry={5} fill="#000" opacity={0.2} />
      <ellipse rx={20} ry={4.5} fill="url(#g-brass)" />
      {children}
    </g>
  );
}

/** Marigold garland / flower cluster. */
export function Marigold({ x, y, s = 1 }: At) {
  return (
    <g transform={T({ x, y, s })}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} transform={`rotate(${a})`} cy={-6} rx={4.2} ry={7} fill="#ff9f1c" />
      ))}
      <circle r={4} fill="#ffcf3a" />
    </g>
  );
}
