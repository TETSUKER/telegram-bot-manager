import { RefreshIcon } from "@heroicons/react/outline";
import { Button } from "components";
import React from "react";
import { useAppDispatch } from "hooks/useDispatch";
import { updateChats } from "store/chat/chatsTableSlice";
import { useAppSelector } from "hooks/useSelector";
import { Status } from "store/interfaces";

export const RefreshChatsButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const chatsTableState = useAppSelector((state) => state.chat.chatsTable);
  const isButtonLoading = chatsTableState.status === Status.LOADING;

  return (
    <Button
      icon={<RefreshIcon />}
      type="icon"
      color="secondary"
      onClick={() => dispatch(updateChats())}
      loading={isButtonLoading}
    />
  );
};
