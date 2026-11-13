# बिहार छठ महापर्व — Cinematic Animated Experience

छठ पूजा के चार पावन दिनों — **नहाय-खाय, खरना, संध्या अर्घ्य, उषा अर्घ्य** — की एक पूरी तरह एनिमेटेड, हिंदी-भाषी यात्रा।
A cinematic, fully animated, Hindi-first storytelling site built with **React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion · Lucide React**.

Every picture is hand-built SVG animated with Framer Motion + CSS keyframes — no image files, no video, so it stays crisp on every screen and loads fast.

## Quick start

Requires **Node.js 18 or newer**.

```bash
npm install
npm run dev        # http://localhost:5173
```

Production build:

```bash
npm run build      # type-checks, then builds to /dist
npm run preview    # serve the production build locally
```

On Windows PowerShell the same commands work as-is.

## The four chapters

| # | Chapter | Scene |
|---|---------|-------|
| 01 | नहाय-खाय | Sunrise over a Bihari village: holy bath in the pond, sweeping the courtyard, lauki-chana dal and arwa chawal on a clay chulha |
| 02 | खरना | Dusk in the village kitchen: gur-wali kheer, roti, Kharna puja and distribution of prasad |
| 03 | संध्या अर्घ्य | A vast river ghat at sunset with hundreds of devotees, soop-daura offerings, floating diyas, folk-song atmosphere — then the night **Kosi** with the sugarcane canopy and clay elephant |
| 04 | उषा अर्घ्य | Pre-dawn → sunrise Arghya, then thekua / kasar / rasia preparation, parana and family celebration, ending with the *जय छठी मैया* tribute |

## Controls

* **यात्रा आरंभ करें** (Start Journey) · previous / next chapter · replay chapter · pause / resume
* **सभी चलाएँ** (Play All) — chapters roll on automatically
* Click any of the four timeline nodes to jump to a chapter
* **Captions** button — optional English subtitles
* **Full-screen** presentation mode
* Move the pointer for parallax depth

Keyboard: `←` `→` chapters · `Space` pause · `R` replay · `F` full-screen · `M` mute

### Deep links

`/?c=3` opens chapter 3 · `/?c=4&t=0.9` jumps to 90 % of chapter 4 · add `&p=1` to start paused · `&en=1` for English subtitles.

## Audio

Nothing ever autoplays — sound starts only after you open the 🔊 panel and switch something on.

* **भक्ति संगीत** — original, royalty-free devotional ambience generated live with the Web Audio API (tanpura drone + raag Bhoopali melody + temple bells). The mood changes with each chapter.
* **हिंदी वाचन** — Hindi voice narration using the browser's built-in `speechSynthesis` (`hi-IN`). Quality depends on the Hindi voice installed on the device.
* **छठ लोकगीत** — to add a traditional folk song, drop a file you have the **rights to use** at `public/audio/chhath-geet.mp3`. The switch appears automatically. (No copyrighted recordings are bundled.)
* Mute and volume slider are in the same panel.

## Accessibility

* Full keyboard support, visible focus rings, `aria-label`s in Hindi + English
* Narration is also exposed as a polite live region for screen readers; every chapter has a descriptive text alternative of the artwork
* **`prefers-reduced-motion`**: auto-advance, parallax and looping animations are switched off; each chapter shows a calm finished frame and the narration stays on screen

## Project structure

```
src/
  components/
    Navbar.tsx            brand, 4-day timeline, captions, full-screen, sound
    SceneRenderer.tsx     cross-fades chapters, parallax, light-leak, vignette
    SceneNavigation.tsx   prev / pause / replay / next, Play All, progress bar
    HindiNarration.tsx    word-by-word Hindi text + optional English subtitle
    AudioController.tsx   music / voice / folk toggles, volume, mute
    AnimatedSun.tsx  AnimatedRiver.tsx  Diyas.tsx
    ChapterTitle.tsx  Intro.tsx  Finale.tsx
    art/                  reusable SVG parts: Sky, Clouds, Birds, Particles, Person & Crowd,
                          village props, ParallaxLayer, Reveal …
  scenes/                 NahayKhay · Kharna · SandhyaArghya · UshaArghya
  hooks/                  useSceneNavigation · useAudio · useFullscreen
  data/chhathScenes.ts    all chapter text, durations and finale copy
  lib/                    ambientEngine (Web Audio), utils
```

### How it works

Each chapter has one clock, `progress` (0 → 1), kept in a Framer Motion `MotionValue`. The sun, sky colours, water, characters and text are all derived from it with `useTransform`, so the whole film animates at 60 fps **without React re-renders**. Endless motion (flames, waves, birds, diyas) runs as CSS keyframes on the compositor.

To change timing, edit `durationMs` in `src/data/chhathScenes.ts`. To change the words, edit the same file.

## Fonts

Typography (Tiro Devanagari Hindi, Mukta, Cormorant Garamond) loads from Google Fonts in `index.html`, with system Devanagari fallbacks. For fully offline use, self-host the fonts and update the `<link>`.

## Deploying

`npm run build` produces a static `dist/` folder — host it on Netlify, Vercel, GitHub Pages, S3, etc. If you deploy under a sub-path, set `base` in `vite.config.ts`.
