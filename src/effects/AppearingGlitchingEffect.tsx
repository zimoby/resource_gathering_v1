import { RefObject, useEffect } from "react";
import { Group } from "three";
import { useGameStore } from "../store/store";

export const useAppearingGlitchingEffect = ({
  disabled = false,
  groupRef,
  duration = 300,
  initialIntensity = 10,
}: {
  disabled: boolean;
  groupRef: RefObject<Group>;
  duration?: number;
  initialIntensity?: number;
}) => {
  const disableAnimations = useGameStore((state) => state.disableAnimations);

  useEffect(() => {
    if (disabled || disableAnimations) {
      return;
    }
    const group = groupRef.current;

    if (group) {
      const timeouts = new Set<number>();
      group.children.forEach((child) => {
        let lastToggle = 0;
        for (let i = 0; i < initialIntensity; i++) {
          lastToggle += Math.random() * duration;
          timeouts.add(
            setTimeout(() => {
              child.visible = !child.visible;
            }, lastToggle)
          );
        }
        child.visible = true;
      });
      return () => timeouts.forEach(clearTimeout);
    }
  }, [initialIntensity, duration, disabled, groupRef, disableAnimations]);
};
