import { useSpring, easings } from "@react-spring/core";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export const useIncreasingSpeed = (
  initialSpeed = 0,
  goalSpeed = 1,
  increment = 0.01,
  startTime = 2,
) => {
  const speedRef = useRef(initialSpeed);
  const speedReached = useRef(false);
  const speedStarted = useRef(false);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (time > startTime && speedRef.current < goalSpeed) {
      speedStarted.current = true;
      speedRef.current = speedRef.current + increment;
    } else if (speedRef.current >= goalSpeed) {
      speedReached.current = true;
    }
  });

  return { speedRef, speedReached, speedStarted };
};

export const useIncreasingSpeed2 = ({
  initialValue = 0,
  goalValue = 1,
  duration = 1,
  easing = easings.easeInOutCubic,
}) => {
  const [valueAnimation, api] = useSpring(() => ({
    value: initialValue,
    config: { duration: duration * 1000, easing },
  }));

  const valueReached = useRef(false);
  const valueStarted = useRef(false);

  const startAnimation = () => {
    valueReached.current = false;
    valueStarted.current = true;
    api.stop();
    void api.start({
      from: { value: initialValue },
      to: { value: goalValue },
      config: { duration: duration * 1000, easing },
      onRest: () => {
        valueReached.current = true;
      },
    });
  };

  return { valueAnimation, valueReached, valueStarted, startAnimation };
};
