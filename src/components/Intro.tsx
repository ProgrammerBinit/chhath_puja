import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { SITE_TAGLINE, SITE_TAGLINE_EN, SITE_TITLE } from '../data/chhathScenes';

interface Props {
  onStart: () => void;
  reducedMotion: boolean;
}

/** The opening card. Chapter 1 is already glowing behind it — it is the first scene visitors see. */
export function Intro({ onStart, reducedMotion }: Props) {
  const fade = (d: number) =>
    reducedMotion ? {} : { initial: { opacity: 0, y: 22, filter: 'blur(10px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, transition: { duration: 1.4, delay: d, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <motion.section
      aria-label="स्वागत"
      className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
      style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(8,10,34,0.35), rgba(5,7,26,0.82) 85%)' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: reducedMotion ? 0.15 : 1.2 } }}
    >
      <motion.p {...fade(0.2)} className="font-sub text-sm uppercase tracking-[0.55em] text-gold-300/90 sm:text-base">
        Bihar · Chhath Mahaparv
      </motion.p>
      <motion.h1
        {...fade(0.5)}
        lang="hi"
        className="mt-3 font-deva text-6xl leading-tight text-white sm:text-8xl md:text-[8.5rem]"
        style={{ textShadow: '0 6px 60px rgba(255,150,40,0.65), 0 2px 12px rgba(0,0,0,0.6)' }}
      >
        {SITE_TITLE}
      </motion.h1>
      <motion.div {...fade(0.9)} aria-hidden="true" className="mt-2 h-px w-56 bg-gradient-to-r from-transparent via-gold-400 to-transparent sm:w-96" />
      <motion.p {...fade(1.1)} lang="hi" className="mt-5 font-deva text-xl text-gold-300 sm:text-3xl">
        {SITE_TAGLINE}
      </motion.p>
      <motion.p {...fade(1.3)} lang="en" className="mt-1 font-sub text-lg italic text-white/75 sm:text-xl">
        {SITE_TAGLINE_EN}
      </motion.p>

      <motion.button
        {...fade(1.7)}
        type="button"
        onClick={onStart}
        autoFocus
        className="group mt-10 flex items-center gap-3 rounded-full border border-gold-300/80 bg-gradient-to-b from-gold-400/35 to-saffron-600/35 px-8 py-4 font-deva text-2xl text-white shadow-[0_0_40px_rgba(255,160,40,0.45)] backdrop-blur transition hover:from-gold-400/55 hover:to-saffron-600/55 sm:text-3xl"
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-gold-400 text-midnight-950 transition group-hover:scale-110">
          <Play size={20} fill="currentColor" />
        </span>
        यात्रा आरंभ करें
        <span className="sr-only"> (Start Journey)</span>
      </motion.button>
      <motion.p {...fade(2.1)} className="mt-5 max-w-md font-body text-sm text-white/65">
        सर्वोत्तम अनुभव के लिए ऊपर दाईं ओर 🔊 से संगीत और हिंदी वाचन चालू करें · Best with sound on
      </motion.p>
    </motion.section>
  );
}
