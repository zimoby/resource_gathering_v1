import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../store/store";
import { BeaconGroup } from "../components/beacons/BeaconGroup";
import { Terrain } from "../components/terrain/Terrain";
import { BasicGridShader } from "../components/gfx/BasicGridShader";
import { Color } from "three";
import { FadingEffect } from "../effects/FadingEffectWrapper";
import { useIncreasingSpeed2 } from "../effects/IncreaseSceneSpeed";
import { PlaneTest } from "../components/gfx/pulsingAreaTest";
import { RulersFourSides } from "../components/gfx/RulersFourSides";
import { ArtifactsGroup } from "../components/artifacts/ArtifactsGroup";

export const Map = () => {
  const firstStart = useGameStore((state) => state.firstStart);
  const updateMapSize = useGameStore((state) => state.updateMapSize);
  const animationFirstStage = useGameStore(
    (state) => state.animationFirstStage,
  );
  const mapAnimationState = useGameStore((state) => state.mapAnimationState);
  const regenerateWorld = useGameStore((state) => state.regenerateWorld);
  const setMapAnimationState = useGameStore(
    (state) => state.setMapAnimationState,
  );
  const terrainAppearing = useGameStore((state) => state.terrainAppearing);

  const { valueAnimation, valueReached, valueStarted, startAnimation } =
    useIncreasingSpeed2({ goalValue: 100 });

  const {
    valueAnimation: valueAnimationDecr,
    valueReached: valueReachedDecr,
    valueStarted: valueStartedDecr,
    startAnimation: startAnimationDecr,
  } = useIncreasingSpeed2({ initialValue: 100, goalValue: 0 });

  useFrame(() => {
    if (!terrainAppearing && !valueReached.current && valueStarted.current) {
      useGameStore.setState({ terrainAppearing: true });
    } else if (
      terrainAppearing &&
      valueReached.current &&
      !animationFirstStage
    ) {
      useGameStore.setState({ animationFirstStage: true });
    }

    if (mapAnimationState === "shrinking" && !valueStartedDecr.current) {
      valueReached.current = false;
      valueStarted.current = false;
      startAnimationDecr();
    } else if (
      mapAnimationState === "shrinking" &&
      !valueReachedDecr.current &&
      valueStartedDecr.current
    ) {
      updateMapSize(valueAnimationDecr.value.get());
    } else if (mapAnimationState === "shrinking" && valueReachedDecr.current) {
      regenerateWorld();
      setMapAnimationState("enlarging");
    } else if (mapAnimationState === "enlarging" && !valueStarted.current) {
      startAnimation();
      useGameStore.setState({ resetValues: true });
    } else if (
      mapAnimationState === "enlarging" &&
      !valueReached.current &&
      valueStarted.current
    ) {
      updateMapSize(valueAnimation.value.get());
    } else if (mapAnimationState === "enlarging" && valueReached.current) {
      setMapAnimationState("idle");
      valueReachedDecr.current = false;
      valueReached.current = false;
      valueStartedDecr.current = false;
      valueStarted.current = false;
    }
  });

  return (
    <group visible={firstStart}>
      <BeaconGroup />
      <ArtifactsGroup />
      <FadingEffect>
        <Terrain />
      </FadingEffect>
      <RulersFourSides />
      <BasicGridShader position={[0, 0, 0]} />
      <PlaneTest position={[0, -12, 0]} color={new Color(0x1586e9)} />
    </group>
  );
};
