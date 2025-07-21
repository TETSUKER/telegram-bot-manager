import React from "react";
import { Button, Modal, TextInput } from "components";
import { XIcon } from "@heroicons/react/outline";
import { useAppSelector } from "hooks/useSelector";
import { useAppDispatch } from "hooks/useDispatch";
import {
  closeEditChatModal,
  editChatRequest,
  setChatName,
  setChatId,
} from "store/chat/editChatModalSlice";

export const EditChatModal: React.FC = () => {
  const editChatModalState = useAppSelector(
    (state) => state.chat.editChatModal
  );
  const dispatch = useAppDispatch();

  return (
    <Modal
      isOpen={editChatModalState.isOpened}
      isLoading={false}
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
            label={editChatModalState.name.label}
            disabled={editChatModalState.name.disabled}
            onChange={(value) => dispatch(setChatName(value))}
            initialValue={editChatModalState.name.value}
          />
          <TextInput
            label={editChatModalState.chatId.label}
            disabled={editChatModalState.chatId.disabled}
            onChange={(value) => dispatch(setChatId(value))}
            initialValue={editChatModalState.chatId.value}
          />
        </div>
      }
      bottom={
        <div className="flex space-x-3 w-full pl-[50%]">
          <Button
            type="outline"
            color="secondary"
            text={editChatModalState.cancel.text}
            onClick={() => dispatch(closeEditChatModal())}
          />
          <Button
            type="fill"
            color="primary"
            text={editChatModalState.apply.text}
            loading={editChatModalState.apply.loading}
            onClick={() => dispatch(editChatRequest())}
          />
        </div>
      }
    />
  );
};
