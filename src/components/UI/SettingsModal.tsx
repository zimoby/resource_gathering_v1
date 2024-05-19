import { useGameStore } from "../../store";

const ToggleButton = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="w-2/3 h-fit flex justify-between items-center text-uitext text-lg">
      <label htmlFor={label} className="text-uitext">
        {label}
      </label>
      <input type="checkbox" id={label} name={label} checked={checked} onChange={onChange} />
    </div>
  );
};

export const SettingsModal = () => {
  const disableAnimations = useGameStore((state) => state.disableAnimations);
  const disableSounds = useGameStore((state) => state.disableSounds);
  const showSettingsModal = useGameStore((state) => state.showSettingsModal);
  const startScreen = useGameStore((state) => state.startScreen);
  const invertDirection = useGameStore((state) => state.invertDirection);

  const updateStoreProperty = useGameStore((state) => state.updateStoreProperty);
  const updateVariableInLocalStorage = useGameStore((state) => state.updateVariableInLocalStorage);

  return (
    <div
      className="fixed  w-full h-full flex justify-center items-center z-50 bg-black/50 "
      style={{ display: showSettingsModal ? "flex" : "none" }}
    >
      <div
        className="bg-black/80 w-96 h-fit flex flex-col px-1 py-2 border border-uilines"
        style={{}}
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
					<ToggleButton
						label="Show start screen"
						checked={startScreen}
						onChange={() => updateVariableInLocalStorage("startScreen", !startScreen)}
					/>
					<ToggleButton
						label="Invert keys direction"
						checked={invertDirection}
						onChange={() => updateVariableInLocalStorage("invertDirection", !invertDirection)}
					/>
					<ToggleButton
						label="Disable Animations"
						checked={disableAnimations}
						onChange={() => updateVariableInLocalStorage("disableAnimations", !disableAnimations)}
					/>
					<ToggleButton
						label="Disable Sound"
						checked={disableSounds}
						onChange={() => updateVariableInLocalStorage("disableSounds", !disableSounds)}
					/>
        </div>
      </div>
    </div>
  );
};
