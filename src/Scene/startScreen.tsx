import { useState } from "react";
import { corpLogoSvg } from "../assets/CorpLogo";
import { useGameStore } from "../store";
import { useCheckVariableRender } from "../utils/functions";
import { ToggleButton } from "../components/UI/ToggleButton";

const authorName = "Denys Bondartsov";

const StartScreen = () => {
  const setStartScreen = useGameStore((state) => state.updateStoreProperty);
  // const toggleAnimations = useGameStore((state) => state.updateDisableAnimationsInStorage);
	const updateVariableInLocalStorage = useGameStore((state) => state.updateVariableInLocalStorage);
  const disableAnimations = useGameStore((state) => state.disableAnimations);
	const disableSounds = useGameStore((state) => state.disableSounds);
	const startScreen = useGameStore((state) => state.startScreen);

	const [skipStartScene, setSkipStartScene] = useState(false);

	useCheckVariableRender(startScreen, "startScreen")

  const startGame = () => {
    setStartScreen("startScreen", false);
		if (startScreen === skipStartScene) {
			updateVariableInLocalStorage("startScreen", !skipStartScene)
		}
  };

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <div className="w-20 -mb-1 h-auto">
        <div className="w-full h-full flex justify-center items-center">{corpLogoSvg}</div>
      </div>
      {/* <h1 className="orbitron text-6xl uppercase -skew-x-12">World researcher</h1> */}
      <h1
        className="orbitron text-7xl uppercase text-center text-yellow-400"
        style={{ transform: " perspective(40px) rotateX(5deg)" }}
      >
        World researcher
      </h1>
      <h1 className="orbitron text-xs mt-3 uppercase -skew-x-12">
        Project for the Threejs.journey course
      </h1>
      <p className=" text-center w-3/5 orbitron text-2xs mt-3 uppercase -skew-x-12 scale-y-150 scale-x-75 leading-3">
        {`Course by Bruno Simon Design by ${authorName} story by ${authorName} animation by ${authorName} development by ${authorName} testing by ${authorName} vfx by ${authorName}`}
      </p>

      <div
        className=" w-fit h-fit mt-16 flex flex-row items-center justify-center border border-neutral-100 hover:border-yellow-400 overflow-hidden bg-neutral-100 hover:bg-yellow-400 cursor-pointer"
        // style={{ transform: "rotate-z(45deg)" }}
      >
        <div className=" w-36 h-full overflow-hidden  ">
          <div
            className=" w-72 h-full flex flex-col justify-center items-center bg-repeat-x animate-linear"
            style={{
              background:
                "repeating-linear-gradient(-45deg, transparent, transparent 10px, black 10px, black 20px)",
            }}
          />
        </div>
        <button className="w-32 m-2 uppercase text-center text-neutral-900" onClick={startGame}>
          Start Game
        </button>
        <div className=" w-36 h-full overflow-hidden  ">
          <div
            className=" w-72 h-full flex flex-col justify-center items-center bg-repeat-x animate-linear"
            style={{
              background:
                "repeating-linear-gradient(-45deg, transparent, transparent 10px, black 10px, black 20px)",
            }}
          />
        </div>
      </div>

      <div className="h-fit mt-16 flex flex-col justify-center items-center">
        <p className="">Settings</p>
        <p className=" w-3/5 text-xs text-center leading-3">
          The game includes a glitch effects that may cause discomfort or seizures for people with
          photosensitive epilepsy. If you find these effects uncomfortable you can disable them.
        </p>
        <div className="mt-2 flex flex-row gap-3">
					<ToggleButton
						text={"Animations"}
						onClick={() => updateVariableInLocalStorage("disableAnimations", !disableAnimations)}
						state={disableAnimations}
					/>
					<ToggleButton
						text={"Sound"}
						onClick={() => updateVariableInLocalStorage("disableSounds", !disableSounds)}
						state={disableSounds}
					/>
					<ToggleButton
						text={"Skip start scene"}
						onClick={() => setSkipStartScene(!skipStartScene)}
						state={skipStartScene}
					/>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;