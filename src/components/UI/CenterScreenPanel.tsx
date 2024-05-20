import { Billboard, Html } from "@react-three/drei";
import { WarningBlock } from "./warningBlock";
import { useGameStore } from "../../store";
import { SystemMessagePanelAlt } from "./SystemMessagePanel";
import { maxLevel, minLevel } from "../../store/worldParamsSlice";

export const CenterScreenPanel = () => {
  const showSettingsModal = useGameStore((state) => state.showSettingsModal);
  const activePosition = useGameStore((state) => state.activePosition);

  const posHeightRange = Math.max(0, Math.min(100, ((activePosition.y - 1) - minLevel) * (100 / (maxLevel - minLevel))));

  return (
    <>
      {!showSettingsModal && (
        <Billboard>
          <Html>
            <div
              className="fixed -z-10 border border-uilines aug-border-yellow-500"
              style={{
                width: "calc(100vw - 25.5rem)",
                height: "calc(100vh - 13.5rem)",
                top: "calc(-50vh + 4.75rem)",
                left: "calc(-50vw + 12.75rem)",
              }}
              data-augmented-ui="border tl-2-clip-x br-2-clip-x --aug-border-bg"
              // onClick={(e) => e.stopPropagation()}
            >
              <div
                className="absolute bottom-3 right-0"
                // onClick={(e) => e.stopPropagation()}
              >
                <SystemMessagePanelAlt />
              </div>
              <div className="absolute top-2 right-2">
                <div className="flex flex-col space-y-1 justify-center items-center">
                  <p className="text-uitext">ZL</p>
                  <div
                    className=" h-28 w-3 border border-uilines"
                    style={{
                      background: `linear-gradient( to top, var(--color-uilines) 0%, var(--color-uilines) ${posHeightRange}%, rgba(255, 255, 255, 0) ${posHeightRange}%)`,
                      // opacity: `0.5`
                    }}
                  />
                </div>
              </div>
            </div>
            {/* bottom right corner */}
            <WarningBlock />
          </Html>
        </Billboard>
      )}
    </>
  );
};
