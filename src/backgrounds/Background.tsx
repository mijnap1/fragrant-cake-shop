import type { ComponentType } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { BgId } from '../story/types';
import { Shop } from './Shop';
import { ShopFront } from './ShopFront';
import { Street } from './Street';

const SCENES: Record<BgId, ComponentType> = {
  shop: Shop,
  shopFront: ShopFront,
  street: () => <Street time="sunset" />,
  streetDay: () => <Street time="day" />,
};

export function Background({ id }: { id: BgId | null }) {
  const Scene = id ? SCENES[id] : null;
  return (
    <AnimatePresence>
      {Scene && (
        <motion.div
          key={id}
          className="bg-layer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Scene />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
