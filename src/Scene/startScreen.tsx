import { useEffect, useState } from "react";
import { corpLogoSvg } from "../assets/CorpLogo";
import {
  SETTING_DISABLE_ANIMATIONS,
  SETTING_DISABLE_SOUNDS,
  SETTING_START_SCREEN,
  useGameStore,
} from "../store/store";
import { ToggleButton } from "../components/UI/Elements/ToggleButton";
import { useSoundSystem } from "../hooks/soundSystem";
import { useCheckVariableRender } from "../utils/functions";

const authorName = "Denys Bondartsov";

const StartScreen = () => {
  const setStartScreen = useGameStore((state) => state.updateStoreProperty);
  const updateVariableInLocalStorage = useGameStore(
    (state) => state.updateVariableInLocalStorage,
  );
  const disableAnimations = useGameStore((state) => state.disableAnimations);
  const disableSounds = useGameStore((state) => state.disableSounds);
  const startScreen = useGameStore((state) => state.startScreen);
  const loadingProgress = useGameStore((state) => state.loadingProgress);
  const startToLoadFiles = useGameStore((state) => state.startToLoadFiles);
  const [skipStartScene, setSkipStartScene] = useState(false);

  useCheckVariableRender(loadingProgress, "loadingProgress");

  const { sounds } = useSoundSystem();

  useEffect(() => {
    if (loadingProgress >= 100) {
      if (!disableSounds && sounds.click) {
        sounds.click.play();
      }
      setTimeout(() => {
        setStartScreen(SETTING_START_SCREEN, false);
        if (startScreen === skipStartScene) {
          updateVariableInLocalStorage(SETTING_START_SCREEN, !skipStartScene);
        }
      }, 1000);
    }
  }, [
    loadingProgress,
    disableSounds,
    sounds.click,
    skipStartScene,
    startScreen,
    setStartScreen,
    updateVariableInLocalStorage,
  ]);

  return (
    <div className="h-full w-full bg-black">
      <div
        className={`h-full w-full flex flex-col justify-center items-center bg-neutral-900 ${
          loadingProgress >= 100 ? "animate-fadeOut" : ""
        }`}
      >
        <div className="w-20 -mb-1 h-auto">
          <div className="w-full h-full flex justify-center items-center fill-white">
            {corpLogoSvg}
          </div>
        </div>
        <div
          className="orbitron text-7xl uppercase text-center text-yellow-400"
          style={{ transform: "perspective(40px) rotateX(5deg)" }}
        >
          Worlds researcher
        </div>
        <h1 className="orbitron text-xs mt-3 uppercase -skew-x-12">
          Project for the Threejs.journey course
        </h1>
        <p className="text-center w-3/5 orbitron text-2xs mt-3 uppercase -skew-x-12 scale-y-150 scale-x-75 leading-3">
          {`Course by Bruno Simon ·
          Design by ${authorName} ·
          Story by ${authorName} ·
          Animation by ${authorName} ·
          Development by ${authorName} ·
          Testing by Liia Kukava ❤︎
          Time Travel Logistics by ${authorName} ·
          Unicorn Training by ${authorName} ·
          Cat Whispering by ${authorName}`}
        </p>

        {!startToLoadFiles && (
          <div className="w-fit h-fit mt-16 flex flex-row items-center justify-center border border-neutral-100 hover:border-yellow-400 overflow-hidden bg-neutral-100 hover:bg-yellow-400 cursor-pointer">
            <div className="w-36 h-full overflow-hidden">
              <div
                className="w-72 h-full flex flex-col justify-center items-center bg-repeat-x animate-linear"
                style={{
                  background:
                    "repeating-linear-gradient(-45deg, transparent, transparent 10px, black 10px, black 20px)",
                }}
              />
            </div>
            <button
              className="orbitron w-36 m-2 uppercase text-center text-neutral-900"
              onClick={() => useGameStore.setState({ startToLoadFiles: true })}
            >
              Start Game
            </button>
            <div className="w-36 h-full overflow-hidden">
              <div
                className="w-72 h-full flex flex-col justify-center items-center bg-repeat-x animate-linear"
                style={{
                  background:
                    "repeating-linear-gradient(-45deg, transparent, transparent 10px, black 10px, black 20px)",
                }}
              />
            </div>
          </div>
        )}

        {startToLoadFiles && (
          <div className="w-[300px] h-10 mt-16 bg-neutral-800 border">
            <div
              className="h-full overflow-hidden bg-neutral-200"
              style={{ width: `${loadingProgress * 3}px` }}
            >
              <div
                className="h-full flex flex-col justify-center items-center bg-repeat-x animate-linear"
                style={{
                  width: `${loadingProgress * 6}px`,
                  background:
                    "repeating-linear-gradient(-45deg, transparent, transparent 10px, black 10px, black 20px)",
                }}
              />
            </div>
          </div>
        )}

        <div className="h-fit mt-16 flex flex-col justify-center items-center">
          <p>Settings</p>
          <p className="w-3/5 text-xs text-center leading-3">
            The game includes glitch effects that may cause discomfort or
            seizures for people with photosensitive epilepsy. If you find these
            effects uncomfortable you can disable them.
          </p>
          <div className="mt-2 flex flex-row gap-3">
            <ToggleButton
              text={"Animations"}
              onClick={() =>
                updateVariableInLocalStorage(
                  SETTING_DISABLE_ANIMATIONS,
                  !disableAnimations,
                )
              }
              state={disableAnimations}
            />
            <ToggleButton
              text={"Sound"}
              onClick={() => {
                updateVariableInLocalStorage(
                  SETTING_DISABLE_SOUNDS,
                  !disableSounds,
                );
              }}
              state={disableSounds}
            />
            <ToggleButton
              text={"Show start screen"}
              onClick={() => setSkipStartScene(!skipStartScene)}
              state={skipStartScene}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
