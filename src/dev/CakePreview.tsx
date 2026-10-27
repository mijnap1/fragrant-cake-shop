import { useState } from 'react';
import { CakeBuilder } from '../components/CakeBuilder';
import type { CakeChoice } from '../story/cake';

/** Dev-only: the cake minigame on its own. Open with `#cake`. */
export function CakePreview() {
  const [choice, setChoice] = useState<CakeChoice>({});
  const [stars, setStars] = useState<number>();
  if (stars) return <p style={{ padding: 24 }}>Served {JSON.stringify(choice)} with {stars}★</p>;
  return <CakeBuilder choice={choice} onPick={(part, id) => setChoice(c => ({ ...c, [part]: id }))} onDone={setStars} />;
}
