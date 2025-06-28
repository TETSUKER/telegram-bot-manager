import React from "react";
import { Button, Modal, TextInput } from "components";
import { XIcon } from "@heroicons/react/outline";
import { useAppSelector } from "hooks/useSelector";
import { useAppDispatch } from "hooks/useDispatch";
import {
  closeAddChatModal,
  addChatRequest,
  setChatName,
  setChatId,
} from "store/chat/addChatModalSlice";

export const AddChatModal: React.FC = () => {
  const addChatModalState = useAppSelector((state) => state.chat.addChatModal);
  const dispatch = useAppDispatch();

  return (
    <Modal
      isOpen={addChatModalState.isOpened}
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-medium text-white">Add chat</h2>
          <XIcon
            className="size-6 text-slate-400 cursor-pointer"
            onClick={() => dispatch(closeAddChatModal())}
          />
        </div>
      }
      content={
        <div className="flex flex-col gap-y-2">
          <TextInput
            label={addChatModalState.name.label}
            disabled={addChatModalState.name.disabled}
            onChange={(value) => dispatch(setChatName(value))}
          />
          <TextInput
            label={addChatModalState.chatId.label}
            disabled={addChatModalState.chatId.disabled}
            onChange={(value) => dispatch(setChatId(value))}
          />
        </div>
      }
      bottom={
        <div className="flex space-x-3 w-full pl-[50%]">
          <Button
            text={addChatModalState.cancel.text}
            type="outline"
            color="secondary"
            onClick={() => dispatch(closeAddChatModal())}
          />
          <Button
            text={addChatModalState.apply.text}
            type="fill"
            color="primary"
            loading={addChatModalState.apply.loading}
            onClick={() => dispatch(addChatRequest())}
          />
        </div>
      }
    />
  );
};
