import { useEffect, useRef } from "react";
import { useGameStore } from "../store/store";
import { movementDirections } from "../store/gameStateSlice";

export const useAutoPilot = () => {
  const currentLocation = useGameStore((state) => state.currentLocation);
  const autoPilot = useGameStore((state) => state.autoPilot);
  const prevLocation = useRef(currentLocation);

  useEffect(() => {
    const randomMoveDirection = () => {
      const randomDirection =
        movementDirections[
          Math.floor(Math.random() * movementDirections.length)
        ];
      useGameStore.setState({ moveDirection: randomDirection });
    };

    if (!autoPilot) return;

    if (
      currentLocation.x !== prevLocation.current.x ||
      currentLocation.y !== prevLocation.current.y
    ) {
      randomMoveDirection();
      prevLocation.current = currentLocation;
    }
  }, [autoPilot, currentLocation]);
};
