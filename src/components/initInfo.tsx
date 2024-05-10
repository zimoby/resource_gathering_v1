import { useEffect } from "react";
import useGamaStore from "../store";
import { levaStore } from "leva";

export const useInitInfo = () => {
	const firstStart = useGamaStore((state) => state.firstStart);
  const loading = useGamaStore((state) => state.loading);


  useEffect(() => {
    if (!loading && !firstStart) {
      useGamaStore.setState({ firstStart: true });
    }
    if (!loading && firstStart) {
      levaStore.set({ width: 100, depth: 100 }, false);
      console.log("leva store updated");
    }
  }, [loading, firstStart]);

};
