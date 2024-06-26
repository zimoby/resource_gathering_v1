import { useEffect } from "react";
import {
  SETTING_DISABLE_ANIMATIONS,
  SETTING_DISABLE_MUSIC,
  SETTING_DISABLE_SOUNDS,
  SETTING_EDUCATION_MODE,
  SETTING_INVERT_DIRECTION,
  SETTING_START_SCREEN,
  useGameStore,
} from "../../../store/store";

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
    <div className="w-3/4 h-fit py-1 flex justify-between items-center text-uitext text-lg hover:bg-uilines hover:text-neutral-900">
      <label htmlFor={label} className="pl-5 tracking-tight leading-4 mr-2">
        {label}
      </label>
      <input
        type="checkbox"
        className="mr-5"
        id={label}
        name={label}
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
};

export const SettingsModal = () => {
  const disableAnimations = useGameStore((state) => state.disableAnimations);
  const disableSounds = useGameStore((state) => state.disableSounds);
  const disableMusic = useGameStore((state) => state.disableMusic);
  const showSettingsModal = useGameStore((state) => state.showSettingsModal);
  const startScreen = useGameStore((state) => state.startScreen);
  const invertDirection = useGameStore((state) => state.invertDirection);
  const educationMode = useGameStore((state) => state.educationMode);

  const updateStoreProperty = useGameStore(
    (state) => state.updateStoreProperty,
  );
  const updateVariableInLocalStorage = useGameStore(
    (state) => state.updateVariableInLocalStorage,
  );

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        updateStoreProperty("showSettingsModal", false);
      }
    };

    if (showSettingsModal) {
      window.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [showSettingsModal, updateStoreProperty]);

  return (
    <div
      className="fixed w-full h-full flex justify-center items-center z-50 bg-black/50 "
      style={{ display: showSettingsModal ? "flex" : "none" }}
    >
      <div
        className="relative bg-black/80 w-96 h-fit flex flex-col  border border-uilines aug-border-yellow-500"
        data-augmented-ui={`border tl-2-clip-x br-2-clip-x --aug-border-bg`}
      >
        <div className="absolute bottom-1.5 left-1.5 size-5 border-l-uilines border-b-uilines border-b-2 border-l-2" />
        <div className=" flex justify-end items-center">
          <div
            className="flex justify-center items-center size-8 text-uitext cursor-pointer hover:bg-uilines hover:text-neutral-900"
            onClick={() => updateStoreProperty("showSettingsModal", false)}
          >
            <div className=" text-4xl rotate-45 text-center">+</div>
          </div>
        </div>
        <div className="orbitron w-full h-8 flex justify-center bg-uilines items-center text-neutral-900 text-2xl">
          Settings
        </div>
        <div className=" w-full mb-8 mt-6 flex flex-col justify-center items-center text-uitext text-2xl">
          <div className="w-full mb-3 flex flex-col justify-center items-center">
            <ToggleButton
              label="Show start screen"
              checked={startScreen}
              onChange={() =>
                updateVariableInLocalStorage(SETTING_START_SCREEN, !startScreen)
              }
            />
            <ToggleButton
              label="Show education"
              checked={educationMode}
              onChange={() =>
                updateVariableInLocalStorage(
                  SETTING_EDUCATION_MODE,
                  !educationMode,
                )
              }
            />
          </div>
          <div className="w-full mb-3 flex flex-col justify-center items-center">
            <ToggleButton
              label="Invert keys direction"
              checked={invertDirection}
              onChange={() =>
                updateVariableInLocalStorage(
                  SETTING_INVERT_DIRECTION,
                  !invertDirection,
                )
              }
            />
          </div>
          <div className="w-full mb-3 flex flex-col justify-center items-center">
            <ToggleButton
              label="Disable Animations"
              checked={disableAnimations}
              onChange={() =>
                updateVariableInLocalStorage(
                  SETTING_DISABLE_ANIMATIONS,
                  !disableAnimations,
                )
              }
            />
            <ToggleButton
              label="Disable Sound"
              checked={disableSounds}
              onChange={() =>
                updateVariableInLocalStorage(
                  SETTING_DISABLE_SOUNDS,
                  !disableSounds,
                )
              }
            />
            <ToggleButton
              label="Disable Music"
              checked={disableMusic}
              onChange={() =>
                updateVariableInLocalStorage(
                  SETTING_DISABLE_MUSIC,
                  !disableMusic,
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
