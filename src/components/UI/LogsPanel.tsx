import { useGameStore } from "../../store";
import { BasicPanelWrapper } from "./BasicPanelWrapper";

export const LogsPanel = () => {
  const opacity = useGameStore((state) => state.uiPanelsState.logsPanel.opacity);
  const logs = useGameStore((state) => state.logs);

  return (
    <BasicPanelWrapper titleText="Logs:" opacity={opacity}>
      {logs.map((log, index) => (
        <div key={index}>{log}</div>
      ))}
    </BasicPanelWrapper>
  );
};
