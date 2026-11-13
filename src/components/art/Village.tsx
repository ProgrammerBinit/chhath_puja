import { useMemo } from 'react';
import { cv, mulberry32 } from '../../lib/utils';
import { Diya } from '../Diyas';

interface At {
  x: number;
  y: number;
  s?: number;
}
const T = ({ x, y, s = 1 }: At) => `translate(${x} ${y}) scale(${s})`;

interface HutProps extends At {
  wall?: string;
  roof?: string;
  /** 0–1: how much of the scene's lighting is tinted onto the hut (used for dusk). */
  dim?: number;
}

/** A Bihari kutcha house: mud walls with Madhubani-style border, terracotta tiled roof. */
export function Hut({ x, y, s = 1, wall = '#b87a4e', roof = '#b5502a', dim = 0 }: HutProps) {
  return (
    <g transform={T({ x, y, s })}>
      <ellipse cy={4} rx={130} ry={9} fill="#000" opacity={0.22} />
      <rect x={-92} y={-102} width={184} height={102} fill={wall} />
      <g fill="#000" opacity={0.08}>
        <ellipse cx={-60} cy={-40} rx={22} ry={12} />
        <ellipse cx={58} cy={-70} rx={28} ry={10} />
        <ellipse cx={20} cy={-20} rx={18} ry={8} />
      </g>
      {/* madhubani-style border */}
      <g stroke="#f3e6c9" strokeWidth={2} fill="none" opacity={0.85}>
        <path d="M-92,-14 L92,-14" />
        <path d="M-92,-6 L-84,-12 L-76,-6 L-68,-12 L-60,-6 L-52,-12 L-44,-6 L-36,-12 L-28,-6 L-20,-12" />
        <path d="M20,-12 L28,-6 L36,-12 L44,-6 L52,-12 L60,-6 L68,-12 L76,-6 L84,-12 L92,-6" />
      </g>
      <g fill="#f3e6c9" opacity={0.85}>
        {[-60, -36, 36, 60].map((cx) => (
          <circle key={cx} cx={cx} cy={-26} r={3.2} />
        ))}
      </g>
      {/* door */}
      <path d="M-20,0 L-20,-60 Q0,-78 20,-60 L20,0 Z" fill="#2b150b" />
      <path d="M-20,-60 Q0,-78 20,-60" stroke="#7a4a2a" strokeWidth={4} fill="none" />
      <circle cx={0} cy={-18} r={30} fill="url(#g-diya-glow)" opacity={0.35} />
      {/* window */}
      <rect x={48} y={-76} width={30} height={26} fill="#1f0f08" stroke="#7a4a2a" strokeWidth={3} />
      <path d="M63,-76 L63,-50 M48,-63 L78,-63" stroke="#7a4a2a" strokeWidth={2} />
      {/* roof */}
      <path d="M-116,-98 L-72,-166 L72,-166 L116,-98 Z" fill={roof} />
      <g stroke="#7e2f14" strokeWidth={1.6} opacity={0.6} fill="none">
        {[-148, -132, -116].map((ry) => (
          <path key={ry} d={`M${-72 + ((ry + 166) * 44) / 68 - 44},${ry} L${72 - ((ry + 166) * 44) / 68 + 44},${ry}`} />
        ))}
        {Array.from({ length: 15 }, (_, i) => (
          <path key={i} d={`M${-62 + i * 9},-166 L${-98 + i * 14},-98`} />
        ))}
      </g>
      <path d="M-120,-96 L120,-96" stroke="#5a2410" strokeWidth={5} strokeLinecap="round" />
      <path d="M-74,-167 L74,-167" stroke="#8a3a1c" strokeWidth={6} strokeLinecap="round" />
      {dim > 0 && <rect x={-120} y={-170} width={240} height={175} fill="#1a1030" opacity={dim} />}
    </g>
  );
}

interface TreeProps extends At {
  color?: string;
  light?: string;
  trunk?: string;
  sway?: boolean;
  seed?: number;
}

/** A broad mango / neem tree. */
export function Tree({ x, y, s = 1, color = '#2f5a2a', light = '#4a7d33', trunk = '#4a2f1a', sway = true, seed = 1 }: TreeProps) {
  const blobs = useMemo(() => {
    const r = mulberry32(seed * 97);
    return Array.from({ length: 9 }, (_, i) => {
      const a = (i / 9) * Math.PI * 2;
      return { cx: Math.cos(a) * (52 + r() * 18), cy: -150 + Math.sin(a) * (30 + r() * 14), r: 34 + r() * 16 };
    });
  }, [seed]);
  return (
    <g transform={T({ x, y, s })}>
      <ellipse cy={3} rx={54} ry={7} fill="#000" opacity={0.2} />
      <path d="M-12,0 Q-8,-50 -6,-100 L-30,-130 L-24,-134 L-3,-112 L0,-140 L6,-140 L8,-108 L30,-134 L36,-128 L10,-96 Q10,-50 14,0 Z" fill={trunk} />
      <g className={sway ? 'anim-sway' : undefined} style={cv({ '--dur': `${5 + (seed % 3)}s` })}>
        <ellipse cx={0} cy={-150} rx={78} ry={46} fill={color} />
        {blobs.map((b, i) => (
          <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill={color} />
        ))}
        {blobs.slice(0, 6).map((b, i) => (
          <circle key={`l${i}`} cx={b.cx + 8} cy={b.cy - 10} r={b.r * 0.62} fill={light} opacity={0.8} />
        ))}
      </g>
    </g>
  );
}

