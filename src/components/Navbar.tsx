import { motion, type MotionValue } from 'framer-motion';
import { Captions, Maximize, Minimize } from 'lucide-react';
import type { SceneMeta } from '../types';
import type { AudioApi } from '../hooks/useAudio';
import { AudioController } from './AudioController';
import { SITE_TITLE } from '../data/chhathScenes';

interface Props {
  scenes: readonly SceneMeta[];
  index: number;
  progress: MotionValue<number>;
  onSelect: (i: number) => void;
  onHome: () => void;
  showEnglish: boolean;
  onToggleEnglish: () => void;
  isFullscreen: boolean;
  fullscreenSupported: boolean;
  onToggleFullscreen: () => void;
  audio: AudioApi;
}

const iconBtn =
  'grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur transition hover:bg-white/15';

/** Top bar: brand, the four-day timeline, subtitles, full-screen and sound. */
export function Navbar({
  scenes,
  index,
  progress,
  onSelect,
  onHome,
  showEnglish,
  onToggleEnglish,
  isFullscreen,
  fullscreenSupported,
  onToggleFullscreen,
  audio,
}: Props) {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30">
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent" />
      <div className="pointer-events-auto relative flex items-center justify-between gap-3 px-3 pt-3 sm:px-6 sm:pt-4">
        <button type="button" onClick={onHome} aria-label={`${SITE_TITLE} — मुख पृष्ठ`} className="flex items-center gap-2 rounded-full pr-2 text-left">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-gold-300 to-saffron-600 shadow-[0_0_18px_rgba(255,160,40,0.6)]">
            <span className="h-4 w-4 rounded-full bg-white/90" />
          </span>
          <span className="hidden font-deva text-xl text-white drop-shadow sm:block">{SITE_TITLE}</span>
        </button>

        <nav aria-label="चार दिनों की समयरेखा" className="flex min-w-0 flex-1 items-start justify-center">
          <ol className="flex w-full max-w-xl items-start">
            {scenes.map((s, i) => {
              const active = i === index;
              const done = i < index;
              return (
                <li key={s.id} className="relative flex min-w-0 flex-1 flex-col items-center">
                  {i > 0 && (
                    <span aria-hidden="true" className="absolute right-1/2 top-[18px] h-[2px] w-full -translate-y-1/2 bg-white/20">
                      <motion.span
                        className="absolute inset-0 origin-left bg-gradient-to-r from-gold-500 to-saffron-500"
                        style={{ scaleX: active ? progress : done ? 1 : 0 }}
                      />
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => onSelect(i)}
                    aria-current={active ? 'step' : undefined}
                    aria-label={`अध्याय ${s.number}: ${s.titleHi} (${s.titleEn})`}
                    className="group relative z-10 flex flex-col items-center gap-1"
                  >
                    <span
                      className={`grid h-9 w-9 place-items-center rounded-full border text-sm font-semibold tabular-nums transition ${
                        active
                          ? 'scale-110 border-gold-300 bg-gold-400 text-midnight-950 shadow-[0_0_20px_rgba(255,190,70,0.85)]'
                          : done
                            ? 'border-gold-500/70 bg-gold-600/40 text-gold-300'
                            : 'border-white/30 bg-black/35 text-white/80 group-hover:bg-white/15'
                      }`}
                    >
                      {s.number}
                    </span>
                    <span className={`hidden max-w-[7.5rem] truncate font-deva text-[0.95rem] leading-none sm:block ${active ? 'text-gold-300' : 'text-white/70'}`}>{s.titleHi}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleEnglish}
            aria-pressed={showEnglish}
            aria-label={showEnglish ? 'अंग्रेज़ी उपशीर्षक बंद करें (Hide English subtitles)' : 'अंग्रेज़ी उपशीर्षक चालू करें (Show English subtitles)'}
            className={`${iconBtn} ${showEnglish ? '!bg-gold-500/30 !text-gold-300' : ''}`}
          >
            <Captions size={19} />
          </button>
          {fullscreenSupported && (
            <button type="button" onClick={onToggleFullscreen} aria-label={isFullscreen ? 'पूर्ण-स्क्रीन से बाहर (Exit full screen)' : 'पूर्ण-स्क्रीन (Full screen)'} className={`${iconBtn} hidden sm:grid`}>
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          )}
          <AudioController audio={audio} />
        </div>
      </div>
    </header>
  );
}
