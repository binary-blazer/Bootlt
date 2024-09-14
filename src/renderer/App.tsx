import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import SetupStage1 from './setup/stage1/page';
import SetupStage2 from './setup/stage2/page';
import { IStoreSettingsObject } from '../main/interfaces';

const swipeVariants = {
  initial: { x: '100vw' },
  animate: { x: 0 },
  exit: { x: '-100vw' },
};

function Function({
  settings,
  setupPart,
  setSetupPart,
}: {
  settings: IStoreSettingsObject;
  setupPart: any;
  setSetupPart: any;
}) {
  const handleSetupPart = (part: Number) => {
    setSetupPart(part);
    window.electron.ipcRenderer.sendMessage('settings:set', 'setupPart', part);
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={swipeVariants}
      transition={{ type: 'linear', stiffness: 225, damping: 30 }}
    >
      {/* eslint-disable-next-line no-nested-ternary */}
      {!settings?.setupDone ? (
        // eslint-disable-next-line no-nested-ternary
        settings?.setupPart === 0 ? (
          <SetupStage1 setupPart={setupPart} setSetupPart={handleSetupPart} />
        ) : settings?.setupPart === 1 ? (
          <SetupStage2 setupPart={setupPart} setSetupPart={handleSetupPart} />
        ) : (
          <main className="relative flex flex-col items-center justify-center h-screen">
            <i className="text-5xl fad fa-spinner-third animate-spin" />
          </main>
        )
      ) : (
        <main className="relative flex flex-col items-center justify-center h-screen">
          <i className="text-5xl fad fa-spinner-third animate-spin" />
        </main>
      )}
    </motion.div>
  );
}

export default function App() {
  const [settings, setSettings] = useState<IStoreSettingsObject | null>(null);
  const [setupPart, setSetupPart] = useState(0);

  window.electron.ipcRenderer.once('settings:get', (arg: any) => {
    setSettings(arg);
    setSetupPart(arg?.setupPart);
  });
  window.electron.ipcRenderer.sendMessage('settings:get');

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Function
              settings={settings as IStoreSettingsObject}
              setupPart={setupPart}
              setSetupPart={setSetupPart}
            />
          }
        />
      </Routes>
    </Router>
  );
}
