import { useEffect, useId, useRef, useState } from 'react';
import { Mic, Music, Music2, Volume2, VolumeX } from 'lucide-react';
import type { AudioApi } from '../hooks/useAudio';

interface RowProps {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  on: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

function Row({ icon, label, sub, on, disabled, onToggle }: RowProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={onToggle}
      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
    >
      <span className={`grid h-8 w-8 place-items-center rounded-full ${on ? 'bg-gold-400 text-midnight-950' : 'bg-white/10 text-white/80'}`}>{icon}</span>
      <span className="flex-1">
        <span className="block font-body text-[0.95rem] leading-tight text-white">{label}</span>
        {sub && <span className="block font-body text-xs text-white/60">{sub}</span>}
      </span>
      <span aria-hidden="true" className={`h-5 w-9 rounded-full p-0.5 transition ${on ? 'bg-gold-500' : 'bg-white/20'}`}>
        <span className={`block h-4 w-4 rounded-full bg-white transition-transform ${on ? 'translate-x-4' : ''}`} />
      </span>
    </button>
  );
}

interface Props {
  audio: AudioApi;
}

/** Speaker button + popover: music, Hindi voice, folk song, volume and mute. Nothing plays until the user asks. */
export function AudioController({ audio }: Props) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const anyOn = audio.musicOn || audio.voiceOn || audio.folkOn;
  const level = audio.muted ? 0 : audio.volume;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        aria-label="ध्वनि नियंत्रण (Sound settings)"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={`relative grid h-10 w-10 place-items-center rounded-full border border-white/20 backdrop-blur transition hover:bg-white/15 ${anyOn && !audio.muted ? 'bg-gold-500/25 text-gold-300' : 'bg-black/25 text-white'}`}
      >
        {level === 0 ? <VolumeX size={19} /> : <Volume2 size={19} />}
        {anyOn && !audio.muted && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-gold-400 shadow-[0_0_8px_#ffd166]" />}
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label="ध्वनि सेटिंग"
          className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-white/15 bg-midnight-900/90 p-3 shadow-2xl backdrop-blur-xl"
        >
          <p className="px-2 pb-1 font-body text-xs uppercase tracking-widest text-gold-300/80">ध्वनि · Sound</p>
          <Row icon={<Music size={16} />} label="भक्ति संगीत" sub="Original devotional ambience" on={audio.musicOn} onToggle={audio.toggleMusic} />
          <Row
            icon={<Mic size={16} />}
            label="हिंदी वाचन"
            sub={audio.voiceSupported ? 'Hindi voice narration' : 'Not supported in this browser'}
            on={audio.voiceOn}
            disabled={!audio.voiceSupported}
            onToggle={audio.toggleVoice}
          />
          <Row
            icon={<Music2 size={16} />}
            label="छठ लोकगीत"
            sub={audio.folkAvailable ? 'Traditional folk song' : 'Add public/audio/chhath-geet.mp3'}
            on={audio.folkOn}
            disabled={!audio.folkAvailable}
            onToggle={audio.toggleFolk}
          />
          <div className="mt-2 flex items-center gap-3 border-t border-white/10 px-2 pt-3">
            <button
              type="button"
              onClick={audio.toggleMute}
              aria-pressed={audio.muted}
              aria-label={audio.muted ? 'ध्वनि चालू करें (Unmute)' : 'म्यूट करें (Mute)'}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              {level === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              className="gold-range w-full"
              min={0}
              max={100}
              value={Math.round(level * 100)}
              aria-label="आवाज़ (Volume)"
              style={{ ['--fill' as string]: `${Math.round(level * 100)}%` }}
              onChange={(e) => audio.setVolume(Number(e.target.value) / 100)}
            />
            <span className="w-8 text-right font-body text-xs tabular-nums text-white/70">{Math.round(level * 100)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
