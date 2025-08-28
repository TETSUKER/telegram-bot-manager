import React from "react";
import { Table, TableData } from "components";
import { useAppSelector } from "hooks/useSelector";
import { useAppDispatch } from "hooks/useDispatch";
import { Status } from "store/interfaces";
import { ActionLogType, ServerActionLog } from "api/actionLogs";
import { updateActionLogsTable } from "store/action-logs/actionLogsTableSlice";

interface ActionLogsTableRow {
  id: number;
  type: ActionLogType;
  details: string;
  date: Date;
}

export const ActionLogsTable: React.FC = () => {
  const actionLogsTableState = useAppSelector(
    (state) => state.actionLogs.actionLogsTable
  );
  const dispatch = useAppDispatch();
  const headerCells = ["ID", "Date", "Action type", "Details"];
  const columnsWidth = [0, 10, 10, 20];
  const [actionLogsTableData, setActionLogsTableData] = React.useState<
    TableData<ActionLogsTableRow>
  >({ headerCells, rows: [], columnsWidth: [] });

  const getTableData = (
    actionLogs: ServerActionLog[]
  ): TableData<ActionLogsTableRow> => {
    return {
      headerCells,
      columnsWidth,
      rows: actionLogs.map((actionLog) => ({
        id: actionLog.id,
        date: new Date(actionLog.date).toLocaleString("ru"),
        type: actionLog.type,
        details: actionLog.details,
      })),
    };
  };

  React.useEffect(() => {
    dispatch(updateActionLogsTable());
  }, []);

  React.useEffect(() => {
    setActionLogsTableData(getTableData(actionLogsTableState.actionLogs));
  }, [actionLogsTableState]);

  return (
    <Table
      tableData={actionLogsTableData}
      isLoading={actionLogsTableState.status === Status.LOADING}
    ></Table>
  );
};
