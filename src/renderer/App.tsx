/* eslint-disable no-nested-ternary */
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const swipeVariants = {
  initial: { x: '100vw' },
  animate: { x: 0 },
  exit: { x: '-100vw' },
};

function Function({
  loading,
  setLoading,
  refreshLoading,
  setRefreshLoading,
  swipePart,
  setSwipePart,
  usbDevices,
  setUsbDevices,
}: {
  loading: boolean;
  setLoading: any;
  refreshLoading: boolean;
  setRefreshLoading: any;
  swipePart: number;
  setSwipePart: any;
  usbDevices: any[];
  setUsbDevices: any;
}) {
  useEffect(() => {
    const getUsbDevices = async () => {
      setLoading(true);

      window.electron.ipcRenderer.once('usb_devices', (arg: any) => {
        setUsbDevices(arg.devices);
      });

      window.electron.ipcRenderer.sendMessage('usb_devices');

      setLoading(false);
    };

    getUsbDevices();
  }, [setLoading, setUsbDevices]);

  const handleSwipePart = (part: number) => {
    setSwipePart(part);
  };

  const handleRefresh = () => {
    setRefreshLoading(true);

    window.electron.ipcRenderer.once('usb_devices', (arg: any) => {
      setUsbDevices(arg.devices);
    });

    window.electron.ipcRenderer.sendMessage('usb_devices');

    setTimeout(() => {
      setRefreshLoading(false);
    }, 2000);
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
      {loading ? (
        <main className="relative flex flex-col items-center justify-center h-screen">
          <i className="text-5xl fad fa-spinner-third animate-spin" />
        </main>
      ) : swipePart === 0 ? (
        <main className="relative flex flex-col items-center justify-center h-screen p-24">
          <div className="flex flex-row items-center justify-between w-full h-full gap-12">
            <div className="flex flex-col items-start justify-start w-1/2 h-full">
              <div className="flex flex-col items-start justify-start w-full h-full gap-2">
                {refreshLoading ? (
                  <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                    <i className="text-5xl fad fa-spinner-third animate-spin" />
                  </div>
                ) : usbDevices.length > 0 ? (
                  usbDevices.map((device) => (
                    <div className="flex flex-row items-center justify-between w-full py-2 px-3 rounded-lg border border-white/20">
                      <li className="text-2xl font-bold">{device.name}</li>
                      <li className="text-lg">{device.path}</li>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                    <i className="fas fa-exclamation-triangle text-5xl text-yellow-500" />
                    <p className="text-xl text-center">
                      No devices found. Please connect a device and try again.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRefresh()}
                      className="w-1/3 px-4 py-2 mt-4 text-white bg-gradient-to-br from-blue-400 to-blue-600 rounded-md hover:bg-opacity-80 focus:outline-none focus:ring focus:ring-blue-400 transition duration-200 ease-in-out"
                    >
                      Refresh
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="border-r border-white/5 h-full" />
            <div className="flex flex-col items-start justify-between h-full w-1/2">
              <div className="flex flex-col items-end justify-start w-full h-full">
                <h1 className="text-5xl font-bold">Select a device</h1>
                <p className="text-md max-w-[22rem]">
                  Select the device you want to flash a ISO on to.
                </p>
              </div>
              <div className="flex flex-row items-end justify-end w-full gap-2 h-full">
                <button
                  type="button"
                  className="w-1/3 px-4 py-2 opacity-50 mt-4 cursor-default text-white bg-gradient-to-br from-blue-400 to-blue-600 rounded-md"
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="w-1/3 px-4 py-2 opacity-50 mt-4 text-white bg-gradient-to-br from-blue-400 to-blue-600 rounded-md hover:bg-opacity-80 focus:outline-none focus:ring focus:ring-blue-400 transition duration-200 ease-in-out"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
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
  const [loading, setLoading] = useState(true);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [swipePart, setSwipePart] = useState(0);
  const [usbDevices, setUsbDevices] = useState<any[]>([]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Function
              loading={loading}
              setLoading={setLoading}
              refreshLoading={refreshLoading}
              setRefreshLoading={setRefreshLoading}
              swipePart={swipePart}
              setSwipePart={setSwipePart}
              usbDevices={usbDevices}
              setUsbDevices={setUsbDevices}
            />
          }
        />
      </Routes>
    </Router>
  );
}
