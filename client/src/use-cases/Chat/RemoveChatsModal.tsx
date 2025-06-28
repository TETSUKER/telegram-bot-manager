import React from "react";
import { Button, Modal } from "components";
import { XIcon } from "@heroicons/react/outline";
import { useAppSelector } from "hooks/useSelector";
import { useAppDispatch } from "hooks/useDispatch";
import {
  closeRemoveChatsModal,
  removeChatsRequest,
} from "store/chat/removeChatsModalSlice";

export const RemoveChatsModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const removeChatModalState = useAppSelector(
    (state) => state.chat.removeChatModal
  );

  return (
    <Modal
      isOpen={removeChatModalState.isOpened}
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-medium text-white">Remove chats</h2>
          <XIcon
            className="size-6 text-slate-400 cursor-pointer"
            onClick={() => dispatch(closeRemoveChatsModal())}
          />
        </div>
      }
      content={
        <span className="text-white">
          Do you really want to delete the selected chats?
        </span>
      }
      bottom={
        <div className="flex space-x-3 w-full pl-[50%]">
          <Button
            text={removeChatModalState.cancel.text}
            type="outline"
            color="secondary"
            onClick={() => dispatch(closeRemoveChatsModal())}
          />
          <Button
            text={removeChatModalState.delete.text}
            type="fill"
            color="danger"
            loading={removeChatModalState.delete.loading}
            onClick={() => dispatch(removeChatsRequest())}
          />
        </div>
      }
    />
  );
};
