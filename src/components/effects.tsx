import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  HueSaturation,
} from "@react-three/postprocessing";

export const EffectsCollection = () => {
  return (
    <EffectComposer multisampling={8}>
      <HueSaturation hue={0} saturation={0.6} />
      <Bloom luminanceThreshold={0} mipmapBlur luminanceSmoothing={0.0} intensity={1} />
      <ChromaticAberration offset={[0, 0.003]} radialModulation={true} />
      <Noise opacity={0.2} />
    </EffectComposer>
  );
};
