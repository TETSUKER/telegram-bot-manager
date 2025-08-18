import { TrashIcon } from "@heroicons/react/outline";
import { Button } from "components";
import { useAppDispatch } from "hooks/useDispatch";
import { useAppSelector } from "hooks/useSelector";
import React from "react";
import { openDeleteChatsModal } from "store/chat/deleteChatsModalSlice";
import { Status } from "store/interfaces";

export const DeleteChatsButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const chatsTableState = useAppSelector((state) => state.chat.chatsTable);
  const isButtonDisabled =
    chatsTableState.status === Status.LOADING ||
    chatsTableState.selectedIds.length === 0;

  return (
    <Button
      icon={<TrashIcon />}
      type="icon"
      color="danger"
      onClick={() =>
        dispatch(openDeleteChatsModal(chatsTableState.selectedIds))
      }
      disabled={isButtonDisabled}
    />
  );
};
