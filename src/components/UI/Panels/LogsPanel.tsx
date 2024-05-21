import { useGameStore } from "../../../store/store";
import { BasicPanelWrapper } from "../BasicPanelWrapper";

export const LogsPanel = () => {
  const opacity = useGameStore((state) => state.uiPanelsState.logsPanel.opacity);
  const logs = useGameStore((state) => state.logs);

  return (
    <BasicPanelWrapper height="h-32" width="w-72" titleText="Logs:" opacity={opacity}>
      {logs.map((log, index) => (
        <div
          key={index}
          className="list-selecting"
          onClick={() => useGameStore.setState({ message: log })}
        >
          {log}
        </div>
      ))}
    </BasicPanelWrapper>
  );
};
