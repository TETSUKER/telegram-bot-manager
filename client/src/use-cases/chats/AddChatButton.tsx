import { PlusIcon } from "@heroicons/react/outline";
import { Button } from "components";
import { useAppDispatch } from "hooks/useDispatch";
import { useAppSelector } from "hooks/useSelector";
import React from "react";
import { openAddChatModal } from "store/chat/addChatModalSlice";
import { Status } from "store/interfaces";

export const AddChatButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const chatsTableState = useAppSelector((state) => state.chat.chatsTable);
  const isButtonDisabled = chatsTableState.status === Status.LOADING;

  return (
    <Button
      icon={<PlusIcon />}
      type="icon"
      color="secondary"
      onClick={() => dispatch(openAddChatModal())}
      disabled={isButtonDisabled}
    />
  );
};
