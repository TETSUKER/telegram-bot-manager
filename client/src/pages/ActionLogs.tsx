import React from "react";
import {
  ActionLogsTable,
  RefreshActionLogsTableButton,
} from "use-cases/action-logs";

export const ActionLogs: React.FC = () => {
  return (
    <>
      <div className="flex gap-x-2 py-[10px]">
        <RefreshActionLogsTableButton></RefreshActionLogsTableButton>
      </div>
      <ActionLogsTable></ActionLogsTable>
    </>
  );
};
