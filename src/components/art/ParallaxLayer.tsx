import { createContext, useContext, type ReactNode } from 'react';
import { motion, motionValue, useTransform, type MotionValue } from 'framer-motion';

export interface ParallaxState {
  /** Pointer position, smoothed, in the range -1 … 1. */
  x: MotionValue<number>;
  y: MotionValue<number>;
}

export const ParallaxContext = createContext<ParallaxState | null>(null);

const ZERO = motionValue(0);

interface Props {
  /** How far (in SVG units) this layer drifts at full pointer deflection. Far layers use small values. */
  depth: number;
  children: ReactNode;
}

/** Wraps a group of SVG art and shifts it with the pointer to create depth. */
export function ParallaxLayer({ depth, children }: Props) {
  const ctx = useContext(ParallaxContext);
  const x = useTransform(ctx?.x ?? ZERO, (v) => v * depth);
  const y = useTransform(ctx?.y ?? ZERO, (v) => v * depth * 0.35);
  return <motion.g style={{ x, y }}>{children}</motion.g>;
}
