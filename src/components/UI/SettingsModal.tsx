import { useGameStore } from "../../store";

export const SettingsModal = () => {
  const disableAnimations = useGameStore((state) => state.disableAnimations);
	const disableSounds = useGameStore((state) => state.disableSounds);
  const showSettingsModal = useGameStore((state) => state.showSettingsModal);
	const startScreen = useGameStore((state) => state.startScreen);

  const updateStoreProperty = useGameStore((state) => state.updateStoreProperty);
	const updateVariableInLocalStorage = useGameStore((state) => state.updateVariableInLocalStorage);

  return (
    <div
      className="fixed  w-full h-full flex justify-center items-center z-50 bg-black/50 "
      style={{ display: showSettingsModal ? "flex" : "none" }}
    >
      <div
				className="bg-black/80 w-96 h-fit flex flex-col px-1 py-2 border border-uilines"
				style={{
					
				}}
			>
        <div className="w-full h-8 flex justify-end items-center">
          <div
            className="flex justify-center items-center size-10 text-uitext cursor-pointer hover:bg-uilines hover:text-neutral-900"
            onClick={() => updateStoreProperty("showSettingsModal", false)}
          >
            <div className=" text-4xl rotate-45 text-center">+</div>
          </div>
        </div>
        <div className=" orbitron w-full h-8 mb-3 flex justify-center items-center text-uitext text-2xl">
          Settings
        </div>
				<div className=" w-full mb-8 flex flex-col justify-center items-center text-uitext text-2xl">
					<div className="w-2/3 h-8 flex justify-between items-center text-uitext text-lg">
						<label htmlFor="disableAnimations" className="text-uitext">
							Show start screen
						</label>
						<input
							type="checkbox"
							id="disableAnimations"
							name="disableAnimations"
							checked={startScreen}
							onChange={() => updateVariableInLocalStorage("startScreen", !startScreen)}
						/>
					</div>
					<div className="w-2/3 h-8 flex justify-between items-center text-uitext text-lg">
						<label htmlFor="disableAnimations" className="text-uitext">
							Disable Animations
						</label>
						<input
							type="checkbox"
							id="disableAnimations"
							name="disableAnimations"
							checked={disableAnimations}
							onChange={() => updateVariableInLocalStorage("disableAnimations", !disableAnimations)}
						/>
					</div>
					<div className="w-2/3 h-8 flex justify-between items-center text-uitext text-lg">
						<label htmlFor="disableAnimations" className="text-uitext">
							Disable Sound
						</label>
						<input
							type="checkbox"
							id="disableAnimations"
							name="disableAnimations"
							checked={disableSounds}
							onChange={() => updateVariableInLocalStorage("disableSounds", !disableSounds)}
						/>
					</div>
				</div>
      </div>
    </div>
  );
};
