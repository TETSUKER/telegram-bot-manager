import React from "react";
import { Button, ChipSelector, Modal } from "components";
import { XIcon } from "@heroicons/react/outline";
import { useAppSelector } from "hooks/useSelector";
import { useAppDispatch } from "hooks/useDispatch";
import {
  closeUpdateBotModal,
  setRuleIds,
  updateBotRequest,
} from "store/bots/updateBotModalSlice";

export const UpdateBotModal: React.FC = () => {
  const updateBotModalState = useAppSelector(
    (state) => state.bot.updateBotModal
  );
  const dispatch = useAppDispatch();

  return (
    <Modal
      isOpen={updateBotModalState.isOpened}
      isLoading={updateBotModalState.isLoading}
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-medium text-white">Update bot</h2>
          <XIcon
            className="size-6 text-slate-400 cursor-pointer"
            onClick={() => dispatch(closeUpdateBotModal())}
          />
        </div>
      }
      content={
        <div className="flex flex-col gap-y-2">
          <ChipSelector
            options={updateBotModalState.ruleIds.options}
            onChange={(value) => dispatch(setRuleIds(value))}
            label={updateBotModalState.ruleIds.label}
            value={updateBotModalState.ruleIds.value}
          ></ChipSelector>
        </div>
      }
      bottom={
        <div className="flex space-x-3 w-full pl-[50%]">
          <Button
            text={updateBotModalState.cancel.text}
            type="outline"
            color="secondary"
            onClick={() => dispatch(closeUpdateBotModal())}
          />
          <Button
            text={updateBotModalState.apply.text}
            type="fill"
            color="primary"
            loading={updateBotModalState.apply.loading}
            onClick={() => dispatch(updateBotRequest())}
          />
        </div>
      }
    />
  );
};
