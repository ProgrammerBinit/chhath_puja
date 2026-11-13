import type { ReactNode } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';

interface Props {
  progress: MotionValue<number>;
  /** Chapter progress at which the element starts to appear. */
  at: number;
  /** Length of the fade/slide, in progress units. */
  span?: number;
  dx?: number;
  dy?: number;
  /** Optional: fade out again between these two progress values. */
  out?: readonly [number, number];
  children: ReactNode;
}

/** Fades and slides a group of SVG art into view on the chapter clock. */
export function Reveal({ progress, at, span = 0.08, dx = 0, dy = 0, out, children }: Props) {
  const inRange = [at, at + span];
  const opacity = useTransform(
    progress,
    out ? [...inRange, out[0], out[1]] : inRange,
    out ? [0, 1, 1, 0] : [0, 1],
  );
  const x = useTransform(progress, inRange, [dx, 0]);
  const y = useTransform(progress, inRange, [dy, 0]);
  return <motion.g style={{ opacity, x, y }}>{children}</motion.g>;
}
