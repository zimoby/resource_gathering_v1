import { RefObject, useCallback, useEffect } from "react";
import { Camera, Mesh, Raycaster, Vector2 } from "three";
import useGamaStore, { ResourceType } from "../store";
import { debounce, throttle } from "lodash";
import { useProcessBeacons } from "../components/beacons/addBeacon";
import { getChunkCoordinates } from "./functions";

const getIntersection = (
  event: { clientX: number; clientY: number },
  raycaster: Raycaster,
  mesh: Mesh,
  camera: Camera
) => {
  const mouse = new Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(mesh);

  return intersects;
};

export const useKeyboardControls = (): void => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowUp":
      case "w":
        useGamaStore.setState({ moveDirection: { x: 0, y: -1 } });
        break;
      case "ArrowDown":
      case "s":
        useGamaStore.setState({ moveDirection: { x: 0, y: 1 } });
        break;
      case "ArrowLeft":
      case "a":
        useGamaStore.setState({ moveDirection: { x: -1, y: 0 } });
        break;
      case "ArrowRight":
      case "d":
        useGamaStore.setState({ moveDirection: { x: 1, y: 0 } });
        break;
      case "Shift":
        useGamaStore.setState({ dynamicSpeed: 3 });
        break;
      case " ":
        useGamaStore.setState({ canPlaceBeacon: true });
        break;
    }
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case "Shift":
        useGamaStore.setState({ dynamicSpeed: 1 });
        break;
      case " ":
        useGamaStore.setState({ canPlaceBeacon: false });
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);
};

export const useCanvasHover = ({ camera, raycaster, meshRef, resources }: {
  camera: Camera;
  raycaster: Raycaster;
  meshRef: RefObject<Mesh>;
  resources: { current: Array<ResourceType> };
}) => {
  const canPlaceBeacon = useGamaStore((state) => state.canPlaceBeacon);
  const { width, depth, offsetX, offsetY } = useGamaStore((state) => state.mapParams);
  const { addBeacon } = useProcessBeacons();

  const throttledSetState = throttle((state) => {
    useGamaStore.setState(state);
  }, 100);

  const handleCanvasHover = useCallback(
    (event: { clientX: number; clientY: number, type: string }) => {
      if (!canPlaceBeacon || !meshRef.current) {
        // useGamaStore.setState({ showResources: false });
        return;
      }

      const intersects = getIntersection(event, raycaster, meshRef.current, camera);

      if (intersects.length > 0) {
        const { point, face } = intersects[0];
        if (!face) return;

        const vertexIndex = face.a;
        const resource = resources.current[vertexIndex];

        debounce(() => {
          useGamaStore.setState({
            activePosition: point,
          });
        }, 100)();

        const currentPosition = {
          x: point.x + width / 2 + useGamaStore.getState().currentOffset.x,
          y: point.z + depth / 2 + useGamaStore.getState().currentOffset.y,
        };

        throttledSetState({
          selectedResource: resource,
          currentOffset: currentPosition,
          selectedChunk: getChunkCoordinates(currentPosition.x, currentPosition.y, width),
        });

        if (event.type === "click") {
          addBeacon({
            position: {
              x: point.x - offsetX,
              y: point.y,
              z: point.z - offsetY,
            },
            resource,
            currentChunk: getChunkCoordinates(currentPosition.x, currentPosition.y, width),
          });
          useGamaStore.setState({ canPlaceBeacon: false });
        }
      }
    },
    [canPlaceBeacon, meshRef, raycaster, camera, resources, width, depth, throttledSetState, addBeacon, offsetX, offsetY]
  );

  useEffect(() => {
    window.addEventListener("click", handleCanvasHover);
    window.addEventListener("mousemove", handleCanvasHover);

    return () => {
      window.removeEventListener("click", handleCanvasHover);
      window.removeEventListener("mousemove", handleCanvasHover);
      throttledSetState.cancel();
    };
  }, [handleCanvasHover, throttledSetState]);
};
