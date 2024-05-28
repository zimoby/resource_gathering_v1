import { useEffect, useState } from "react";
import { useGameStore } from "../store/store";

export const useModalPriority = () => {
  const showSettingsModal = useGameStore((state) => state.showSettingsModal);
  const showAboutModal = useGameStore((state) => state.showAboutModal);
  const showArtifactsModal = useGameStore((state) => state.showArtifactsModal);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (showSettingsModal) {
      setShowModal(true);
    } else if (showAboutModal) {
      setShowModal(true);
    } else if (showArtifactsModal) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [showSettingsModal, showAboutModal, showArtifactsModal]);

  return showModal;
}