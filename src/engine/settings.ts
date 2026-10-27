import { useCallback, useState } from 'react';
import { storage } from './storage';

export type Speed = 'slow' | 'normal' | 'fast';
export const SPEED_CPS: Record<Speed, number> = { slow: 18, normal: 34, fast: 70 };

const KEY = 'kaoru-vn-speed';

export function useSpeed() {
  const [speed, setState] = useState<Speed>(() => storage.get<Speed>(KEY) ?? 'normal');
  const setSpeed = useCallback((s: Speed) => {
    setState(s);
    storage.set(KEY, s);
  }, []);
  return [speed, setSpeed] as const;
}
