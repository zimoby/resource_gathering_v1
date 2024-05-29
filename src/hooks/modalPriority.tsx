import { useEffect, useState } from "react";
import { useGameStore } from "../store/store";

export const useModalPriority = () => {
  const showSettingsModal = useGameStore((state) => state.showSettingsModal);
  const showAboutModal = useGameStore((state) => state.showAboutModal);
  const showArtifactsModal = useGameStore((state) => state.showArtifactsModal);
  const showMapModal = useGameStore((state) => state.showMapModal);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(
      showSettingsModal || showAboutModal || showArtifactsModal || showMapModal,
    );
  }, [showSettingsModal, showAboutModal, showArtifactsModal, showMapModal]);

  return showModal;
};
