import { useGameStore } from "../../store";

import "./linearAnimation.css";
import { BigButtons } from "./BigButtons";
import { useCallback } from "react";

export const FlyToNewWorld = () => {
  const animationFirstStage = useGameStore((state) => state.animationFirstStage);
  const decreasePlayerPoints = useGameStore((state) => state.decreasePlayerPoints);
  const playerPoints = useGameStore((state) => state.playerPoints);
  const costs = useGameStore((state) => state.costs);

  const moveToTheNewWorld = useCallback(() => {
    if (playerPoints >= costs.flyToNewWorld.value) {
      decreasePlayerPoints(costs.flyToNewWorld.value);
      useGameStore.getState().setMapAnimationState("shrinking");
    } else {
      useGameStore.setState({
        message: `Not enough energy to move to the new world. Need ${costs.flyToNewWorld.value} energy`,
      });
    }
  }, [costs, decreasePlayerPoints, playerPoints]);

  if (!animationFirstStage) return null;

  return <BigButtons text="New World" onClick={moveToTheNewWorld} />;
};
