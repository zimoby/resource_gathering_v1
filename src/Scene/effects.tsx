import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  HueSaturation,
} from "@react-three/postprocessing";
import { Vector2 } from "three";

export const EffectsCollection = () => {
  return (
    <EffectComposer multisampling={8}>
      <HueSaturation hue={0} saturation={0.4} />
      <Bloom
        luminanceThreshold={0}
        mipmapBlur
        luminanceSmoothing={0.0}
        intensity={1}
      />
      <ChromaticAberration
        offset={new Vector2(0, 0.003)}
        radialModulation={true}
        modulationOffset={0}
      />
      <Noise opacity={0.15} />
    </EffectComposer>
  );
};
