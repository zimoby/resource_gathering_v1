import { useControls } from "leva";
import { useEffect } from "react";
import { useGameStore } from "../store";

export const useParamsSync = () => {
  // const mapParams = useGameStore((state) => state.mapParams);

  const { width, depth, resolution, scale, offsetX, offsetY, speed } = useControls({
    width: { value: 200, min: 1, max: 200 },
    depth: { value: 200, min: 1, max: 200 },
    resolution: { value: 3, min: 1, max: 10 },
    scale: { value: 50, min: 10, max: 100 },
    offsetX: { value: 0, min: -100, max: 100 },
    offsetY: { value: 0, min: -100, max: 100 },
		speed: { value: 0.1, min: 0, max: 0.5 },
  });

  useEffect(() => {
		useGameStore.setState({ mapParams: { width, depth, resolution, scale, offsetX, offsetY, speed } });
		// console.log("mapPgame store updated");
	}, [width, depth, resolution, scale, offsetX, offsetY, speed]);

	// useEffect(() => {
	// 	levaStore.set({ ...mapParams });
	// 	console.log("leva store updated");
	// }, [mapParams]);


};
