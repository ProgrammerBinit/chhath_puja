import { PersonDefs } from './Person';

/**
 * Gradients shared by every scene. Rendered once inside each scene <svg>.
 * The ids are static: duplicates (during cross-fades) are identical, so resolving to either is fine.
 */
export function SharedDefs() {
  return (
    <defs>
      <radialGradient id="g-sun-halo" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffd27a" stopOpacity="0.7" />
        <stop offset="22%" stopColor="#ffa94a" stopOpacity="0.36" />
        <stop offset="55%" stopColor="#ff8a2a" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#ff7a18" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="g-sun-disc" cx="50%" cy="46%" r="56%">
        <stop offset="0%" stopColor="#fffbe0" />
        <stop offset="45%" stopColor="#ffd25a" />
        <stop offset="80%" stopColor="#ff9a1f" />
        <stop offset="100%" stopColor="#f0620d" />
      </radialGradient>
      <linearGradient id="g-sun-ray" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#ffb347" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="g-mist" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fff1d0" stopOpacity="0" />
        <stop offset="50%" stopColor="#fff1d0" stopOpacity="1" />
        <stop offset="100%" stopColor="#fff1d0" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="g-diya-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffd98a" stopOpacity="0.85" />
        <stop offset="45%" stopColor="#ff9f43" stopOpacity="0.28" />
        <stop offset="100%" stopColor="#ff7a18" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="g-river-glow" cx="50%" cy="0%" r="75%">
        <stop offset="0%" stopColor="#ffbf5a" stopOpacity="0.7" />
        <stop offset="60%" stopColor="#ff8a2a" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#ff7a18" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="g-dot" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff3b8" stopOpacity="1" />
        <stop offset="40%" stopColor="#ffc24d" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#ff9a1f" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="g-flame" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stopColor="#ff6a00" />
        <stop offset="55%" stopColor="#ffb21f" />
        <stop offset="100%" stopColor="#fff1a8" />
      </linearGradient>
      <linearGradient id="g-clay" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#d27a4a" />
        <stop offset="100%" stopColor="#8a3f22" />
      </linearGradient>
      <linearGradient id="g-copper" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#8f4a22" />
        <stop offset="40%" stopColor="#f0a35c" />
        <stop offset="100%" stopColor="#9a5128" />
      </linearGradient>
      <linearGradient id="g-brass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ffe08a" />
        <stop offset="55%" stopColor="#d9a024" />
        <stop offset="100%" stopColor="#8f6410" />
      </linearGradient>
      <linearGradient id="g-bamboo" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e6c277" />
        <stop offset="100%" stopColor="#a8803a" />
      </linearGradient>
      <linearGradient id="g-cane" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#6c8a2f" />
        <stop offset="50%" stopColor="#b6c85a" />
        <stop offset="100%" stopColor="#5d7a26" />
      </linearGradient>
      <linearGradient id="g-vignette-bottom" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#000" stopOpacity="0" />
        <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
      </linearGradient>
      <PersonDefs />
    </defs>
  );
}
