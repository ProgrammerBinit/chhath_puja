import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { chhathScenes } from './data/chhathScenes';
import { useSceneNavigation } from './hooks/useSceneNavigation';
import { useAudio } from './hooks/useAudio';
import { useFullscreen } from './hooks/useFullscreen';
import { SceneRenderer } from './components/SceneRenderer';
import { Navbar } from './components/Navbar';
import { SceneNavigation } from './components/SceneNavigation';
import { HindiNarration } from './components/HindiNarration';
import { ChapterTitle } from './components/ChapterTitle';
import { Intro } from './components/Intro';
import { Finale } from './components/Finale';

const FINALE_AT = 0.86;
const LAST = chhathScenes.length - 1;

/** Optional deep links, handy for sharing and testing: ?c=3 (chapter) &t=0.5 (time 0–1) &p=1 (paused) &en=1 (subtitles). */
function readDeepLink() {
  const q = new URLSearchParams(window.location.search);
  const c = Number(q.get('c'));
  const t = Number(q.get('t'));
  const hasChapter = Number.isFinite(c) && c >= 1 && c <= chhathScenes.length;
  return {
    initialIndex: hasChapter ? c - 1 : 0,
    initialStarted: hasChapter,
    initialProgress: q.has('t') && Number.isFinite(t) ? Math.min(1, Math.max(0, t)) : undefined,
    initialPaused: q.get('p') === '1',
    english: q.get('en') === '1',
  };
}

export default function App() {
  const reducedMotion = useReducedMotion() ?? false;
  const deep = useMemo(readDeepLink, []);
  const nav = useSceneNavigation(chhathScenes, reducedMotion, deep);
  const audio = useAudio();
  const fullscreen = useFullscreen();
  const [showEnglish, setShowEnglish] = useState(deep.english);
  const [finaleReady, setFinaleReady] = useState(() => nav.progress.get() >= FINALE_AT);
  const [finaleDismissed, setFinaleDismissed] = useState(false);

  const scene = chhathScenes[nav.index] ?? chhathScenes[0]!;
  const { voiceOn, speak, cancelSpeech, pauseSpeech, resumeSpeech, setMood, chime, toggleMute } = audio;

  useMotionValueEvent(nav.progress, 'change', (v) => setFinaleReady(v >= FINALE_AT));
  useEffect(() => setFinaleDismissed(false), [nav.index, nav.replayKey]);

  const showFinale = nav.started && nav.index === LAST && finaleReady && !finaleDismissed;

  // chapter mood + temple bell whenever a chapter begins
  useEffect(() => {
    if (!nav.started) return;
    setMood(scene.mood);
    chime();
  }, [nav.started, nav.index, nav.replayKey, scene.mood, setMood, chime]);

  // Hindi voice narration, timed with the on-screen reveal
  useEffect(() => {
    if (!nav.started || !voiceOn) {
      cancelSpeech();
      return;
    }
    const t = window.setTimeout(() => speak(scene.narrationHi), scene.durationMs * 0.09);
    return () => {
      window.clearTimeout(t);
      cancelSpeech();
    };
  }, [nav.started, nav.index, nav.replayKey, voiceOn, scene, speak, cancelSpeech]);

  useEffect(() => {
    if (nav.paused) pauseSpeech();
    else resumeSpeech();
  }, [nav.paused, pauseSpeech, resumeSpeech]);

  // keyboard: ← → chapters, Space pause, F full-screen, M mute, R replay
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement | null)?.tagName ?? '';
      const interactive = tag === 'BUTTON' || tag === 'INPUT' || tag === 'A';
      switch (e.key) {
        case 'ArrowRight':
          if (nav.started) nav.next();
          break;
        case 'ArrowLeft':
          if (nav.started) nav.prev();
          break;
        case ' ':
          if (nav.started && !interactive) {
            e.preventDefault();
            nav.togglePause();
          }
          break;
        case 'f':
        case 'F':
          fullscreen.toggle();
          break;
        case 'm':
        case 'M':
          toggleMute();
          break;
        case 'r':
        case 'R':
          if (nav.started) nav.replay();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nav, fullscreen, toggleMute]);

  return (
    <div className={`relative h-full w-full overflow-hidden bg-midnight-950 text-white ${nav.paused ? 'is-paused' : ''}`}>
      <main className="absolute inset-0">
        <SceneRenderer scene={scene} replayKey={nav.replayKey} progress={nav.progress} reducedMotion={reducedMotion} paused={nav.paused} />
        {nav.started && <ChapterTitle key={`${scene.id}-${nav.replayKey}`} scene={scene} progress={nav.progress} />}

        <div className="pointer-events-none absolute inset-x-0 bottom-[7.2rem] z-10 sm:bottom-32">
          {nav.started && <HindiNarration scene={scene} progress={nav.progress} showEnglish={showEnglish} hidden={showFinale} persist={reducedMotion} />}
        </div>

        <AnimatePresence>{showFinale && <Finale key="finale" reducedMotion={reducedMotion} onRestart={nav.restartJourney} onDismiss={() => setFinaleDismissed(true)} />}</AnimatePresence>
        <AnimatePresence>{!nav.started && <Intro key="intro" onStart={nav.start} reducedMotion={reducedMotion} />}</AnimatePresence>
      </main>

      <Navbar
        scenes={chhathScenes}
        index={nav.index}
        progress={nav.progress}
        onSelect={nav.goTo}
        onHome={nav.exitToIntro}
        showEnglish={showEnglish}
        onToggleEnglish={() => setShowEnglish((v) => !v)}
        isFullscreen={fullscreen.isFullscreen}
        fullscreenSupported={fullscreen.supported}
        onToggleFullscreen={fullscreen.toggle}
        audio={audio}
      />

      {nav.started && (
        <SceneNavigation
          scene={scene}
          total={chhathScenes.length}
          progress={nav.progress}
          paused={nav.paused}
          playAll={nav.playAll}
          ended={nav.ended}
          isFirst={nav.isFirst}
          isLast={nav.isLast}
          reducedMotion={reducedMotion}
          onPrev={nav.prev}
          onNext={nav.next}
          onReplay={nav.replay}
          onTogglePause={nav.togglePause}
          onTogglePlayAll={nav.togglePlayAll}
        />
      )}
    </div>
  );
}
