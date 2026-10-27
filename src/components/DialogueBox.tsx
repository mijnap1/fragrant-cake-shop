import { AnimatePresence, motion } from 'motion/react';
import { useLang } from '../i18n';
import { CAST } from '../story/cast';
import type { CharId } from '../story/types';

interface Props {
  who: CharId | null;
  text: string;
  done: boolean;
  showNext: boolean;
}

export function DialogueBox({ who, text, done, showNext }: Props) {
  const { tr } = useLang();
  return (
    <motion.div className="box" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}>
      <AnimatePresence mode="popLayout">
        {who && (
          <motion.div
            key={who}
            className="name-tag"
            style={{ background: CAST[who].color }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 26 }}
          >
            {tr(CAST[who].name)}
          </motion.div>
        )}
      </AnimatePresence>
      <div className={`text${who ? '' : ' narr'}`}>{text}</div>
      {done && showNext && <div className="next">▼</div>}
    </motion.div>
  );
}
