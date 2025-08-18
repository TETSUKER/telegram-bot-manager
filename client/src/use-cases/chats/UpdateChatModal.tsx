import React from "react";
import { Button, Modal, TextInput } from "components";
import { XIcon } from "@heroicons/react/outline";
import { useAppSelector } from "hooks/useSelector";
import { useAppDispatch } from "hooks/useDispatch";
import {
  closeUpdateChatModal,
  updateChatRequest,
  setChatName,
  setChatId,
} from "store/chat/updateChatModalSlice";

export const UpdateChatModal: React.FC = () => {
  const updateChatModalState = useAppSelector(
    (state) => state.chat.updateChatModal
  );
  const dispatch = useAppDispatch();

  return (
    <Modal
      isOpen={updateChatModalState.isOpened}
      isLoading={false}
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-medium text-white">Update chat</h2>
          <XIcon
            className="size-6 text-slate-400 cursor-pointer"
            onClick={() => dispatch(closeUpdateChatModal())}
          />
        </div>
      }
      content={
        <div className="flex flex-col gap-y-2">
          <TextInput
            label={updateChatModalState.name.label}
            disabled={updateChatModalState.name.disabled}
            onChange={(value) => dispatch(setChatName(value))}
            initialValue={updateChatModalState.name.value}
          />
          <TextInput
            label={updateChatModalState.chatId.label}
            disabled={updateChatModalState.chatId.disabled}
            onChange={(value) => dispatch(setChatId(value))}
            initialValue={updateChatModalState.chatId.value}
          />
        </div>
      }
      bottom={
        <div className="flex space-x-3 w-full pl-[50%]">
          <Button
            type="outline"
            color="secondary"
            text={updateChatModalState.cancel.text}
            onClick={() => dispatch(closeUpdateChatModal())}
          />
          <Button
            type="fill"
            color="primary"
            text={updateChatModalState.apply.text}
            loading={updateChatModalState.apply.loading}
            onClick={() => dispatch(updateChatRequest())}
          />
        </div>
      }
    />
  );
};
