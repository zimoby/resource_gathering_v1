import { Billboard, Html } from "@react-three/drei";
import { WarningBlock } from "./warningBlock";
import { useGameStore } from "../../../store";
import { SystemMessagePanelAlt } from "../SystemMessagePanel";
import { LevelsIndicators } from "../levelsIndicators";
import { FlickeringHtmlEffect } from "../../../effects/AppearingUiEffectWrapper";

export const CenterScreenPanel = () => {
  const showSettingsModal = useGameStore((state) => state.showSettingsModal);
  const animationFirstStage = useGameStore((state) => state.animationFirstStage);

  if (!animationFirstStage) return null;

  return (
    <>
      {!showSettingsModal && (
        <Billboard>
          <Html>
            <div
              className="fixed -z-10"
              style={{
                width: "calc(100vw - 25.5rem)",
                height: "calc(100vh - 13.5rem)",
                top: "calc(-50vh + 4.75rem)",
                left: "calc(-50vw + 12.75rem)",
              }}
            >
              <FlickeringHtmlEffect classStyles="w-full h-full">
                <div
                  className=" h-full w-full aug-border-yellow-500"
                  data-augmented-ui="border tl-2-clip-x br-2-clip-x --aug-border-bg"
                />
                <div
                  className="absolute bottom-3 right-0"
                >
                  <SystemMessagePanelAlt />
                </div>
                <LevelsIndicators />
                
              </FlickeringHtmlEffect>
            </div>
            <WarningBlock />
          </Html>
        </Billboard>
      )}
    </>
  );
};
