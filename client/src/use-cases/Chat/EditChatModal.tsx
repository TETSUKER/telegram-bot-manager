import React from "react";
import { Button, Modal, TextInput } from "components";
import { XIcon } from "@heroicons/react/outline";
import { useAppSelector } from "hooks/useSelector";
import { useAppDispatch } from "hooks/useDispatch";
import { Status } from "store/chat/addChatModalSlice";
import {
  closeEditChatModal,
  editChatRequest,
  setChatName,
  setChatId,
} from "store/chat/editChatModalSlice";

export const EditChatModal: React.FC = () => {
  const editChatModalState = useAppSelector((state) => state.chat.editChatModal);
  const dispatch = useAppDispatch();

  const isLoading = editChatModalState.status === Status.LOADING;

  return (
    <Modal
      isOpen={editChatModalState.isOpened}
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-medium text-white">Edit chat</h2>
          <XIcon
            className="size-6 text-slate-400 cursor-pointer"
            onClick={() => dispatch(closeEditChatModal())}
          />
        </div>
      }
      content={
        <div className="flex flex-col gap-y-2">
          <TextInput
            label="Chat name"
            disabled={isLoading}
            onChange={(value) => dispatch(setChatName(value))}
            initialValue={editChatModalState.name}
          />
          <TextInput
            label="Chat id"
            disabled={isLoading}
            onChange={(value) => dispatch(setChatId(value))}
            initialValue={editChatModalState.chatId}
          />
        </div>
      }
      bottom={
        <div className="flex space-x-3 w-full pl-[50%]">
          <Button
            text="Cancel"
            type="outline"
            color="secondary"
            onClick={() => dispatch(closeEditChatModal())}
          />
          <Button
            text="Apply"
            type="fill"
            color="primary"
            loading={isLoading}
            onClick={() =>
              dispatch(
                editChatRequest({
                  id: editChatModalState.id,
                  name: editChatModalState.name,
                  chatId: editChatModalState.chatId,
                })
              )
            }
          />
        </div>
      }
    />
  );
};
