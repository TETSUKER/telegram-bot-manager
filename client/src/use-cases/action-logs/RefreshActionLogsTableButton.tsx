import React from "react";
import { RefreshIcon } from "@heroicons/react/outline";
import { Button } from "components";
import { useAppDispatch } from "hooks/useDispatch";
import { useAppSelector } from "hooks/useSelector";
import { Status } from "store/interfaces";
import { updateActionLogsTable } from "store/action-logs/actionLogsTableSlice";

export const RefreshActionLogsTableButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const actionLogsTableState = useAppSelector(
    (state) => state.actionLogs.actionLogsTable
  );

  return (
    <Button
      onClick={() => dispatch(updateActionLogsTable())}
      icon={<RefreshIcon />}
      type="icon"
      color="secondary"
      loading={actionLogsTableState.status === Status.LOADING}
    />
  );
};
