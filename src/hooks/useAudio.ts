import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AmbientEngine } from '../lib/ambientEngine';
import type { Mood } from '../types';

/** Optional licensed folk-song file. Drop it into /public/audio/ — see README. */
const FOLK_SRC = `${import.meta.env.BASE_URL}audio/chhath-geet.mp3`;

export interface AudioApi {
  musicOn: boolean;
  voiceOn: boolean;
  folkOn: boolean;
  folkAvailable: boolean;
  voiceSupported: boolean;
  muted: boolean;
  volume: number;
  toggleMusic: () => void;
  toggleVoice: () => void;
  toggleFolk: () => void;
  toggleMute: () => void;
  setVolume: (v: number) => void;
  setMood: (m: Mood) => void;
  chime: () => void;
  speak: (text: string) => void;
  cancelSpeech: () => void;
  pauseSpeech: () => void;
  resumeSpeech: () => void;
}

export function useAudio(): AudioApi {
  const [musicOn, setMusicOn] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const [folkOn, setFolkOn] = useState(false);
  const [folkAvailable, setFolkAvailable] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.7);

  const engine = useRef<AmbientEngine | null>(null);
  const folk = useRef<HTMLAudioElement | null>(null);
  const volumeRef = useRef(volume);
  const mutedRef = useRef(muted);
  volumeRef.current = volume;
  mutedRef.current = muted;

  const voiceSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const getEngine = useCallback((): AmbientEngine => {
    if (!engine.current) engine.current = new AmbientEngine();
    return engine.current;
  }, []);

  // Detect (once) whether the optional folk track has been supplied.
  useEffect(() => {
    let cancelled = false;
    fetch(FOLK_SRC, { method: 'HEAD' })
      .then((r) => {
        const type = r.headers.get('content-type') ?? '';
        if (!cancelled && r.ok && type.startsWith('audio')) setFolkAvailable(true);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  // Apply volume / mute everywhere.
  useEffect(() => {
    const eff = muted ? 0 : volume;
    engine.current?.setVolume(eff);
    if (folk.current) folk.current.volume = eff * 0.8;
  }, [volume, muted]);

  // Music on/off — only ever started from a click handler path.
  useEffect(() => {
    if (!musicOn) {
      engine.current?.stop();
      return;
    }
    const e = getEngine();
    e.setVolume(mutedRef.current ? 0 : volumeRef.current);
    e.start().catch(() => setMusicOn(false));
  }, [musicOn, getEngine]);

  useEffect(() => {
    if (!folkOn || !folkAvailable) {
      folk.current?.pause();
      return;
    }
    if (!folk.current) {
      const a = new Audio(FOLK_SRC);
      a.loop = true;
      folk.current = a;
    }
    folk.current.volume = (mutedRef.current ? 0 : volumeRef.current) * 0.8;
    folk.current.play().catch(() => setFolkOn(false));
  }, [folkOn, folkAvailable]);

  useEffect(
    () => () => {
      engine.current?.dispose();
      folk.current?.pause();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    },
    [],
  );

  const speak = useCallback(
    (text: string) => {
      if (!voiceSupported) return;
      const synth = window.speechSynthesis;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'hi-IN';
      u.rate = 0.82;
      u.pitch = 1;
      u.volume = mutedRef.current ? 0 : volumeRef.current;
      const hi = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith('hi'));
      if (hi) u.voice = hi;
      synth.speak(u);
    },
    [voiceSupported],
  );

  const setMood = useCallback((m: Mood) => engine.current?.setMood(m), []);
  const chime = useCallback(() => engine.current?.chime(), []);

  const cancelSpeech = useCallback(() => {
    if (voiceSupported) window.speechSynthesis.cancel();
  }, [voiceSupported]);
  const pauseSpeech = useCallback(() => {
    if (voiceSupported) window.speechSynthesis.pause();
  }, [voiceSupported]);
  const resumeSpeech = useCallback(() => {
    if (voiceSupported) window.speechSynthesis.resume();
  }, [voiceSupported]);

  return useMemo(
    () => ({
      musicOn,
      voiceOn,
      folkOn,
      folkAvailable,
      voiceSupported,
      muted,
      volume,
      toggleMusic: () => setMusicOn((v) => !v),
      toggleVoice: () =>
        setVoiceOn((v) => {
          if (v && voiceSupported) window.speechSynthesis.cancel();
          return !v;
        }),
      toggleFolk: () => setFolkOn((v) => !v),
      toggleMute: () => setMuted((v) => !v),
      setVolume: (v: number) => {
        setVolumeState(v);
        if (v > 0) setMuted(false);
      },
      setMood,
      chime,
      speak,
      cancelSpeech,
      pauseSpeech,
      resumeSpeech,
    }),
    [musicOn, voiceOn, folkOn, folkAvailable, voiceSupported, muted, volume, speak, setMood, chime, cancelSpeech, pauseSpeech, resumeSpeech],
  );
}
