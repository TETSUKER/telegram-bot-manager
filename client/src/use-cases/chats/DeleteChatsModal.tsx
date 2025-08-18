import React from "react";
import { Button, Modal } from "components";
import { XIcon } from "@heroicons/react/outline";
import { useAppSelector } from "hooks/useSelector";
import { useAppDispatch } from "hooks/useDispatch";
import {
  closeDeleteChatsModal,
  deleteChatsRequest,
} from "store/chat/deleteChatsModalSlice";

export const DeleteChatsModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const deleteChatModalState = useAppSelector(
    (state) => state.chat.deleteChatsModal
  );

  return (
    <Modal
      isOpen={deleteChatModalState.isOpened}
      isLoading={false}
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-medium text-white">Delete chats</h2>
          <XIcon
            className="size-6 text-slate-400 cursor-pointer"
            onClick={() => dispatch(closeDeleteChatsModal())}
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
            text={deleteChatModalState.cancel.text}
            type="outline"
            color="secondary"
            onClick={() => dispatch(closeDeleteChatsModal())}
          />
          <Button
            text={deleteChatModalState.delete.text}
            type="fill"
            color="danger"
            loading={deleteChatModalState.delete.loading}
            onClick={() => dispatch(deleteChatsRequest())}
          />
        </div>
      }
    />
  );
};
