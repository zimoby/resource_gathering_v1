import { corpLogoSvg } from "../../assets/CorpLogo";
import { useGameStore } from "../../store/store";

export const CorpLogoPanel = () => {
  const opacity = useGameStore((state) => state.uiPanelsState.supportPanels.opacity);
  return (
    <div
    className="w-full h-24 border border-uilines text-xs  text-uitext"
    style={{ opacity }}
  >
    <div className="w-full h-full flex justify-center items-center fill-uilines">
      {corpLogoSvg}
    </div>
  </div>
  );
};
