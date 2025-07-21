import React from "react";
import { Button, Modal } from "components";
import { XIcon } from "@heroicons/react/outline";
import { useAppSelector } from "hooks/useSelector";
import { useAppDispatch } from "hooks/useDispatch";
import { closeRemoveRulesModal, removeRulesRequest } from 'store/rules/removeRulesModalSlice';

export const RemoveRulesModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const removeRuleModalState = useAppSelector(
    (state) => state.rule.removeRulesModal
  );

  return (
    <Modal
      isOpen={removeRuleModalState.isOpened}
      isLoading={false}
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-medium text-white">Remove rules</h2>
          <XIcon
            className="size-6 text-slate-400 cursor-pointer"
            onClick={() => dispatch(closeRemoveRulesModal())}
          />
        </div>
      }
      content={
        <span className="text-white">
          Do you really want to delete the selected rules?
        </span>
      }
      bottom={
        <div className="flex space-x-3 w-full pl-[50%]">
          <Button
            text={removeRuleModalState.cancel.text}
            type="outline"
            color="secondary"
            onClick={() => dispatch(closeRemoveRulesModal())}
          />
          <Button
            text={removeRuleModalState.delete.text}
            type="fill"
            color="danger"
            loading={removeRuleModalState.delete.loading}
            onClick={() => dispatch(removeRulesRequest())}
          />
        </div>
      }
    />
  );
};
