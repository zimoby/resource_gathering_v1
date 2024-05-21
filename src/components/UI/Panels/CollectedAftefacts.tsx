import { useGameStore } from "../../../store";
import { BasicPanelWrapper } from "../BasicPanelWrapper";

export const CollectedAftefacts = () => {
  const artefactsCollectedByTypes = useGameStore((state) => state.artefactsCollectedByTypes);

  return (
    <BasicPanelWrapper
			titleText="Collected Artefacts:"
			height="h-32"
      width="w-fit"
		>
      <div className=" flex flex-row justify-center items-center">
				{Object.keys(artefactsCollectedByTypes).map((key, index) => (
					<div
						key={index}
						className="h-24 w-24 p-3 flex flex-col space-y-2 text-center justify-center items-center hover:bg-uilines hover:text-neutral-900 cursor-pointer"
						onClick={() => useGameStore.setState({ message: `Collected Artefacts: ${key}: ${artefactsCollectedByTypes[key]}` })}
					>
						{key === "usual" && <div className=" text-4xl leading-3 my-3">🍆</div>}
						{key === "rare" && <div className=" text-4xl leading-3 my-3">🍅</div>}
						{key === "legendary" && <div className=" text-4xl leading-3 my-3">🍊</div>}
            <div className=" text-xs leading-3 uppercase">{key}</div>
            <div className=" text-xs leading-3">{(artefactsCollectedByTypes[key])}</div>
					</div>
				))}
      </div>
    </BasicPanelWrapper>
  );
};
