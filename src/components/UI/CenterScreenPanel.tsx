import { Billboard, Html } from "@react-three/drei"
import { WarningBlock } from "./warningBlock"
import { useGameStore } from "../../store"
import { SystemMessagePanelAlt } from "./SystemMessagePanel";


export const CenterScreenPanel = () => {
    const showSettingsModal = useGameStore((state) => state.showSettingsModal);

    return (
        <>
        { !showSettingsModal && <Billboard>
            <Html>
              <div
                className="fixed -z-10 border border-uilines"
                style={{
                  width: "calc(100vw - 25.5rem)",
                  height: "calc(100vh - 13.5rem)",
                  top: "calc(-50vh + 4.75rem)",
                  left: "calc(-50vw + 12.75rem)"
                }}
                // onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="absolute bottom-0 right-0"
                  // onClick={(e) => e.stopPropagation()}
                >
                  <SystemMessagePanelAlt />
                </div>
              </div>
              {/* bottom right corner */}
              <WarningBlock />
            </Html>
          </Billboard>}
        </>

    )
}