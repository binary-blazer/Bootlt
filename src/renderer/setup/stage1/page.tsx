/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/button-has-type */
import icon from '../../../../assets/icon.png';

export default function SetupStage1({
  setupPart,
  setSetupPart,
}: {
  setupPart: any;
  setSetupPart: any;
}) {
  return (
    <main className="relative flex flex-col items-center justify-center h-screen">
      <img
        src={icon}
        alt="icon"
        className="fixed top-6 left-1/2 -translate-x-1/2 w-16 h-16"
        draggable="false"
      />
      <h1 className="text-6xl mt-14 font-semibold">
        Lets begin the setup process
      </h1>
      <h3 className="text-2xl mt-4">
        Are you ready to experience the new web?
      </h3>
      <button
        className="mt-6 px-8 font-medium py-2 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-md"
        onClick={() => setSetupPart(1)}
      >
        Get Started
      </button>
      <h1 className="text-sm bottom-6 absolute select-none">
        <span className="font-bold">ShadowBrowse:</span>{' '}
        <a
          href="https://shadowbrowse.com/changelog/v1.0.0-a.01"
          className="hover:text-blue-400 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          v1.0.0-a.01
        </a>
      </h1>
    </main>
  );
}
