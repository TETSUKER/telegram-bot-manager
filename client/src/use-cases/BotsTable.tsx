import React from "react";
import { useSelection } from "../hooks/useSelection";
import {
  Table,
  TableCheckbox,
  TableMasterCheckbox,
  TableData,
} from "../components";
import { getBots, ServerBot } from "../api/bots";

interface BotTableRow {
  checkbox: React.JSX.Element;
  name: string;
  dateAdded: Date;
}

export const BotsTable: React.FC = () => {
  const [serverBots, setServerBots] = React.useState<ServerBot[]>([]);
  const {
    selectedIds,
    allSelected,
    someSelected,
    toggleSelectAll,
    toggleSelectItem,
  } = useSelection(serverBots);
  const headerCells = [
    <TableMasterCheckbox
      checked={allSelected}
      onChange={() => toggleSelectAll(!allSelected)}
      indeterminate={someSelected}
    />,
    "Bot name",
    "Date added",
  ];
  const [botsTableData, setBotsTableData] = React.useState<
    TableData<BotTableRow>
  >({ headerCells, rows: [] });

  const getTableData = (bots: ServerBot[]): TableData<BotTableRow> => {
    return {
      headerCells,
      rows: bots.map(bot => ({
        checkbox: (
          <TableCheckbox
            id={bot.id}
            checked={selectedIds.has(bot.id)}
            onChange={(id) => id && toggleSelectItem(id)}
          />
        ),
        name: bot.username,
        dateAdded: bot.dateAdded,
      })),
    };
  };

  React.useEffect(() => {
    getBots()
      .then((bots: ServerBot[]) => {
        setServerBots(bots);
        setBotsTableData(getTableData(bots));
      })
      .catch(console.error);
  }, []);

  React.useEffect(() => {
    setBotsTableData(getTableData(serverBots));
  }, [selectedIds]);

  return <Table tableData={botsTableData} isLoading={false}></Table>;
};
