import { useEffect, useRef } from "react";
import { useGameStore } from "../store/store";

const directions = [
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: -1, y: 0 },
];

export const useAutoPilot = () => {
  const currentLocation = useGameStore((state) => state.currentLocation);
  const autoPilot = useGameStore((state) => state.autoPilot);
  const prevLocation = useRef(currentLocation);

  useEffect(() => {
    const randomMoveDirection = () => {
      const randomDirection =
        directions[Math.floor(Math.random() * directions.length)];
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
