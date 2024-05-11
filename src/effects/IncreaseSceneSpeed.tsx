import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

export const useIncreasingSpeed = (initialSpeed = 0, goalSpeed = 1, increment = 0.01, startTime = 2) => {
  const speedRef = useRef(initialSpeed);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (time > startTime && speedRef.current < goalSpeed) {
      speedRef.current += increment;
    }
  });

  return speedRef;
};