/** A clump of tall bamboo swaying in the breeze. */
export function Bamboo({ x, y, s = 1, color = '#5b7a28' }: At & { color?: string }) {
  const stalks = [
    { d: 'M0,0 Q-10,-130 -26,-290', w: 7 },
    { d: 'M10,0 Q14,-140 36,-300', w: 6.5 },
    { d: 'M-12,0 Q-26,-110 -62,-250', w: 6 },
    { d: 'M20,0 Q40,-120 74,-240', w: 6 },
    { d: 'M4,0 Q2,-150 6,-320', w: 5.5 },
  ];
  return (
    <g transform={T({ x, y, s })} className="anim-sway" style={cv({ '--dur': '6s' })}>
      {stalks.map((st, i) => (
        <g key={i}>
          <path d={st.d} stroke={color} strokeWidth={st.w} fill="none" strokeLinecap="round" />
          <path d={st.d} stroke="#2e4012" strokeWidth={st.w + 1} fill="none" strokeDasharray="1.6 40" />
        </g>
      ))}
      <g fill={color} opacity={0.9}>
        {[
          [-26, -290],
          [36, -300],
          [-62, -250],
          [74, -240],
          [6, -320],
        ].flatMap(([lx, ly], i) =>
          [-1, 0, 1].map((k) => (
            <path key={`${i}-${k}`} transform={`translate(${lx} ${ly}) rotate(${k * 38 + (i % 2) * 12})`} d="M0,0 Q16,-6 38,4 Q16,6 0,0Z" />
          )),
        )}
      </g>
    </g>
  );
}

/** Tulsi plinth with a tiny lamp — the heart of a Bihari courtyard. */
export function TulsiChaura({ x, y, s = 1 }: At) {
  return (
    <g transform={T({ x, y, s })}>
      <ellipse cy={3} rx={34} ry={5} fill="#000" opacity={0.22} />
      <rect x={-26} y={-16} width={52} height={16} fill="#d8c3a0" />
      <rect x={-20} y={-52} width={40} height={36} fill="#e6d6b8" />
      <path d="M-9,-16 L-9,-36 Q0,-46 9,-36 L9,-16 Z" fill="#5a2e1a" />
      <rect x={-24} y={-58} width={48} height={8} fill="#d8c3a0" />
      <g fill="#3f8a3a">
        <ellipse cx={0} cy={-76} rx={13} ry={18} />
        <ellipse cx={-10} cy={-68} rx={9} ry={12} />
        <ellipse cx={10} cy={-68} rx={9} ry={12} />
      </g>
      <g fill="#6bb35a" opacity={0.8}>
        <ellipse cx={-3} cy={-82} rx={5} ry={8} />
        <ellipse cx={6} cy={-74} rx={4} ry={7} />
      </g>
      <Diya x={0} y={-22} s={0.45} delay={0.2} glow={false} />
      <path d="M-26,-4 L26,-4" stroke="#d6211f" strokeWidth={2} opacity={0.7} />
    </g>
  );
}

interface TreelineProps {
  baseY: number;
  color: string;
  seed?: number;
  /** Maximum height of tree bumps above baseY. */
  height?: number;
  from?: number;
  to?: number;
}

/** A silhouetted horizon of rounded tree crowns, palms and little roofs. */
export function Treeline({ baseY, color, seed = 2, height = 90, from = -200, to = 1800 }: TreelineProps) {
  const d = useMemo(() => {
    const r = mulberry32(seed);
    let path = `M${from},${baseY + 60} L${from},${baseY}`;
    let x = from;
    while (x < to) {
      const w = 40 + r() * 90;
      const h = 10 + r() * height;
      const tall = r() < 0.18;
      const hh = tall ? h * 1.5 : h;
      path += ` Q${(x + w * 0.1).toFixed(0)},${(baseY - hh).toFixed(0)} ${(x + w * 0.5).toFixed(0)},${(baseY - hh).toFixed(0)} Q${(x + w * 0.95).toFixed(0)},${(baseY - hh).toFixed(0)} ${(x + w).toFixed(0)},${baseY}`;
      x += w;
    }
    return `${path} L${to},${baseY + 60} Z`;
  }, [baseY, seed, height, from, to]);
  return <path d={d} fill={color} />;
}

/** Tall palm / bamboo silhouettes for the horizon. */
export function Palms({ baseY, color, seed = 4, count = 8, from = -100, to = 1700 }: { baseY: number; color: string; seed?: number; count?: number; from?: number; to?: number }) {
  const items = useMemo(() => {
    const r = mulberry32(seed);
    return Array.from({ length: count }, (_, i) => ({
      x: from + ((i + r() * 0.8) / count) * (to - from),
      h: 120 + r() * 90,
      lean: (r() - 0.5) * 30,
      s: 0.7 + r() * 0.5,
    }));
  }, [seed, count, from, to]);
  return (
    <g fill={color} stroke={color}>
      {items.map((p, i) => (
        <g key={i} transform={`translate(${p.x.toFixed(0)} ${baseY}) scale(${p.s})`}>
          <path d={`M-3,0 Q${p.lean},${-p.h / 2} ${p.lean * 1.4},${-p.h}`} strokeWidth={6} fill="none" />
          <g transform={`translate(${p.lean * 1.4} ${-p.h})`}>
            {[-78, -54, -28, 28, 54, 78].map((dx) => (
              <path key={dx} d={`M0,0 Q${dx * 0.5},-30 ${dx},14 Q${dx * 0.5},-12 0,0Z`} stroke="none" />
            ))}
            <path d="M0,0 Q-6,-26 0,-40 Q6,-26 0,0Z" stroke="none" />
          </g>
        </g>
      ))}
    </g>
  );
}
