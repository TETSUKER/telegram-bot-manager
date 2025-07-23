import React from "react";
import { Button, Modal, TextInput } from "components";
import { XIcon } from "@heroicons/react/outline";
import { useAppSelector } from "hooks/useSelector";
import { useAppDispatch } from "hooks/useDispatch";
import {
  closeCreateBotModal,
  createBotRequest,
  setToken,
} from "store/bots/createBotModalSlice";

export const CreateBotModal: React.FC = () => {
  const createBotModalState = useAppSelector(
    (state) => state.bot.createBotModal
  );
  const dispatch = useAppDispatch();

  return (
    <Modal
      isOpen={createBotModalState.isOpened}
      isLoading={false}
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-medium text-white">Add bot</h2>
          <XIcon
            className="size-6 text-slate-400 cursor-pointer"
            onClick={() => dispatch(closeCreateBotModal())}
          />
        </div>
      }
      content={
        <div className="flex flex-col gap-y-2">
          <TextInput
            label={createBotModalState.token.label}
            disabled={createBotModalState.token.disabled}
            onChange={(value) => dispatch(setToken(value))}
          />
        </div>
      }
      bottom={
        <div className="flex space-x-3 w-full pl-[50%]">
          <Button
            text={createBotModalState.cancel.text}
            type="outline"
            color="secondary"
            onClick={() => dispatch(closeCreateBotModal())}
          />
          <Button
            text={createBotModalState.apply.text}
            type="fill"
            color="primary"
            loading={createBotModalState.apply.loading}
            onClick={() => dispatch(createBotRequest())}
          />
        </div>
      }
    />
  );
};
