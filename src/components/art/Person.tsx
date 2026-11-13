import { useMemo, type ReactNode } from 'react';
import { cv, mixHex, mulberry32, pick, type CssVars } from '../../lib/utils';

export type Pose = 'stand' | 'namaste' | 'raise' | 'soop' | 'reach' | 'pour' | 'bathe';
export type Kind = 'woman' | 'man';

const SHOULDER = '4px -116px';

interface ShapeProps {
  kind: Kind;
  pose: Pose;
  seated?: boolean;
  /** Target of the hands for pose "reach" (local units, feet at 0,0). */
  hand?: readonly [number, number];
  /** CSS class that animates the arms (rotation about the shoulder). */
  armClass?: string;
  armDur?: string;
  /** y (local) where a pouring stream lands. */
  waterY?: number;
  streamColor?: string;
  /** Tool / vessel drawn at the hands; it moves together with the arms. */
  children?: ReactNode;
}

/** Copper lota in hand-local coordinates (the hand is at 0,0, mouth at the top). */
function Lota() {
  return (
    <g>
      <path
        d="M-9,-2 Q-11,12 0,14 Q11,12 9,-2 Q8,-10 4,-12 L4.5,-16 L-4.5,-16 L-4,-12 Q-8,-10 -9,-2Z"
        fill="url(#g-copper)"
      />
      <ellipse cx={0} cy={-16} rx={4.8} ry={1.6} fill="#5b2a10" />
      <path d="M-6,0 Q0,4 6,0" stroke="#ffd9a0" strokeWidth={1} fill="none" opacity={0.7} />
    </g>
  );
}

/** Bamboo soop (winnowing tray) with thekua and a tiny lamp, centred on 0,0. */
export function MiniSoop() {
  return (
    <g>
      <path d="M-18,0 Q0,9 18,0 Q16,-3 0,-3 Q-16,-3 -18,0Z" fill="url(#g-bamboo)" />
      <path d="M-18,0 Q0,9 18,0" fill="none" stroke="#7a5a22" strokeWidth={1.2} />
      <ellipse cx={-8} cy={-4.5} rx={4.6} ry={3} fill="#b5651d" />
      <ellipse cx={0} cy={-5} rx={4.2} ry={2.8} fill="#c4742a" />
      <circle cx={9} cy={-5} r={3.4} fill="#e8a23a" />
      <path d="M3,-7 Q5,-12 3,-15 Q1,-12 3,-7Z" fill="#ffd25a" className="anim-flicker" />
    </g>
  );
}

