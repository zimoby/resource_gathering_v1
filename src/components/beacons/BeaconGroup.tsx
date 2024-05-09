import useGamaStore from "../../store";
import { Cylinder, Sphere } from "@react-three/drei";
import { ConcentricCirclesAnimation } from "../concentricCircles";
import { useFrame } from "@react-three/fiber";
import { isOutOfBound } from "../../functions/functions";

export const BeaconGroup = ({ customSpeed, beaconRefs }) => {
  const firstStart = useGamaStore((state) => state.firstStart);
  const beacons = useGamaStore((state) => state.beacons);
  const direction = useGamaStore((state) => state.moveDirection);
  const { width, depth, offsetX, offsetY, speed } = useGamaStore((state) => state.mapParams);


  const deltaX = direction.x * (speed * customSpeed.current);
  const deltaY = direction.y * (speed * customSpeed.current);

  useFrame(() => {

    beaconRefs.current.forEach((beacon, index) => {
      const beaconObject = beacon.current; // Assuming each beacon is a child of the meshRef group
      if (beaconObject) {

        beaconObject.position.x -= deltaX;
        beaconObject.position.z -= deltaY;

        const visibilityBoundaries = !isOutOfBound({x: beaconObject.position.x, y: beaconObject.position.z}, width, depth, offsetX, offsetY);
        beaconObject.visible = visibilityBoundaries;
      }
    });

  });

  return (
    <group visible={firstStart}>
      {beacons.map((beacon, index) => (
        <group key={index}>
          <group position={[beacon.x, beacon.y, beacon.z]} ref={beaconRefs.current[index]}>
            <Sphere args={[1, 8, 8]} position={[0, 10, 0]} />
            <Cylinder args={[0.1, 0.1, 10, 4]} position={[0, 5, 0]} />
            <ConcentricCirclesAnimation />
          </group>
        </group>
      ))}
    </group>
  );
};
