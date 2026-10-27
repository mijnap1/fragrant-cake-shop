import { useCallback, useEffect, useState } from 'react';
import { storage } from '../engine/storage';
import { audio } from './audio';

export interface SoundSettings {
  music: number;
  sfx: number;
  muted: boolean;
  /** Little voice ticks while text types out. */
  blips: boolean;
}

const KEY = 'kaoru-vn-sound';
const DEFAULTS: SoundSettings = { music: 0.6, sfx: 0.8, muted: false, blips: true };

export function useSoundSettings() {
  const [sound, setState] = useState<SoundSettings>(() => ({ ...DEFAULTS, ...storage.get<Partial<SoundSettings>>(KEY) }));

  useEffect(() => {
    audio.setVolumes(sound.music, sound.sfx, sound.muted);
  }, [sound]);

  const setSound = useCallback((patch: Partial<SoundSettings>) => {
    setState(s => {
      const next = { ...s, ...patch };
      storage.set(KEY, next);
      return next;
    });
  }, []);

  return [sound, setSound] as const;
}
