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
  GodRays,
} from "@react-three/postprocessing";

export const EffectsCollection = () => {
  return (
    <EffectComposer disableNormalPass multisampling={8}>
      {/* <FXAA /> */}
      {/* <GodRays sun={material} exposure={0.34} decay={0.8} blur /> */}
      <HueSaturation hue={0} saturation={0.6} />
      <Bloom luminanceThreshold={0} mipmapBlur luminanceSmoothing={0.0} intensity={1} />
      {/* <Bloom
        // blendFunction={AdditiveBlending}
        mipmapBlur={true}
        // radius={0.3}
        intensity={30}
        // radius={0}
        // luminanceThreshold={0.9}
        // luminanceSmoothing={1}
        // height={500}
      /> */}
      <ChromaticAberration offset={[0, 0.003]} radialModulation={true} />
      <Noise opacity={0.2} />

      {/* <Scanline
                      density={0.7}
                      opacity={0.2}
                    /> */}
    </EffectComposer>
  );
};
