import { useRef, useEffect } from "react";
import { Raycaster, Vector2 } from "three";
import useGamaStore from "./store";
import { useControls } from "leva";
import { debounce } from "lodash";
import { addBeacon } from "./components/beacons/addBeacon";
import { getChunkCoordinates } from "./functions/functions";


const getIntersection = (event: { clientX: number; clientY: number; }, raycaster: Raycaster, meshRef: any, camera) => {
    const mouse = new Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
  
    // console.log("Mouse:", event.clientX, event.clientY);
  
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(meshRef.current);
  
    return intersects;
  }
  

export const useKeyboardControls = ({
  customSpeed, raycaster, meshRef, camera
}: {
  customSpeed: {
    current: number;
  };
  raycaster: Raycaster;
  meshRef: any;
  camera: any;
}): void => {
  // const mousePosition = useRef();
  // const direction = useGamaStore((state) => state.moveDirection);

  // useEffect(() => {
  //   const handleMouseMove = (event) => {
  //     const newEvent = { clientX: event.clientX, clientY: event.clientY };
  //     // console.log("Mouse position:", newEvent);
  //     mousePosition.current = newEvent ;
  //   };
  //   window.addEventListener('mousemove', handleMouseMove);
  //   return () => {
  //     window.removeEventListener('mousemove', handleMouseMove);
  //   };
  // }, []);

  useEffect(() => {
    const handleKeyDown = (event: { key: any; }) => {
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
          customSpeed.current = 3;
          break;
        case " ":
          useGamaStore.setState({ canPlaceBeacon: true });
          break;
      }


    //   if (mousePosition.current) {
    //     // console.log("Mouse position:", mousePosition.current);
    //     const intersects = getIntersection(mousePosition.current, raycaster, meshRef, camera);
    //     if (intersects.length > 0) {
    //       const point = intersects[0].point;
    //       const chunk = getChunkCoordinates(point.x, point.z, 100);
    //       // console.log("Chunk:", chunk);
    //       useGamaStore.setState({ currentLocation: chunk });
    //     }
    //     // console.log("Camera position:", {intersects});
    //   }
    //   console.log("Mouse position:", mousePosition.current);
    };


    const handleKeyUp = (event: { key: any; }) => {
      switch (event.key) {
        case "Shift":
          customSpeed.current = 1;
          break;
        case " ":
          useGamaStore.setState({ canPlaceBeacon: false });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // return { canPlaceBeacon, setCanPlaceBeacon };
};

export const useCanvasHover = ({ camera, raycaster, meshRef, resources }) => {
  const canPlaceBeacon = useGamaStore((state) => state.canPlaceBeacon);
  const currentOffset = useGamaStore((state) => state.currentOffset);
  // use hover only when placing beacon
  const { offsetX, offsetY, width, depth } = useControls({
    width: { value: 100, min: 1, max: 200 },
    depth: { value: 100, min: 1, max: 200 },
    offsetX: { value: 0, min: -100, max: 100 },
    offsetY: { value: 0, min: -100, max: 100 },
  });

  // const debounceUpdateActivePosition = useCallback(
  //   debounce((activePosition) => {
  //     useGamaStore.setState({ activePosition });
  //   }, 50),
  //   []
  // );
  useEffect(() => {
    const handleCanvasHover = (event: { clientX: number; clientY: number; }) => {
      if (!canPlaceBeacon) {
        // setScanningArea(null);
        useGamaStore.setState({ showResources: false });
        return;
      }

      // const mouse = new Vector2(
      //   (event.clientX / window.innerWidth) * 2 - 1,
      //   -(event.clientY / window.innerHeight) * 2 + 1
      // );
      // raycaster.setFromCamera(mouse, camera);
      // const intersects = raycaster.intersectObject(meshRef.current);
      const intersects = getIntersection(event, raycaster, meshRef, camera);

      if (intersects.length > 0) {
        const vertexIndex = intersects[0].face.a;
        const resource = resources.current[vertexIndex];

        // useGamaStore.setState({ selectedResource: resource, activePosition: intersects[0].point, showResources: true});
        const calcCurrentPosition = {
          x: intersects[0].point.x + width / 2 + currentOffset.x,
          y: intersects[0].point.z + depth / 2 + currentOffset.y,
        };

        // const selectedChunk = getChunkCoordinates(calcCurrentPosition.x, calcCurrentPosition.y, width);
        useGamaStore.setState({ selectedResource: resource, showResources: true, currentOffset: calcCurrentPosition });

        // console.log("Resource:", getChunkCoordinates(calcCurrentPosition.x, calcCurrentPosition.y, width));
        // console.log("Resource:", getChunkCoordinates(intersects[0].point.x - currentOffset.x, intersects[0].point.z - currentOffset.y, width));
        // console.log("Intersects:", getChunkCoordinates(intersects[0].point.x, intersects[0].point.z, width));
        // debounceUpdateActivePosition(intersects[0].point);
        debounce(() => {
          useGamaStore.setState({ activePosition: intersects[0].point });
        }, 100)();

      }
    };

    const handleCanvasClick = (event: { clientX: number; clientY: number; }) => {
      if (!canPlaceBeacon) return;

      // const mouse = new Vector2(
      //   (event.clientX / window.innerWidth) * 2 - 1,
      //   -(event.clientY / window.innerHeight) * 2 + 1
      // );
      // raycaster.setFromCamera(mouse, camera);
      // const intersects = raycaster.intersectObject(meshRef.current);
      const intersects = getIntersection(event, raycaster, meshRef, camera);

      if (intersects.length > 0) {
        // useGamaStore.setState({ activePosition: intersects[0].point });
        // console.log("Intersects:", getChunkCoordinates(intersects[0].point.x, intersects[0].point.z, width));
        if (intersects[0].face) {
          const vertexIndex = intersects[0].face.a;
          const selectedResource = resources.current[vertexIndex];
          useGamaStore.setState({ selectedResource: selectedResource });

          const calcCurrentPosition = {
            x: intersects[0].point.x + width / 2 + currentOffset.x,
            y: intersects[0].point.z + depth / 2 + currentOffset.y,
          };

          // console.log("Resource:", getChunkCoordinates(calcCurrentPosition.x, calcCurrentPosition.y, width));
          const chunkCoordinates = getChunkCoordinates(calcCurrentPosition.x, calcCurrentPosition.y, width);

          // addBeacon(intersects[0].point, selectedResource, offsetX, offsetY);
          addBeacon({
            position: {
              x: intersects[0].point.x - offsetX,
              y: intersects[0].point.y,
              z: intersects[0].point.z - offsetY,
            },
            resource: selectedResource,
            currentChunk: {
              x: chunkCoordinates.chunkX,
              y: chunkCoordinates.chunkY,
            }
          });
        }

      }
    };

    window.addEventListener("click", handleCanvasClick);
    window.addEventListener("mousemove", handleCanvasHover);
    return () => {
      window.removeEventListener("click", handleCanvasClick);
      window.removeEventListener("mousemove", handleCanvasHover);
    };
  }, [camera, meshRef, canPlaceBeacon, resources, offsetX, offsetY]);
};

