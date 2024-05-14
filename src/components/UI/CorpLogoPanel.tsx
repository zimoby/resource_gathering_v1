import { corpLogoSvg } from "../../assets/CorpLogo";

export const CorpLogoPanel = () => {
  return (
    <div
    className="w-full h-full border border-uilines text-xs  text-uitext"
    // style={{ opacity: uiPanelsState.titlePanel.opacity}}
  >
    <div className="w-full h-full flex justify-center items-center">
      {corpLogoSvg}
    </div>
  </div>
  );
};