export function PersonShape({ kind, pose, seated = false, hand, armClass, armDur, waterY = -60, streamColor = '#d8f1ff', children }: ShapeProps) {
  const woman = kind === 'woman';
  const armStyle = cv({ transformOrigin: SHOULDER, '--dur': armDur });

  let arms: ReactNode = null;
  let tool: ReactNode = null;
  switch (pose) {
    case 'stand':
      arms = <path d="M3,-115 L1,-96 L5,-80" />;
      break;
    case 'namaste':
      arms = <path d="M3,-115 L8,-100 L17,-117" />;
      tool = <ellipse cx={18} cy={-119} rx={3.2} ry={5} className="skin" />;
      break;
    case 'raise':
      arms = <path d="M3,-115 L13,-127 L24,-143" />;
      tool = (
        <g transform="translate(27 -146)">
          <Lota />
        </g>
      );
      break;
    case 'soop':
      arms = <path d="M3,-115 L8,-103 L20,-101" />;
      tool = (
        <g transform="translate(26 -101) rotate(-10)">
          <MiniSoop />
        </g>
      );
      break;
    case 'reach': {
      const [hx, hy] = hand ?? [20, -100];
      arms = <path d={`M3,-115 L${(3 + hx) / 2},${(-115 + hy) / 2 + 7} L${hx},${hy}`} />;
      break;
    }
    case 'pour':
      arms = <path d="M3,-115 L10,-102 L22,-114" />;
      tool = (
        <g className="anim-pour" style={cv({ transformOrigin: '22px -114px', '--dur': armDur ?? '6s' })}>
          <g transform="translate(22 -114)">
            <Lota />
          </g>
        </g>
      );
      break;
    case 'bathe':
      arms = <path d="M3,-115 L-2,-137 L4,-157" />;
      tool = (
        <g className="anim-pour" style={cv({ transformOrigin: '4px -157px', '--dur': armDur ?? '6s' })}>
          <g transform="translate(4 -157)">
            <Lota />
          </g>
        </g>
      );
      break;
    default:
      break;
  }

  const body = (
    <>
      {/* back pallu / long drape */}
      {woman && !seated && <path d="M-11,-120 L-19,-92 L-28,-52 L-16,-47 L-8,-92 Z" fill="#000" fillOpacity={0.2} />}
      {woman && seated && <path d="M-11,-120 L-19,-100 L-25,-80 L-14,-77 L-8,-100 Z" fill="#000" fillOpacity={0.2} />}
      {/* torso */}
      {woman ? (
        <>
          <path d="M-12,-120 Q2,-127 12,-120 L14,-86 L-15,-86 Z" className="cloth" />
          <path d="M-10,-119 L12,-90" stroke="#f2c14e" strokeWidth={2.2} fill="none" />
        </>
      ) : (
        <>
          <path d="M-12,-120 Q2,-127 12,-120 L14,-86 L-15,-86 Z" className="skin" />
          <path d="M-10,-119 L12,-97 L7,-92 L-12,-113 Z" className="cloth" />
        </>
      )}
      {/* neck + head */}
      <rect x={-1.5} y={-129} width={6} height={10} className="skin" />
      <ellipse cx={3} cy={-136} rx={8.5} ry={10} className="skin" />
      <path d="M11,-137 L15,-133 L10.5,-132 Z" className="skin" />
      {woman ? (
        <>
          <path d="M-6.5,-138 Q-6.5,-149 3,-148 Q11,-147.5 11.5,-140 Q6,-143.5 0,-142.5 Q-5,-141 -6,-132 Z" className="hair" />
          <circle cx={-7.5} cy={-137} r={5.4} className="hair" />
          <path d="M11,-141 Q6,-148 0,-148" stroke="#d6211f" strokeWidth={2.2} fill="none" strokeLinecap="round" />
        </>
      ) : (
        <path d="M-6.5,-139 Q-6,-148.5 3,-148 Q11,-147 11,-140 Q6,-143 -1,-142 Q-5.5,-141 -6,-135 Z" className="hair" />
      )}
      {/* rim light along shoulder and head */}
      <path d="M-11,-120 Q2,-127 12,-119" fill="none" className="rim" strokeWidth={2} />
      <path d="M-5,-143 Q3,-151 11.5,-141" fill="none" className="rim" strokeWidth={2} />
    </>
  );

  const lower = seated ? (
    <>
      <path d="M-36,0 Q-30,-17 -4,-21 Q24,-19 36,0 Z" className="cloth" />
      <path d="M-36,-3 Q0,-12 36,-3" stroke="#f2c14e" strokeWidth={2.5} fill="none" opacity={0.9} />
    </>
  ) : woman ? (
    <>
      <path d="M-15,-86 L13,-86 L21,0 L-23,0 Z" className="cloth" />
      <path d="M-22.5,-5 L20.5,-5" stroke="#f2c14e" strokeWidth={3} fill="none" opacity={0.9} />
    </>
  ) : (
    <>
      <path d="M-14,-86 L13,-86 L17,0 L-18,0 Z" fill="#efe4cc" />
      <path d="M-2,-86 Q0,-40 -6,0" stroke="#c9bb9a" strokeWidth={1.3} fill="none" />
    </>
  );

  return (
    <g>
      {lower}
      <g transform={seated ? 'translate(0 66)' : undefined}>
        {body}
        <g className={armClass} style={armStyle}>
          <g className="skin-stroke" fill="none" strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round">
            {arms}
          </g>
          {tool}
          {children}
        </g>
        {pose === 'pour' && (
          <path className="anim-stream" d={`M33.5,-124 Q40,-112 41,${waterY}`} stroke={streamColor} strokeWidth={3.2} fill="none" strokeLinecap="round" style={cv({ '--dur': armDur ?? '6s' })} />
        )}
        {pose === 'bathe' && (
          <path className="anim-stream" d="M16,-167 Q15,-158 12,-146" stroke={streamColor} strokeWidth={3} fill="none" strokeLinecap="round" style={cv({ '--dur': armDur ?? '6s' })} />
        )}
      </g>
    </g>
  );
}

