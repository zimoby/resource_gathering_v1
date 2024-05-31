import { Billboard, Html } from "@react-three/drei";
import { WarningBlock } from "./warningBlock";
import { useGameStore } from "../../../store/store";
import { SystemMessagePanelAlt } from "../Elements/SystemMessagePanel";
import { LevelsIndicators } from "../Elements/levelsIndicators";
import { FlickeringHtmlEffect } from "../../../effects/AppearingUiEffectWrapper";
import { DroneMoveAngleUI } from "../../drone/droneMoveAngle";
import { useModalPriority } from "../../../hooks/modalPriority";
import { PlanetChunks } from "../Elements/planetChunks";
import { EducationSteps } from "../Elements/eduSteps";
import { DirectionIndicators } from "../Elements/directionIndicators";

export const CenterScreenPanel = () => {
  const animationFirstStage = useGameStore(
    (state) => state.animationFirstStage,
  );

  const showModal = useModalPriority();

  if (!animationFirstStage) return null;

  return (
    <>
      {!showModal && (
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
                <div className="absolute bottom-3 right-0">
                  <SystemMessagePanelAlt />
                </div>
                <div className="absolute left-1 top-6 flex flex-row items-start justify-end gap-3 p-2">
                  <EducationSteps />
                </div>
                <div className="absolute top-0 right-0 flex flex-row items-start justify-end gap-3 p-2">
                  <DroneMoveAngleUI />
                  <LevelsIndicators />
                </div>
                <div className="absolute bottom-0 left-0 flex flex-row items-end justify-end gap-3 p-5">
                  <PlanetChunks />
                  <DirectionIndicators />
                </div>
              </FlickeringHtmlEffect>
            </div>
            <WarningBlock />
          </Html>
        </Billboard>
      )}
    </>
  );
};
