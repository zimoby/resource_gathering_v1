import { RefObject, useCallback, useEffect, useRef } from "react";
import { Camera, Mesh, Raycaster, Vector2 } from "three";
import { useGameStore } from "../store";
import { ResourceType } from "../store/worldParamsSlice";
import { debounce, throttle } from "lodash";
import { useProcessBeacons } from "../components/beacons/beaconUtils";
import { consoleLog, getChunkCoordinates } from "../utils/functions";
import { useProcessArtefacts } from "../components/artefacts/artefactUtils";
import { ArtefactT } from "../store/gameStateSlice";


const getIntersection = (
  event: { clientX: number; clientY: number },
  raycaster: Raycaster,
  mesh: Mesh | null,
  camera: Camera
) => {
  const mouse = new Vector2();
  if (!event) return [];
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  if (mesh) {
    const intersects = raycaster.intersectObject(mesh);
    return intersects;
  } else {
    return [];
  }
};

export const useKeyboardControls = ({
  meshRef,
  camera,
  raycaster,
}: {
  camera: Camera;
  raycaster: Raycaster;
  meshRef: RefObject<Mesh>;
}): void => {
  const canPlaceBeacon = useGameStore((state) => state.canPlaceBeacon);
  const mouseEventRef = useRef<MouseEvent | null>(null);

  const handleMousePosition = useCallback((event: MouseEvent) => {
    mouseEventRef.current = event;
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const intersects = getIntersection(
        mouseEventRef.current || { clientX: 0, clientY: 0 },
        raycaster,
        meshRef.current,
        camera
      );

      switch (event.key) {
        case "ArrowUp":
        case "w":
          useGameStore.setState({ moveDirection: { x: 0, y: -1 } });
          break;
        case "ArrowDown":
        case "s":
          useGameStore.setState({ moveDirection: { x: 0, y: 1 } });
          break;
        case "ArrowLeft":
        case "a":
          useGameStore.setState({ moveDirection: { x: -1, y: 0 } });
          break;
        case "ArrowRight":
        case "d":
          useGameStore.setState({ moveDirection: { x: 1, y: 0 } });
          break;
        case "Shift":
          useGameStore.setState({ dynamicSpeed: 3 });
          break;
        case " ":
          useGameStore.setState({ canPlaceBeacon: true });

          if (intersects.length > 0 && !canPlaceBeacon) {
            const { point, face } = intersects[0];
            if (!face) return;

            useGameStore.setState({
              activePosition: point,
            });
          }

          break;
      }
    },
    [camera, canPlaceBeacon, meshRef, raycaster]
  );

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case "Shift":
        useGameStore.setState({ dynamicSpeed: 1 });
        break;
      case " ":
        useGameStore.setState({ canPlaceBeacon: false });
        // console.log("Space key up", mouseEventRef.current);
        // setSpaceKeyPressed(false);
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMousePosition);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMousePosition);
    };
  }, [handleKeyDown, handleKeyUp, handleMousePosition]);
};

export const useCanvasHover = ({
  camera,
  raycaster,
  meshRef,
  resources,
}: {
  camera: Camera;
  raycaster: Raycaster;
  meshRef: RefObject<Mesh>;
  resources: { current: Array<ResourceType> };
}) => {
  const canPlaceBeacon = useGameStore((state) => state.canPlaceBeacon);
  const { width, depth, offsetX, offsetY } = useGameStore((state) => state.mapParams);
  const { addBeacon } = useProcessBeacons();
  const { takeArtefact, checkArtefactInRadius } = useProcessArtefacts();

  const throttledSetState = throttle((state) => {
    useGameStore.setState(state);
  }, 100);

  const handleCanvasHover = useCallback(
    (event: { clientX: number; clientY: number; type: string }) => {
      // mousePositionRef.current = { x: event.clientX, y: event.clientY };

      // const reltimeIntersect = getIntersection(event, raycaster, meshRef.current, camera);
      // if (reltimeIntersect.length > 0) {
      //   console.log("reltimeIntersect", canPlaceBeacon);
      //   const { point, face } = reltimeIntersect[0];
      //   if (!face) return;
      //   debounce(() => {
      //     useGameStore.setState({
      //       activePosition: point,
      //     });
      //   }, 100)();
      // }

      // console.log("mouse", mousePositionRef.current);
      if (!canPlaceBeacon || !meshRef.current) {
        // useGameStore.setState({ showResources: false });
        return;
      }

      const intersects = getIntersection(
        { clientX: event.clientX, clientY: event.clientY },
        raycaster,
        meshRef.current,
        camera
      );

      if (intersects.length > 0) {
        const { point, face } = intersects[0];
        if (!face) return;

        const vertexIndex = face.a;
        const resource = resources.current[vertexIndex];

        debounce(() => {
          useGameStore.setState({
            activePosition: point,
          });
        }, 100)();

        const { currentOffset } = useGameStore.getState();

        const currentPosition = {
          x: point.x + width / 2 + currentOffset.x,
          y: point.z + depth / 2 + currentOffset.y,
        };
        
        throttledSetState({
          selectedResource: resource,
          // currentOffset: currentPosition,
          selectedChunk: getChunkCoordinates(currentPosition.x, currentPosition.y, width),
        });

        // consoleLog("selectedResource", relativeChunkPosition);

        const isWithinRadius = checkArtefactInRadius({ point });


        if (event.type === "click") {
          if (isWithinRadius) {
            // consoleLog("takeArtefact", isWithinRadius);
            takeArtefact({ artefactId: isWithinRadius.id });
            return;
          }

          addBeacon({
            position: {
              x: point.x - offsetX,
              y: point.y,
              z: point.z - offsetY,
            },
            resource,
            currentChunk: getChunkCoordinates(currentPosition.x, currentPosition.y, width),
          });
          useGameStore.setState({ canPlaceBeacon: false });
        }
      }
    },
    [canPlaceBeacon, meshRef, raycaster, camera, resources, width, depth, throttledSetState, checkArtefactInRadius, addBeacon, offsetX, offsetY, takeArtefact]
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
