import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Eye } from 'lucide-react';
import { FINALE } from '../data/chhathScenes';
import { cv, mulberry32 } from '../lib/utils';

interface Props {
  reducedMotion: boolean;
  onRestart: () => void;
  onDismiss: () => void;
}

/** The closing tribute at the end of Usha Arghya. */
export function Finale({ reducedMotion, onRestart, onDismiss }: Props) {
  const petals = useMemo(() => {
    const r = mulberry32(77);
    return Array.from({ length: 22 }, () => ({
      left: r() * 100,
      size: 10 + r() * 12,
      dur: 9 + r() * 7,
      delay: -r() * 14,
      dx: (r() - 0.5) * 160,
      rot: 180 + r() * 360,
      hue: r() < 0.7 ? '#ff9f1c' : '#ffcf3a',
    }));
  }, []);

  const rise = (d: number) =>
    reducedMotion ? {} : { initial: { opacity: 0, y: 26, filter: 'blur(8px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, transition: { duration: 1.3, delay: d, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <motion.section
      aria-label="समापन — जय छठी मैया"
      className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
      style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(20,10,40,0.62), rgba(8,6,24,0.88) 80%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reducedMotion ? 0.2 : 1.6 }}
    >
      {!reducedMotion && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {petals.map((p, i) => (
            <svg
              key={i}
              className="anim-petal absolute -top-6"
              width={p.size}
              height={p.size * 1.4}
              viewBox="0 0 10 14"
              style={cv({ left: `${p.left}%`, '--dur': `${p.dur}s`, '--dx': `${p.dx}px`, '--rot': `${p.rot}deg`, animationDelay: `${p.delay}s` })}
            >
              <ellipse cx="5" cy="7" rx="4" ry="6.5" fill={p.hue} />
            </svg>
          ))}
        </div>
      )}

      <motion.div {...rise(0.2)} className="relative">
        <div aria-hidden="true" className="absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,190,80,0.45),transparent_68%)] sm:h-[28rem] sm:w-[28rem]" />
        <h2 lang="hi" className="font-deva text-4xl leading-[1.35] text-gold-300 sm:text-6xl md:text-7xl" style={{ textShadow: '0 0 40px rgba(255,160,40,0.7), 0 4px 16px rgba(0,0,0,0.6)' }}>
          {FINALE.jai[0]}
          <br />
          {FINALE.jai[1]}
        </h2>
      </motion.div>

      <motion.p {...rise(1.1)} lang="hi" className="mt-7 max-w-2xl font-deva text-xl leading-relaxed text-white sm:text-2xl md:text-3xl" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.8)' }}>
        {FINALE.blessing}
      </motion.p>
      <motion.p {...rise(1.9)} lang="hi" className="mt-4 font-deva text-lg text-saffron-400 sm:text-2xl">
        {FINALE.wish}
      </motion.p>

      <motion.div {...rise(2.8)} className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="flex items-center gap-2 rounded-full border border-gold-300/70 bg-gold-500/25 px-5 py-2.5 font-body text-base text-gold-300 backdrop-blur transition hover:bg-gold-500/40"
        >
          <RotateCcw size={18} /> पूरी यात्रा फिर से देखें
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="flex items-center gap-2 rounded-full border border-white/30 bg-black/30 px-5 py-2.5 font-body text-base text-white backdrop-blur transition hover:bg-white/15"
        >
          <Eye size={18} /> दृश्य देखें
        </button>
      </motion.div>
    </motion.section>
  );
}
