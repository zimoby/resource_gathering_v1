import { useEffect } from "react";
import useGamaStore from "../store";

export const useInitInfo = () => {
	const firstStart = useGamaStore((state) => state.firstStart);
  const loading = useGamaStore((state) => state.loading);
  const updateMapSize = useGamaStore((state) => state.updateMapSize);

  useEffect(() => {
    if (!loading && !firstStart) {
      useGamaStore.setState({ firstStart: true });
    }
    if (!loading && firstStart) {
      updateMapSize(100);
    }
  }, [loading, firstStart, updateMapSize]);

};
