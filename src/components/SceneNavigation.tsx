import { motion, type MotionValue } from 'framer-motion';
import { ChevronLeft, ChevronRight, ListVideo, Pause, Play, RotateCcw } from 'lucide-react';
import type { SceneMeta } from '../types';

interface Props {
  scene: SceneMeta;
  total: number;
  progress: MotionValue<number>;
  paused: boolean;
  playAll: boolean;
  ended: boolean;
  isFirst: boolean;
  isLast: boolean;
  reducedMotion: boolean;
  onPrev: () => void;
  onNext: () => void;
  onReplay: () => void;
  onTogglePause: () => void;
  onTogglePlayAll: () => void;
}

const base =
  'grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-black/30';

/** Bottom transport bar: previous / pause / replay / next, Play-All mode and the chapter progress line. */
export function SceneNavigation({
  scene,
  total,
  progress,
  paused,
  playAll,
  ended,
  isFirst,
  isLast,
  reducedMotion,
  onPrev,
  onNext,
  onReplay,
  onTogglePause,
  onTogglePlayAll,
}: Props) {
  const nextHint = ended && !isLast && !playAll;
  return (
    <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-30">
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="pointer-events-auto relative mx-auto max-w-3xl px-4 pb-4 sm:pb-5">
        {/* progress line */}
        <div
          role="progressbar"
          aria-label={`अध्याय ${scene.number} की प्रगति`}
          aria-valuemin={0}
          aria-valuemax={100}
          className="relative mb-3 h-1 w-full overflow-hidden rounded-full bg-white/20"
        >
          <motion.div className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-saffron-500 via-gold-400 to-gold-300 shadow-[0_0_12px_#ffb347]" style={{ scaleX: progress }} />
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate font-deva text-base leading-tight text-white sm:text-lg">
              <span className="text-gold-400">{scene.number}/{String(total).padStart(2, '0')}</span> · {scene.titleHi}
            </p>
            <p className="hidden truncate font-body text-xs text-white/60 sm:block">{scene.dayHi} · {scene.dayEn}</p>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" className={base} onClick={onPrev} disabled={isFirst} aria-label="पिछला अध्याय (Previous chapter)">
              <ChevronLeft size={22} />
            </button>
            <button type="button" className={base} onClick={onReplay} aria-label="इस अध्याय को दोबारा देखें (Replay chapter)">
              <RotateCcw size={18} />
            </button>
            <button
              type="button"
              onClick={onTogglePause}
              disabled={reducedMotion}
              aria-label={paused ? 'फिर शुरू करें (Resume)' : 'रोकें (Pause)'}
              className={`${base} !h-14 !w-14 !border-gold-300/70 !bg-gold-500/25 text-gold-300 hover:!bg-gold-500/40`}
            >
              {paused ? <Play size={24} fill="currentColor" /> : <Pause size={24} fill="currentColor" />}
            </button>
            <button
              type="button"
              className={`${base} ${nextHint ? 'animate-pulse !border-gold-300 !bg-gold-500/30 text-gold-300' : ''}`}
              onClick={onNext}
              disabled={isLast}
              aria-label="अगला अध्याय (Next chapter)"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          <div className="flex flex-1 justify-end">
            <button
              type="button"
              onClick={onTogglePlayAll}
              aria-pressed={playAll}
              aria-label={playAll ? 'सभी अध्याय स्वतः चलना बंद करें (Stop Play All)' : 'सभी अध्याय एक साथ चलाएँ (Play All chapters)'}
              className={`flex h-11 items-center gap-2 rounded-full border px-3 font-body text-sm backdrop-blur transition ${
                playAll ? 'border-gold-300 bg-gold-500/30 text-gold-300' : 'border-white/25 bg-black/30 text-white hover:bg-white/15'
              }`}
            >
              <ListVideo size={18} />
              <span className="hidden md:inline">सभी चलाएँ</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
