import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';

const swipeVariants = {
  initial: { x: '100vw' },
  animate: { x: 0 },
  exit: { x: '-100vw' },
};

function Function({
  swipePart,
  setSwipePart,
}: {
  swipePart: number;
  setSwipePart: any;
}) {
  const handleSwipePart = (part: number) => {
    setSwipePart(part);
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
      {swipePart === 0 ? (
        <main className="relative flex flex-col items-center justify-center h-screen">
          <h1 className="text-5xl font-bold">Welcome to the app!</h1>
          <button
            type="button"
            onClick={() => handleSwipePart(1)}
            className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-md"
          >
            Next
          </button>
        </main>
      ) : swipePart === 1 ? (
        <main className="relative flex flex-col items-center justify-center h-screen">
          <h1 className="text-5xl font-bold">Step 2</h1>
          <button
            type="button"
            onClick={() => handleSwipePart(2)}
            className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-md"
          >
            Next
          </button>
        </main>
      ) : (
        <main className="relative flex flex-col items-center justify-center h-screen">
          <i className="text-5xl fad fa-spinner-third animate-spin" />
        </main>
      )}
    </motion.div>
  );
}

export default function App() {
  const [swipePart, setSwipePart] = useState(0);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Function swipePart={swipePart} setSwipePart={setSwipePart} />
          }
        />
      </Routes>
    </Router>
  );
}
