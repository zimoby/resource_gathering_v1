import { useEffect, useRef, ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { useAppearingGlitchingEffect } from "./AppearingGlitchingEffect";
import { useGameStore } from "../store/store";

interface FlickeringEffectProps {
  children: ReactNode;
  disabled?: boolean;
  appearingOnly?: boolean;
  initialIntensity?: number;
  randomFrequency?: number;
  duration?: number;
}

export const FlickeringEffect: React.FC<FlickeringEffectProps> = ({
  children,
  disabled = false,
  appearingOnly = false,
  initialIntensity = 10,
  randomFrequency = 0.01,
  duration = 100,
}) => {
  const groupRef = useRef<Group>(null);
  const disableAnimations = useGameStore((state) => state.disableAnimations);

  useEffect(() => {
    const group = groupRef.current;
    if ((disabled || disableAnimations) && group) {
      group.children.forEach((child) => {
        child.visible = true;
      });
      return;
    }
  }, [disableAnimations, disabled]);

	useAppearingGlitchingEffect({ disabled, groupRef, duration, initialIntensity });

  useFrame(() => {
    if (appearingOnly || (disabled || disableAnimations)) return;
    const group = groupRef.current;

    if (group) {
      group.children.forEach((child) => {
        if (Math.random() < randomFrequency) {
          child.visible = !child.visible;
        }
      });
    }
  });

  return <group ref={groupRef}>{children}</group>;
};
