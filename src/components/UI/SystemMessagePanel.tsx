import TypingText from "../../effects/TextEffectsWrapper";
import { useGameStore } from "../../store";
import { BasicPanelWrapper } from "./BasicPanelWrapper";

export const SystemMessagePanel = () => {
  const opacity = useGameStore((state) => state.uiPanelsState.systemMessagePanel.opacity);
  const message = useGameStore((state) => state.message);

  return (
    <BasicPanelWrapper height="h-32" width="w-72" titleText="System Message" opacity={opacity}>
      <div className=" leading-4 text-sm">
        <TypingText text={message} />
      </div>
    </BasicPanelWrapper>
  )
};
