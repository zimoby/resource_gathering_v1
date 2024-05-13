import { corpLogoSvg } from "../../assets/CorpLogo";

export const CorpLogoPanel = () => {
  return (
    <div
    className="w-full h-full border border-neutral-200 text-xs  text-neutral-200"
    // style={{ opacity: uiPanelsState.titlePanel.opacity}}
  >
    <div className="w-full h-full flex justify-center items-center">
      {corpLogoSvg}
    </div>

    {/* <div className="h-full w-full px-1 content-end orbitron text-2xl text-end uppercase text-neutral-200">
      {`Orion dynamics`}
    </div> */}
  </div>
  );
};
