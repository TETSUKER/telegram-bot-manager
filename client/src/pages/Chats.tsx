import React from "react";
import {
  ChatsTable,
  AddChatModal,
  RemoveChatsModal,
  EditChatModal,
} from "use-cases";
import { Button } from "components";
import { PlusIcon, RefreshIcon, TrashIcon } from "@heroicons/react/outline";
import { useAppSelector } from "hooks/useSelector";
import { useAppDispatch } from "hooks/useDispatch";
import { fetchChats } from "store/chat/chatsTableSlice";
import { openAddChatModal } from "store/chat/addChatModalSlice";
import { openRemoveChatsModal } from "store/chat/removeChatsModalSlice";
import { Status } from "store/interfaces";

export const Chats: React.FC = () => {
  const dispatch = useAppDispatch();
  const chatsTableState = useAppSelector((state) => state.chat.chatsTable);

  const refreshButtonLoading = chatsTableState.status === Status.LOADING;
  const addButtonDisabled = chatsTableState.status === Status.LOADING;
  const deleteButtonDisabled =
    chatsTableState.status === Status.LOADING ||
    chatsTableState.selectedIds.length === 0;

  return (
    <>
      <div className="flex gap-x-2 py-[10px]">
        <Button
          icon={<RefreshIcon />}
          type="icon"
          color="secondary"
          onClick={() => dispatch(fetchChats())}
          loading={refreshButtonLoading}
        />
        <Button
          icon={<PlusIcon />}
          type="icon"
          color="secondary"
          onClick={() => dispatch(openAddChatModal())}
          disabled={addButtonDisabled}
        />
        <Button
          icon={<TrashIcon />}
          type="icon"
          color="danger"
          onClick={() =>
            dispatch(openRemoveChatsModal(chatsTableState.selectedIds))
          }
          disabled={deleteButtonDisabled}
        />
      </div>
      <ChatsTable />

      <AddChatModal />
      <RemoveChatsModal />
      <EditChatModal />
    </>
  );
};
