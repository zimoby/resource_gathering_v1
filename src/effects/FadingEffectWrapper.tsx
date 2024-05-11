import React, { useRef, useEffect, ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Material, Mesh } from "three";
import { useAppearingGlitchingEffect } from "./AppearingGlitchingEffect";

interface FadingEffectProps {
  children: ReactNode;
  disabled?: boolean;
  initialIntensity?: number;
  randomFrequency?: number;
  minOpacity?: number;
  maxOpacity?: number;
}

function setMeshOpacity(mesh: Mesh, opacity: number) {
  if (Array.isArray(mesh.material)) {
    mesh.material.forEach((material) => updateMaterialOpacity(material, opacity));
  } else {
    updateMaterialOpacity(mesh.material, opacity);
  }
}

function updateMaterialOpacity(material: Material, opacity: number) {
  material.opacity = opacity;
  material.transparent = true;
}

const FadingEffect: React.FC<FadingEffectProps> = ({
  children,
  disabled = false,
  initialIntensity = 6,
  randomFrequency = 0.01,
  minOpacity = 0.1,
  maxOpacity = 1,
}) => {
  const groupRef = useRef<Group>(null);

  useEffect(() => {
    const group = groupRef.current;
    if (disabled && group) {
      group.children.forEach((child) => {
        if (child instanceof Mesh) {
          setMeshOpacity(child, maxOpacity);
        }
      });
      return;
    }
  }, [disabled, maxOpacity]);

  useAppearingGlitchingEffect({ disabled, groupRef, initialIntensity });

  useFrame(() => {
    const group = groupRef.current;

    if (disabled) {
      return;
    }

    if (group) {
      group.children.forEach((child) => {
        if (Math.random() < randomFrequency && child instanceof Mesh) {
          setMeshOpacity(child, Math.random() * (maxOpacity - minOpacity) + minOpacity);
        }
      });
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

export default FadingEffect;
