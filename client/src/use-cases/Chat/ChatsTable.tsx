import React from "react";
import {
  Table,
  TableCheckbox,
  TableMasterCheckbox,
  TableData,
} from "components";
import { ServerChat } from "api/chat";
import { useAppSelector } from "hooks/useSelector";
import { useAppDispatch } from "hooks/useDispatch";
import { fetchChats } from "store/chatsTableSlice";
import { toggleSelectItem, toggleSelectAll } from "store/chatsTableSlice";
import { openEditChatModal } from "store/editChatModalSlice";

interface ChatTableRow extends ServerChat {
  checkbox: React.JSX.Element;
}

export const ChatsTable: React.FC = () => {
  const chatsTableState = useAppSelector((state) => state.chatsTable);
  const dispatch = useAppDispatch();
  const headerCells = [
    <TableMasterCheckbox
      checked={chatsTableState.isAllSelected}
      onChange={() => dispatch(toggleSelectAll())}
      indeterminate={chatsTableState.isSomeSelected}
    />,
    "ID",
    "Chat name",
    "Chat ID",
    "Date added",
  ];
  const [chatsTableData, setChatsTableData] = React.useState<
    TableData<ChatTableRow>
  >({ headerCells, rows: [] });

  const getTableData = (chats: ServerChat[]): TableData<ChatTableRow> => {
    return {
      headerCells,
      rows: chats.map((chat) => ({
        checkbox: (
          <TableCheckbox
            id={chat.id}
            checked={chatsTableState.selectedIds.includes(chat.id)}
            onChange={(id) => id && dispatch(toggleSelectItem(id))}
          />
        ),
        id: chat.id,
        name: (
          <span
            onClick={() =>
              dispatch(
                openEditChatModal({
                  id: chat.id,
                  name: chat.name,
                  chatId: chat.chatId,
                })
              )
            }
            className="text-white hover:underline cursor-pointer"
          >
            {chat.name}
          </span>
        ),
        chatId: chat.chatId,
        dateAdded: chat.dateAdded,
      })),
    };
  };

  React.useEffect(() => {
    dispatch(fetchChats());
  }, []);

  React.useEffect(() => {
    setChatsTableData(getTableData(chatsTableState.chats));
  }, [chatsTableState]);

  return <Table tableData={chatsTableData}></Table>;
};
