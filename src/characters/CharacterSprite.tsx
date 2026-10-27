import { useEffect, useRef, useState } from 'react';
import { motion, useAnimationControls } from 'motion/react';
import type { CharId, Expr, Pos } from '../story/types';
import { Kaoruko } from './Kaoruko';
import { Rintaro } from './Rintaro';

const SPRITES = { rin: Rintaro, kao: Kaoruko } satisfies Record<CharId, unknown>;

/** Blinks every few seconds, sometimes twice in a row. */
export function useBlink() {
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    let timer: number;
    const schedule = () => {
      timer = window.setTimeout(() => {
        setBlink(true);
        const twice = Math.random() < 0.25;
        timer = window.setTimeout(() => {
          setBlink(false);
          if (twice) {
            timer = window.setTimeout(() => {
              setBlink(true);
              timer = window.setTimeout(() => {
                setBlink(false);
                schedule();
              }, 110);
            }, 140);
          } else schedule();
        }, 120);
      }, 2200 + Math.random() * 3200);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, []);
  return blink;
}

/** Opens and closes the mouth while text is being typed out. */
function useMouthFlap(talking: boolean) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!talking) {
      setOpen(false);
      return;
    }
    const id = window.setInterval(() => setOpen(o => !o), 130);
    return () => window.clearInterval(id);
  }, [talking]);
  return open;
}

interface Props {
  id: CharId;
  e: Expr;
  pos: Pos;
  dim: boolean;
  talking: boolean;
}

export function CharacterSprite({ id, e, pos, dim, talking }: Props) {
  const blink = useBlink();
  const mouthOpen = useMouthFlap(talking);
  const hop = useAnimationControls();
  const prevE = useRef(e);

  useEffect(() => {
    if (prevE.current === e) return;
    prevE.current = e;
    hop.start({ y: [0, -14, 0], transition: { duration: 0.35, ease: 'easeOut' } });
  }, [e, hop]);

  const Sprite = SPRITES[id];
  return (
    <motion.div
      className={`char ${id} pos-${pos}${dim ? ' dim' : ''}`}
      style={{ x: '-50%' }}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 14 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <motion.div className="char-inner" animate={hop}>
        <Sprite e={e} blink={blink} talk={mouthOpen} />
      </motion.div>
    </motion.div>
  );
}
