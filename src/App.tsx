import { useEffect, useReducer, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { audio } from './audio/audio';
import { useSoundSettings } from './audio/settings';
import type { TrackId } from './audio/tracks';
import { Game } from './components/Game';
import { Petals } from './components/Petals';
import { NameScreen, SettingsModal, TitleScreen } from './components/Screens';
import { clearSave, readSave, recordEnding, reducer, stepAt, writeSave } from './engine/game';
import { SPEED_CPS, useSpeed } from './engine/settings';

export default function App() {
  const [game, dispatch] = useReducer(reducer, null);
  const [naming, setNaming] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [speed, setSpeed] = useSpeed();
  const [sound, setSound] = useSoundSettings();

  useEffect(() => {
    if (!game) return;
    const st = stepAt(game);
    if (st?.kind === 'ending') {
      recordEnding(st.id);
      clearSave();
    } else writeSave(game);
  }, [game]);

  // Browsers block audio until the first click or key press.
  useEffect(() => {
    const unlock = () => audio.unlock();
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  const track: TrackId = game?.bg === 'street' ? 'sunset' : 'sweet';
  useEffect(() => audio.music(track), [track]);

  const continueGame = () => {
    const save = readSave();
    if (!save) return;
    audio.sfx('select');
    dispatch({ type: 'load', save });
  };
  const toggleMute = () => setSound({ muted: !sound.muted });

  return (
    <div className="stage">
      {game ? (
        <Game
          game={game}
          dispatch={dispatch}
          cps={SPEED_CPS[speed]}
          paused={settingsOpen}
          blips={sound.blips}
          muted={sound.muted}
          onToggleMute={toggleMute}
          onSettings={() => setSettingsOpen(true)}
          onTitle={() => dispatch({ type: 'quit' })}
        />
      ) : (
        <TitleScreen
          canContinue={!!readSave()}
          muted={sound.muted}
          onToggleMute={toggleMute}
          onStart={() => {
            audio.sfx('select');
            setNaming(true);
          }}
          onContinue={continueGame}
        />
      )}

      <AnimatePresence>
        {naming && (
          <NameScreen
            onOk={name => {
              audio.sfx('select');
              setNaming(false);
              dispatch({ type: 'new', name });
            }}
          />
        )}
        {settingsOpen && (
          <SettingsModal
            speed={speed}
            onSpeed={setSpeed}
            sound={sound}
            onSound={setSound}
            onClose={() => setSettingsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Falling petals belong to the title screen only. */}
      {!game && <Petals />}
    </div>
  );
}
