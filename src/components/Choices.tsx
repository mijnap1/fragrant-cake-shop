import { motion } from 'motion/react';

export function Choices({ options, onPick }: { options: string[]; onPick: (i: number) => void }) {
  return (
    <motion.div className="choices" exit={{ opacity: 0 }}>
      {options.map((text, i) => (
        <motion.button
          key={i}
          className="choice"
          initial={{ opacity: 0, y: 14, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: i * 0.07, type: 'spring', stiffness: 380, damping: 24 }}
          whileHover={{ y: -2 }}
          whileTap={{ y: 3 }}
          onClick={e => {
            e.stopPropagation();
            onPick(i);
          }}
        >
          {text}
        </motion.button>
      ))}
    </motion.div>
  );
}
