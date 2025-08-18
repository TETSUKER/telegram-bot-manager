import React from "react";
import { Button, Modal, TextInput } from "components";
import { XIcon } from "@heroicons/react/outline";
import { useAppSelector } from "hooks/useSelector";
import { useAppDispatch } from "hooks/useDispatch";
import {
  closeAddBotModal,
  addBotRequest,
  setToken,
} from "store/bots/addBotModalSlice";

export const AddBotModal: React.FC = () => {
  const addBotModalState = useAppSelector(
    (state) => state.bot.addBotModal
  );
  const dispatch = useAppDispatch();

  return (
    <Modal
      isOpen={addBotModalState.isOpened}
      isLoading={false}
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-medium text-white">Add bot</h2>
          <XIcon
            className="size-6 text-slate-400 cursor-pointer"
            onClick={() => dispatch(closeAddBotModal())}
          />
        </div>
      }
      content={
        <div className="flex flex-col gap-y-2">
          <TextInput
            label={addBotModalState.token.label}
            disabled={addBotModalState.token.disabled}
            onChange={(value) => dispatch(setToken(value))}
          />
        </div>
      }
      bottom={
        <div className="flex space-x-3 w-full pl-[50%]">
          <Button
            text={addBotModalState.cancel.text}
            type="outline"
            color="secondary"
            onClick={() => dispatch(closeAddBotModal())}
          />
          <Button
            text={addBotModalState.apply.text}
            type="fill"
            color="primary"
            loading={addBotModalState.apply.loading}
            onClick={() => dispatch(addBotRequest())}
          />
        </div>
      }
    />
  );
};
