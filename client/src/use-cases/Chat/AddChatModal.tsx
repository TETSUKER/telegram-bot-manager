import React from "react";
import { Button, Modal, TextInput } from "components";
import { XIcon } from "@heroicons/react/outline";
import { useAppSelector } from 'hooks/useSelector';
import { useAppDispatch } from 'hooks/useDispatch';
import { Status } from 'store/addChatModalSlice';
import { closeAddChatModal, addChatRequest } from 'store/addChatModalSlice';

export const AddChatModal: React.FC = () => {
  const [chatName, setChatName] = React.useState("");
  const [chatId, setChatId] = React.useState("");

  const addChatModalState = useAppSelector((state) => state.addChatModal);
  const dispatch = useAppDispatch();

  const isLoading = addChatModalState.status === Status.LOADING;

  return (
    <Modal
      isOpen={addChatModalState.isOpened}
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-medium text-white">Add chat</h2>
          <XIcon
            className="size-6 text-slate-400 cursor-pointer"
            onClick={() => closeAddChatModal()}
          />
        </div>
      }
      content={
        <div className="flex flex-col gap-y-2">
          <TextInput
            label="Channel name"
            disabled={isLoading}
            onChange={(value) => setChatName(value)}
          />
          <TextInput
            label="Channel id"
            disabled={isLoading}
            onChange={(value) => setChatId(value)}
          />
        </div>
      }
      bottom={
        <div className="flex space-x-3 w-full pl-[50%]">
          <Button
            text="Cancel"
            type="outline"
            color="secondary"
            onClick={() => dispatch(closeAddChatModal())}
          />
          <Button
            text="Apply"
            type="fill"
            color="primary"
            loading={isLoading}
            onClick={() => dispatch(addChatRequest({ name: chatName, chatId: chatId }))}
          />
        </div>
      }
    />
  );
};
