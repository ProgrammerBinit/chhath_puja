import { useCallback, useEffect, useState } from 'react';

/** Full-screen "presentation mode" for the whole page. */
export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const supported = typeof document !== 'undefined' && document.fullscreenEnabled;

  useEffect(() => {
    const on = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', on);
    return () => document.removeEventListener('fullscreenchange', on);
  }, []);

  const toggle = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined);
    } else {
      void document.documentElement.requestFullscreen().catch(() => undefined);
    }
  }, []);

  return { isFullscreen, supported, toggle };
}
