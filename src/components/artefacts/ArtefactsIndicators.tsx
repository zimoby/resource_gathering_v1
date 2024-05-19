import { Plane, Ring, Text } from "@react-three/drei";
import { useGameStore } from "../../store";
import { FadingEffect } from "../../effects/FadingEffectWrapper";
import { DoubleSide } from "three";
import { useMemo } from "react";
import { useCheckVariableRender } from "../../utils/functions";
import { ArtefactT } from "../../store/gameStateSlice";
import { FlickeringEffect } from "../../effects/FlickeringEffectWrapper";

const calculateOpacity = (
	filterCondition: (artefact: ArtefactT) => boolean,
	currentCoord: number,
	chunkCoord: keyof ArtefactT,
	artefacts: ArtefactT[]
): number => {
	const existedArtefacts: ArtefactT[] = artefacts.filter(filterCondition);
	if (existedArtefacts.length === 0) return 0;

	const closestDistance = Math.min(
		...existedArtefacts.map((artefact) => Math.abs(Number(artefact[chunkCoord]) - currentCoord))
	);

	const maxDistance: number = 3;
	const minOpacity: number = 0.1;
	const maxOpacity: number = 0.9;

	const opacity: number = Math.max(
		Math.min(
			maxOpacity,
			minOpacity + ((maxOpacity - minOpacity) * (maxDistance - closestDistance)) / maxDistance
		),
		minOpacity
	);

	console.log("opacity", { opacity });

	return opacity;
};

const dist = 11;

export const ArtefactsPlanesIndicators = () => {
  const { width, depth } = useGameStore((state) => state.mapParams);
  const artefacts = useGameStore((state) => state.artefacts);
  const currentLocation = useGameStore((state) => state.currentLocation);

  const artefactLeft = useMemo(
    () =>
      calculateOpacity(
        (artefact) => artefact.chunkX <= currentLocation.x,
        currentLocation.x,
        "chunkX",
				artefacts
      ),
    [artefacts, currentLocation.x]
  );

  const artefactTop = useMemo(
    () =>
      calculateOpacity(
        (artefact) => artefact.chunkY >= currentLocation.y,
        currentLocation.y,
        "chunkY",
				artefacts
      ),
    [artefacts, currentLocation.y]
  );

  const artefactRight = useMemo(
    () =>
      calculateOpacity(
        (artefact) => artefact.chunkX >= currentLocation.x,
        currentLocation.x,
        "chunkX",
				artefacts
      ),
    [artefacts, currentLocation.x]
  );

  const artefactBottom = useMemo(
    () =>
      calculateOpacity(
        (artefact) => artefact.chunkY <= currentLocation.y,
        currentLocation.y,
        "chunkY",
				artefacts
      ),
    [artefacts, currentLocation.y]
  );

  const artefactCenter = useMemo(
    () =>
      calculateOpacity(
        (artefact) =>
          artefact.chunkX === currentLocation.x && artefact.chunkY === currentLocation.y,
        currentLocation.x,
        "chunkX",
				artefacts
      ),
    [artefacts, currentLocation.x, currentLocation.y]
  );

  const planesConfig = [
    {
      position: [-width / 2 - dist, 0, 0],
      rotation: [-Math.PI / 2, 0, Math.PI / 2],
      opacity: artefactLeft,
    },
    { position: [0, 0, -depth / 2 - dist], rotation: [-Math.PI / 2, 0, 0], opacity: artefactBottom },
    {
      position: [width / 2 + dist, 0, 0],
      rotation: [-Math.PI / 2, 0, -Math.PI / 2],
      opacity: artefactRight,
    },
    {
      position: [0, 0, depth / 2 + dist],
      rotation: [-Math.PI / 2, 0, Math.PI],
      opacity: artefactTop,
    },
  ];

  return (
    <group position={[0, -0.3, 0]}>
      <Ring
        args={[width - 21, width - 19, 4]}
        position={[0, 1, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 4]}
      >
        <meshBasicMaterial
          side={DoubleSide}
          color={"#00ff00"}
          transparent
          opacity={artefactCenter}
        />
      </Ring>
			<FlickeringEffect appearingOnly={true}>
				{planesConfig.map((config, index) => (
					<Plane key={index} args={[width, 3]} position={config.position} rotation={config.rotation}>
						<meshBasicMaterial
							side={DoubleSide}
							color={"#ffffff"}
							transparent
							opacity={config.opacity}
						/>
					</Plane>
				))}
			</FlickeringEffect>
    </group>
  );
};
