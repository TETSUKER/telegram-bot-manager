import React from "react";
import { useSelection } from "../hooks/useSelection";
import {
  Table,
  TableCheckbox,
  TableMasterCheckbox,
  TableData,
} from "../components";
import { getChats, ServerChat } from "../api/chat";

interface ChatTableRow extends ServerChat {
  checkbox: React.JSX.Element;
}

export const ChatsTable: React.FC = () => {
  const [serverChats, setServerChats] = React.useState<ServerChat[]>([]);
  const {
    selectedIds,
    allSelected,
    someSelected,
    toggleSelectAll,
    toggleSelectItem,
  } = useSelection(serverChats);
  const headerCells = [
    <TableMasterCheckbox
      checked={allSelected}
      onChange={() => toggleSelectAll(!allSelected)}
      indeterminate={someSelected}
    />,
    "ID",
    "Chat ID",
    "Chat name",
    "Date added",
  ];
  const [chatsTableData, setChatsTableData] = React.useState<
    TableData<ChatTableRow>
  >({ headerCells, rows: [] });

  const getTableData = (chats: ServerChat[]): TableData<ChatTableRow> => {
    return {
      headerCells,
      rows: chats.map(chat => ({
        checkbox: (
          <TableCheckbox
            id={chat.id}
            checked={selectedIds.has(chat.id)}
            onChange={(id) => id && toggleSelectItem(id)}
          />
        ),
        ...chat,
      })),
    };
  };

  React.useEffect(() => {
    getChats()
      .then((chats: ServerChat[]) => {
        setServerChats(chats);
        setChatsTableData(getTableData(chats));
      })
      .catch(console.error);
  }, []);

  React.useEffect(() => {
    setChatsTableData(getTableData(serverChats));
  }, [selectedIds]);

  return <Table tableData={chatsTableData}></Table>;
};
