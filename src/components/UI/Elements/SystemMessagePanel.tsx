import TypingText from "../../../effects/TextEffectsWrapper";
import { useGameStore } from "../../../store/store";

export const SystemMessagePanelAlt = () => {
  const message = useGameStore((state) => state.message);

  return (
    <div className=" h-fit w-fit max-w-72 leading-4 border-l-4 bg-black/50 border-uilines pl-2 text-sm m-3">
      <TypingText text={message} speed={50} />
    </div>
  );
};
