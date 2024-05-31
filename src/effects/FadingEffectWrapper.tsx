import React, { useRef, useEffect, ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Material, Mesh, BufferGeometry } from "three";
import { useAppearingGlitchingEffect } from "./AppearingGlitchingEffect";
import { useGameStore } from "../store/store";

interface FadingEffectProps {
  children: ReactNode;
  disabled?: boolean;
  initialIntensity?: number;
  randomFrequency?: number;
  minOpacity?: number;
  maxOpacity?: number;
}

function setMeshOpacity(
  mesh: Mesh<BufferGeometry, Material | Material[]>,
  opacity: number,
) {
  if (Array.isArray(mesh.material)) {
    mesh.material.forEach((material) =>
      updateMaterialOpacity(material, opacity),
    );
  } else {
    updateMaterialOpacity(mesh.material, opacity);
  }
}

function updateMaterialOpacity(material: Material, opacity: number) {
  material.opacity = opacity;
  material.transparent = true;
}

export const FadingEffect: React.FC<FadingEffectProps> = ({
  children,
  disabled = false,
  initialIntensity = 6,
  randomFrequency = 0.01,
  minOpacity = 0.1,
  maxOpacity = 1,
}) => {
  const disableAnimations = useGameStore((state) => state.disableAnimations);
  const groupRef = useRef<Group>(null);

  useEffect(() => {
    const group = groupRef.current;
    if ((disabled || disableAnimations) && group) {
      group.children.forEach((child) => {
        if (child instanceof Mesh) {
          setMeshOpacity(
            child as Mesh<BufferGeometry, Material | Material[]>,
            maxOpacity,
          );
        }
      });
      return;
    }
  }, [disabled, disableAnimations, maxOpacity]);

  useAppearingGlitchingEffect({ disabled, groupRef, initialIntensity });

  useFrame(() => {
    const group = groupRef.current;

    if (disabled || disableAnimations) {
      return;
    }

    if (group) {
      group.children.forEach((child) => {
        if (Math.random() < randomFrequency && child instanceof Mesh) {
          setMeshOpacity(
            child as Mesh<BufferGeometry, Material | Material[]>,
            Math.random() * (maxOpacity - minOpacity) + minOpacity,
          );
        }
      });
    }
  });

  return <group ref={groupRef}>{children}</group>;
};
