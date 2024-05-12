import { useSpring, easings } from '@react-spring/core';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';

export const useIncreasingSpeed = (initialSpeed = 0, goalSpeed = 1, increment = 0.01, startTime = 2) => {
  const speedRef = useRef(initialSpeed);
  const speedReached = useRef(false);
  const speedStarted = useRef(false);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    if (time > startTime && speedRef.current < goalSpeed) {
      // consoleLog("time:", {time});
      speedStarted.current = true;
      speedRef.current = speedRef.current + increment;
      // speedRef.current = Math.pow(speedRef.current, 1) + increment;
      // speedRef.current = Math.pow(speedRef.current, 1/1.1) + increment;
    } else if (speedRef.current >= goalSpeed) {
      speedReached.current = true;
    }

  });

  return { speedRef, speedReached, speedStarted };
};


export const useIncreasingSpeed2 = (initialValue = 0, goalValue = 1, duration = 1, startTime = 2) => {
  const [valueAnimation, api] = useSpring(() => ({
    value: initialValue,
    config: { duration: duration * 1000, easing: easings.easeInOutCubic},
    onRest: () => {
      valueReached.current = true;
    },
  }));

  const valueReached = useRef(false);
  const valueStarted = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      valueStarted.current = true;
      api.start({ value: goalValue });
    }, startTime * 1000);

    return () => clearTimeout(timeout);
  }, [api, goalValue, startTime]);

  return { valueAnimation, valueReached, valueStarted };
};