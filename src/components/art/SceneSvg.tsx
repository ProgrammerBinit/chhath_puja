import { useEffect, useState, type ReactNode } from 'react';
import { SharedDefs } from './SharedDefs';

function useAspect(): number {
  const get = () => (typeof window === 'undefined' ? 1.78 : window.innerWidth / Math.max(1, window.innerHeight));
  const [aspect, setAspect] = useState(get);
  useEffect(() => {
    const on = () => setAspect(get());
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return aspect;
}

interface Props {
  children: ReactNode;
  /** The x (in the 1600×900 artwork) that must stay visible on portrait screens. */
  focusX?: number;
}

/**
 * The 1600×900 artwork canvas.
 * Landscape: fills the screen (slice). Portrait: shows a 1000-wide window around `focusX`,
 * pinned to the top so the caption and controls sit on the ground colour beneath.
 */
export function SceneSvg({ children, focusX = 800 }: Props) {
  const aspect = useAspect();
  const wide = aspect >= 1.25;
  const viewBox = wide ? '0 0 1600 900' : `${Math.round(focusX - 500)} 0 1000 900`;
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox={viewBox}
      preserveAspectRatio={wide ? 'xMidYMid slice' : 'xMidYMin meet'}
      aria-hidden="true"
      focusable="false"
    >
      <SharedDefs />
      {children}
    </svg>
  );
}
