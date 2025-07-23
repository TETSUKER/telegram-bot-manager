import React from "react";
import { Button, Modal } from "components";
import { XIcon } from "@heroicons/react/outline";
import { useAppSelector } from "hooks/useSelector";
import { useAppDispatch } from "hooks/useDispatch";
import {
  closeDeleteBotsModal,
  deleteBotsRequest,
} from "store/bots/deleteBotsModalSlice";

export const DeleteBotsModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const deleteBotsModalState = useAppSelector(
    (state) => state.bot.deleteBotsModal
  );

  return (
    <Modal
      isOpen={deleteBotsModalState.isOpened}
      isLoading={false}
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-medium text-white">Remove bots</h2>
          <XIcon
            className="size-6 text-slate-400 cursor-pointer"
            onClick={() => dispatch(closeDeleteBotsModal())}
          />
        </div>
      }
      content={
        <span className="text-white">
          Do you really want to delete the selected bots?
        </span>
      }
      bottom={
        <div className="flex space-x-3 w-full pl-[50%]">
          <Button
            text={deleteBotsModalState.cancel.text}
            type="outline"
            color="secondary"
            onClick={() => dispatch(closeDeleteBotsModal())}
          />
          <Button
            text={deleteBotsModalState.delete.text}
            type="fill"
            color="danger"
            loading={deleteBotsModalState.delete.loading}
            onClick={() => dispatch(deleteBotsRequest())}
          />
        </div>
      }
    />
  );
};