export interface PersonProps extends Omit<ShapeProps, 'kind' | 'pose'> {
  x: number;
  y: number;
  s?: number;
  /** Face left instead of right. */
  flip?: boolean;
  kind?: Kind;
  pose?: Pose;
  /** Saree / gamcha colour. */
  color?: string;
  skin?: string;
  hair?: string;
  rim?: string;
  opacity?: number;
}

/** A single figure in profile, feet at (x, y), facing right (or left when flipped). */
export function Person({
  x,
  y,
  s = 1,
  flip = false,
  kind = 'woman',
  pose = 'stand',
  color = '#f08a24',
  skin = '#7a4a2e',
  hair = '#140b08',
  rim,
  opacity,
  ...shape
}: PersonProps) {
  const vars: CssVars = { color, '--skin': skin, '--hair': hair, '--rim': rim };
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} style={cv(vars)} opacity={opacity}>
      <PersonShape kind={kind} pose={pose} {...shape} />
    </g>
  );
}

/* ---------------- Crowd ---------------- */

const CROWD_POSES: readonly Pose[] = ['namaste', 'namaste', 'raise', 'raise', 'soop'];
const SAREES = ['#f08a24', '#d6371f', '#f2b705', '#c0267a', '#e2582b', '#ff9f1c', '#f2b705', '#d6371f', '#2e8b57', '#a8325e'];

/** Symbols that crowd rows <use>. Rendered once in SharedDefs. */
export function PersonDefs() {
  const kinds: Kind[] = ['woman', 'man'];
  const poses: Pose[] = ['namaste', 'raise', 'soop'];
  return (
    <>
      {kinds.flatMap((k) =>
        poses.map((p) => (
          <g key={`${k}-${p}`} id={`pp-${k}-${p}`}>
            <PersonShape kind={k} pose={p} />
          </g>
        )),
      )}
    </>
  );
}

interface RowProps {
  y: number;
  scale: number;
  count: number;
  xMin: number;
  xMax: number;
  /** x of the sun: everyone faces towards it. */
  sunX: number;
  /** 0 = natural colours, 1 = pure silhouette tone. */
  dark?: number;
  tone?: string;
  rim?: string;
  seed?: number;
  /** Leave a gap (no people) in this x range, e.g. for hero figures. */
  gap?: readonly [number, number];
}

/** One row of devotees standing in the river, drawn with <use> for speed. */
export function CrowdRow({ y, scale, count, xMin, xMax, sunX, dark = 0, tone = '#2a0f1c', rim, seed = 1, gap }: RowProps) {
  const groups = useMemo(() => {
    const r = mulberry32(seed);
    const out: Array<Array<{ x: number; y: number; s: number; id: string; flip: boolean; style: ReturnType<typeof cv> }>> = [[], [], []];
    const span = xMax - xMin;
    for (let i = 0; i < count; i += 1) {
      const x = xMin + ((i + 0.2 + r() * 0.6) / count) * span;
      if (gap && x > gap[0] && x < gap[1]) continue;
      const kind: Kind = r() < 0.16 ? 'man' : 'woman';
      const pose = pick(r, CROWD_POSES);
      const col = pick(r, SAREES);
      const vars: CssVars = {
        color: mixHex(col, tone, dark),
        '--skin': mixHex('#7a4a2e', tone, dark),
        '--hair': mixHex('#140b08', tone, dark * 0.6),
        '--rim': rim,
      };
      out[i % 3]?.push({
        x,
        y: y + (r() - 0.5) * 8,
        s: scale * (0.9 + r() * 0.22),
        id: `pp-${kind}-${pose}`,
        flip: x > sunX,
        style: cv(vars),
      });
    }
    return out;
  }, [y, scale, count, xMin, xMax, sunX, dark, tone, rim, seed, gap]);

  return (
    <g>
      {groups.map((g, gi) => (
        <g key={gi} className="anim-bob" style={cv({ '--dur': `${2.6 + gi * 0.55}s`, '--amp': `${2.2 * scale + 1}px`, animationDelay: `${-gi * 0.9}s` })}>
          {g.map((p, i) => (
            <use key={i} href={`#${p.id}`} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) scale(${p.flip ? -p.s : p.s} ${p.s})`} style={p.style} />
          ))}
        </g>
      ))}
    </g>
  );
}
