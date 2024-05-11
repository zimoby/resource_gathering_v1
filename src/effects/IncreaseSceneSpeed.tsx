import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

export const useIncreasingSpeed = (initialSpeed = 0, goalSpeed = 1, increment = 0.01, startTime = 2) => {
  const speedRef = useRef(initialSpeed);
  const speedReached = useRef(false);
  const speedStarted = useRef(false);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (time > startTime && speedRef.current < goalSpeed) {
      speedStarted.current = true;
      speedRef.current = Math.pow(speedRef.current, 1/1.1) + increment;
    } else if (speedRef.current >= goalSpeed) {
      speedReached.current = true;
    }

  });

  return { speedRef, speedReached, speedStarted };
};