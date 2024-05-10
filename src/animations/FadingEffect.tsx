import React, { useRef, useEffect, ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Material, Mesh } from "three";

interface FadingEffectProps {
  children: ReactNode;
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
  initialIntensity = 10,
  randomFrequency = 0.01,
  minOpacity = 0.1,
  maxOpacity = 1,
}) => {
  const groupRef = useRef<Group>(null);

  useEffect(() => {
    const group = groupRef.current;
    if (group) {
      const timeouts = new Set<number>();
      group.children.forEach(
        (child) => {
          let lastToggle = 0;
          for (let i = 0; i < initialIntensity; i++) {
            lastToggle += Math.random() * 1000;
            timeouts.add(
              setTimeout(() => {
                if (child instanceof Mesh) {
                  setMeshOpacity(child, Math.random() * (maxOpacity - minOpacity) + minOpacity);
                }
              }, lastToggle)
            );
          }
        }
      );
      return () => timeouts.forEach(clearTimeout);
    }
  }, [children, initialIntensity, minOpacity, maxOpacity]);

  useFrame(() => {
    const group = groupRef.current;
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
