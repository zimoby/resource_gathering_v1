import { useGameStore } from "../../../store/store";
import { BasicPanelWrapper } from "../BasicPanelWrapper";

export const CollectedAftefacts = () => {
  const artefactsCollectedByTypes = useGameStore((state) => state.artefactsCollectedByTypes);

  return (
    <BasicPanelWrapper
			titleText="Collected Artefacts:"
			height="h-32"
      width="w-fit"
		>
      <div className=" flex flex-row justify-center items-center divide-x divide-uilines">
				{Object.keys(artefactsCollectedByTypes).map((key, index) => (
					<div
						key={index}
						className="h-24 w-20 p-3 flex flex-col space-y-2 text-center justify-center items-center  hover:fill-neutral-900 "
						onClick={() => useGameStore.setState({ message: `Collected Artefacts: ${key}: ${artefactsCollectedByTypes[key]}` })}
					>
						{key === "usual" &&
							<svg className="size-7 fill-uilines " width="93" height="81" viewBox="0 0 93 81" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M46.5 0L92.8324 80.25H0.167641L46.5 0Z" />
							</svg>
						}
						{key === "rare" &&
							<svg className="size-10 fill-uilines " width="78" height="103" viewBox="0 0 78 103" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M39 0L77.9711 67.5H0.0288086L39 0Z"/>
								<path d="M39 103L0.0288107 35.5005L77.9711 35.5005L39 103Z"/>
							</svg>
						}

						{key === "legendary" &&
							<svg className="size-10 fill-uilines "  width="103" height="103" viewBox="0 0 103 103" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M51.5003 0L90.4714 67.5H12.5291L51.5003 0Z" />
								<path d="M103 51.5002L35.5005 90.4714L35.5005 12.5291L103 51.5002Z" />
								<path d="M51.5002 103L12.5291 35.5005L90.4714 35.5005L51.5002 103Z" />
								<path d="M0 51.5002L67.5 12.5291L67.5 90.4714L0 51.5002Z" />
							</svg>
						}
            <div className=" text-xs leading-3 uppercase">{key}</div>
            <div className=" text-xs leading-3">{(artefactsCollectedByTypes[key])}</div>
					</div>
				))}
      </div>
    </BasicPanelWrapper>
  );
};
