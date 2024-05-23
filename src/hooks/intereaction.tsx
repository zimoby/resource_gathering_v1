import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { Camera, Mesh, Raycaster, Vector2 } from "three";
import { useGameStore } from "../store/store";
import { ResourceType } from "../store/worldParamsSlice";
import { debounce, throttle } from "lodash";
import { useProcessBeacons } from "../components/beacons/beaconUtils";
import { getChunkCoordinates } from "../utils/functions";
import { useProcessArtefacts } from "../components/artefacts/artefactUtils";

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

const keyToVector: { [key: string]: { x: number; y: number } } = {
  'ArrowUp': { x: 0, y: -1 },
  'KeyW': { x: 0, y: -1 },
  'ArrowDown': { x: 0, y: 1 },
  'KeyS': { x: 0, y: 1 },
  'ArrowLeft': { x: -1, y: 0 },
  'KeyA': { x: -1, y: 0 },
  'ArrowRight': { x: 1, y: 0 },
  'KeyD': { x: 1, y: 0 }
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
  const [activeKeys, setActiveKeys] = useState({});

  const handleMousePosition = useCallback((event: MouseEvent) => {
    mouseEventRef.current = event;
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      
      if (keyToVector[event.code]) {
        setActiveKeys((prev) => ({ ...prev, [event.code]: true }));
      }
    
      const intersects = getIntersection(
        mouseEventRef.current || { clientX: 0, clientY: 0 },
        raycaster,
        meshRef.current,
        camera
      );

      switch (event.code) {
        case "ShiftLeft":
        case "ShiftRight":
          useGameStore.setState({ dynamicSpeed: 3 });
          break;
        case "Space":
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

    setActiveKeys((prev) => {
      const newKeys: { [key: string]: boolean } = { ...prev };
      delete newKeys[event.code];
      return newKeys;
    });

    switch (event.code) {
      case "ShiftLeft":
      case "ShiftRight":
        useGameStore.setState({ dynamicSpeed: 1 });
        break;
      case "Space":
        useGameStore.setState({ canPlaceBeacon: false });
        break;
    }
  }, []);

  useEffect(() => {
    const moveDirection = Object.entries(activeKeys).reduce((acc, [key, active]) => {
      if (active && keyToVector[key]) {
        acc.x += keyToVector[key].x;
        acc.y += keyToVector[key].y;
      }
      return acc;
    }, { x: 0, y: 0 });

    if (moveDirection.x !== 0 || moveDirection.y !== 0) {
      // console.log("moveDirection", moveDirection);
      useGameStore.setState({ moveDirection });
    }
  }, [activeKeys]);

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
  const addNewMessage = useGameStore((state) => state.addNewMessage);
  const costs = useGameStore((state) => state.costs);
  const playerPoints = useGameStore((state) => state.playerPoints);

  const throttledSetState = useRef(throttle((state) => {
    useGameStore.setState(state);
  }, 100)).current;

  const handleCanvasHover = useCallback(
    (event: { clientX: number; clientY: number; type: string }) => {
      if (!canPlaceBeacon || !meshRef.current) {
        if(playerPoints < costs.scanning.value) {
          addNewMessage("Not enough energy to scan");
        }
        return;
      }

      const intersects = getIntersection(
        { clientX: event.clientX, clientY: event.clientY },
        raycaster,
        meshRef.current,
        camera
      );

      if (intersects.length === 0) {
        return;
      }

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
        selectedChunk: getChunkCoordinates(currentPosition.x, currentPosition.y, width),
      });

      const isWithinRadius = checkArtefactInRadius({ point });

      if (event.type === "click") {
        if (isWithinRadius) {
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
        // useGameStore.setState({ canPlaceBeacon: false });
      }

    },
    [canPlaceBeacon, meshRef, raycaster, camera, playerPoints, costs.scanning.value, addNewMessage, resources, width, depth, throttledSetState, checkArtefactInRadius, addBeacon, offsetX, offsetY, takeArtefact]
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
