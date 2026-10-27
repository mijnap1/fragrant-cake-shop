import type { ReactNode } from 'react';
import { motion } from 'motion/react';

/** Blurred full-screen overlay with a pop-in card. Clicks inside never reach the stage. */
export function Modal({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <motion.div
      className="screen overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={e => e.stopPropagation()}
    >
      <motion.div
        className={`card ${className}`}
        initial={{ scale: 0.92, y: 12, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
