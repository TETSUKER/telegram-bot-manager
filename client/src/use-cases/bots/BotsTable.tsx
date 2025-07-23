import React from "react";
import {
  Table,
  TableCheckbox,
  TableMasterCheckbox,
  TableData,
} from "components";
import { ServerBot } from "api/bots";
import { useAppSelector } from "hooks/useSelector";
import { useAppDispatch } from "hooks/useDispatch";
import { openUpdateBotModal } from "store/bots/updateBotModalSlice";
import {
  toggleSelectAll,
  toggleSelectItem,
  updateBotsTable,
} from "store/bots/botsTableSlice";
import { Status } from "store/interfaces";

interface BotTableRow {
  checkbox: React.JSX.Element;
  name: string;
  dateAdded: Date;
}

export const BotsTable: React.FC = () => {
  const botsTableState = useAppSelector((state) => state.bot.botsTable);
  const dispatch = useAppDispatch();
  const headerCells = [
    <TableMasterCheckbox
      checked={botsTableState.isAllSelected}
      onChange={() => dispatch(toggleSelectAll())}
      indeterminate={botsTableState.isSomeSelected}
    />,
    "ID",
    "Bot name",
    "Date added",
  ];
  const [botsTableData, setBotsTableData] = React.useState<
    TableData<BotTableRow>
  >({ headerCells, rows: [] });

  const getTableData = (bots: ServerBot[]): TableData<BotTableRow> => {
    return {
      headerCells,
      rows: bots.map((bot) => ({
        checkbox: (
          <TableCheckbox
            id={bot.id}
            checked={botsTableState.selectedIds.includes(bot.id)}
            onChange={(id) => id && dispatch(toggleSelectItem(id))}
          />
        ),
        id: bot.id,
        name: (
          <span
            onClick={() =>
              dispatch(
                openUpdateBotModal({
                  id: bot.id,
                  ruleIds: bot.ruleIds,
                })
              )
            }
            className="text-white hover:underline cursor-pointer"
          >
            {bot.username}
          </span>
        ),
        dateAdded: new Date(bot.dateAdded).toLocaleString("ru"),
      })),
    };
  };

  React.useEffect(() => {
    dispatch(updateBotsTable());
  }, []);

  React.useEffect(() => {
    setBotsTableData(getTableData(botsTableState.bots));
  }, [botsTableState]);

  return (
    <Table
      tableData={botsTableData}
      isLoading={botsTableState.status === Status.LOADING}
    ></Table>
  );
};
