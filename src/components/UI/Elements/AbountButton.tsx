import { useGameStore } from "../../../store/store";
import { BigButtons } from "./BigButtons";

export const AboutButton = () => {
  const updateStoreProperty = useGameStore(
    (state) => state.updateStoreProperty,
  );
  const opacity = useGameStore(
    (state) => state.uiPanelsState.supportPanels.opacity,
  );

  return (
    <div style={{ opacity }}>
      <BigButtons
        text="About"
        onClick={() => updateStoreProperty("showAboutModal", true)}
      />
    </div>
  );
};
