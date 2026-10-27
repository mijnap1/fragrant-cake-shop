import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import App from './App';
import { Background } from './backgrounds/Background';
import { CakePreview } from './dev/CakePreview';
import { SpriteGallery } from './dev/SpriteGallery';
import { LangProvider } from './i18n';
import type { BgId } from './story/types';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <MotionConfig reducedMotion="user">
        {/* dev-only previews: #sprites for the character sheet, #bg=street for one background, #cake for the minigame */}
        {import.meta.env.DEV && location.hash.startsWith('#sprites') ? (
          <SpriteGallery />
        ) : import.meta.env.DEV && location.hash === '#cake' ? (
          <CakePreview />
        ) : import.meta.env.DEV && location.hash.startsWith('#bg=') ? (
          <Background id={location.hash.slice(4) as BgId} />
        ) : (
          <App />
        )}
      </MotionConfig>
    </LangProvider>
  </StrictMode>,
);
