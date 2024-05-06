import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Depth,
  DepthOfField,
  Noise,
  Scanline,
  Sepia,
  SMAA,
  FXAA,
  HueSaturation,
} from "@react-three/postprocessing";

export const EffectsCollection = () => {
  return (
    <EffectComposer>
      {/* <FXAA /> */}
      <HueSaturation hue={0} saturation={0.6} />
      <Bloom
        // blendFunction={AdditiveBlending}
        mipmapBlur={true}
        // radius={0.3}
        intensity={30}
        // radius={0}
        // luminanceThreshold={0.9}
        // luminanceSmoothing={1}
        // height={500}
      />
      <ChromaticAberration offset={[0, 0.003]} radialModulation={true} />
      <Noise opacity={0.2} />

      {/* <Scanline
                      density={0.7}
                      opacity={0.2}
                    /> */}
    </EffectComposer>
  );
};
