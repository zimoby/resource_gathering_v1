import { useGameStore } from "../../../store/store";
import { BigButtons } from "./BigButtons";

export const SettingsButton = () => {
  const updateStoreProperty = useGameStore(
    (state) => state.updateStoreProperty,
  );
  const opacity = useGameStore(
    (state) => state.uiPanelsState.settingsButton.opacity,
  );

  return (
    <div style={{ opacity }}>
      <BigButtons
        text="Settings"
        onClick={() => updateStoreProperty("showSettingsModal", true)}
      />
    </div>
  );
};
