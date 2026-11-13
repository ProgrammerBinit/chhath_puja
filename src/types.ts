import type { MotionValue } from 'framer-motion';

export type SceneId = 'nahay-khay' | 'kharna' | 'sandhya-arghya' | 'usha-arghya';

export type Mood = 'dawn' | 'dusk' | 'ghat' | 'sunrise';

export interface SceneMeta {
  id: SceneId;
  /** Devanagari numeral e.g. ०१ */
  numberHi: string;
  /** Latin numeral e.g. 01 */
  number: string;
  titleHi: string;
  titleEn: string;
  dayHi: string;
  dayEn: string;
  narrationHi: string;
  subtitleEn: string;
  /** Accessible description of the artwork (screen readers). */
  altHi: string;
  /** Total running time of the chapter in milliseconds. */
  durationMs: number;
  /** Colour shown beneath the artwork on narrow screens. */
  ground: string;
  accent: string;
  mood: Mood;
}

/** Props every scene component receives. `progress` runs 0 → 1 over the chapter. */
export interface SceneProps {
  progress: MotionValue<number>;
  reducedMotion: boolean;
}
