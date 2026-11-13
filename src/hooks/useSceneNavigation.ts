import { useCallback, useEffect, useRef, useState } from 'react';
import { useMotionValue, type MotionValue } from 'framer-motion';
import type { SceneMeta } from '../types';
import { clamp } from '../lib/utils';

/** With reduced motion we hold each chapter at a calm, finished "poster" frame. */
const POSTER_PROGRESS = 0.94;

export interface SceneNavigation {
  index: number;
  started: boolean;
  paused: boolean;
  playAll: boolean;
  /** Increments whenever the current chapter is restarted (used as a React key). */
  replayKey: number;
  /** True once the current chapter has run to its end. */
  ended: boolean;
  isFirst: boolean;
  isLast: boolean;
  /** Master 0 → 1 clock of the current chapter. A MotionValue: no re-render per frame. */
  progress: MotionValue<number>;
  start: () => void;
  goTo: (i: number) => void;
  next: () => void;
  prev: () => void;
  replay: () => void;
  restartJourney: () => void;
  togglePause: () => void;
  togglePlayAll: () => void;
  exitToIntro: () => void;
}

interface Options {
  initialIndex?: number;
  initialProgress?: number;
  initialStarted?: boolean;
  initialPaused?: boolean;
}

export function useSceneNavigation(
  scenes: readonly SceneMeta[],
  reducedMotion: boolean,
  opts: Options = {},
): SceneNavigation {
  const last = scenes.length - 1;
  const progress = useMotionValue(opts.initialProgress ?? 0);
  const [index, setIndex] = useState(clamp(opts.initialIndex ?? 0, 0, last));
  const [started, setStarted] = useState(opts.initialStarted ?? false);
  const [paused, setPaused] = useState(opts.initialPaused ?? false);
  const [playAll, setPlayAll] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [ended, setEnded] = useState(false);

  const firstRun = useRef(true);
  const indexRef = useRef(index);
  const playAllRef = useRef(playAll);
  indexRef.current = index;
  playAllRef.current = playAll;

  // 1) Reset the clock whenever the chapter (or a replay) changes.
  //    Declared before the ticker so it always runs first.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      if (opts.initialProgress !== undefined) return; // honour deep-link time
    }
    progress.set(reducedMotion ? POSTER_PROGRESS : 0);
    setEnded(reducedMotion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, replayKey, reducedMotion]);

  // 2) The ticker: advances `progress` using requestAnimationFrame.
  useEffect(() => {
    if (!started || paused || reducedMotion) return;
    let raf = 0;
    let prev = performance.now();
    const duration = scenes[index]?.durationMs ?? 30000;

    const tick = (now: number) => {
      const dt = Math.min(now - prev, 100);
      prev = now;
      const p = progress.get();
      if (p < 1) {
        const nextP = Math.min(1, p + dt / duration);
        progress.set(nextP);
        if (nextP >= 1) {
          setEnded(true);
          if (playAllRef.current && indexRef.current < last) {
            setIndex(indexRef.current + 1);
          }
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, paused, reducedMotion, index, replayKey, scenes, progress, last]);

  const goTo = useCallback(
    (i: number) => {
      const target = clamp(i, 0, last);
      setStarted(true);
      setPaused(false);
      setEnded(false);
      if (target === indexRef.current) {
        setReplayKey((k) => k + 1);
      } else {
        setIndex(target);
      }
    },
    [last],
  );

  const start = useCallback(() => {
    setStarted(true);
    setPaused(false);
    setEnded(false);
    if (indexRef.current !== 0) setIndex(0);
    else setReplayKey((k) => k + 1);
  }, []);

  const next = useCallback(() => goTo(indexRef.current + 1), [goTo]);
  const prev = useCallback(() => goTo(indexRef.current - 1), [goTo]);
  const replay = useCallback(() => {
    setPaused(false);
    setEnded(false);
    setReplayKey((k) => k + 1);
  }, []);
  const restartJourney = useCallback(() => {
    setPlayAll(false);
    goTo(0);
  }, [goTo]);
  const togglePause = useCallback(() => setPaused((p) => !p), []);
  const togglePlayAll = useCallback(() => {
    setPlayAll((v) => !v);
    setPaused(false);
  }, []);
  const exitToIntro = useCallback(() => {
    setStarted(false);
    setPlayAll(false);
    setPaused(false);
  }, []);

  return {
    index,
    started,
    paused,
    playAll,
    replayKey,
    ended,
    isFirst: index === 0,
    isLast: index === last,
    progress,
    start,
    goTo,
    next,
    prev,
    replay,
    restartJourney,
    togglePause,
    togglePlayAll,
    exitToIntro,
  };
}
