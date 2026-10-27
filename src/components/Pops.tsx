import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Pop } from '../engine/game';
import { useLang } from '../i18n';
import { CAST } from '../story/cast';

function PopBubble({ pop, index, onDone }: { pop: Pop; index: number; onDone: (id: number) => void }) {
  const { tr } = useLang();
  useEffect(() => {
    const id = window.setTimeout(() => onDone(pop.id), 1700);
    return () => window.clearTimeout(id);
  }, [pop.id, onDone]);
  return (
    <motion.div
      className="pop"
      style={{ color: CAST[pop.who].color, top: `calc(16% + ${index * 52}px)` }}
      initial={{ opacity: 0, y: 20, scale: 0.8, x: '-50%' }}
      animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
      exit={{ opacity: 0, y: -24, x: '-50%' }}
      transition={{ type: 'spring', stiffness: 420, damping: 22 }}
    >
      {pop.who === 'kao' ? '💗' : '⭐'} {tr(CAST[pop.who].name)} +{pop.n}
    </motion.div>
  );
}

export function Pops({ pops, onDone }: { pops: Pop[]; onDone: (id: number) => void }) {
  return (
    <div className="pops">
      <AnimatePresence>
        {pops.map((p, i) => (
          <PopBubble key={p.id} pop={p} index={i} onDone={onDone} />
        ))}
      </AnimatePresence>
    </div>
  );
}
