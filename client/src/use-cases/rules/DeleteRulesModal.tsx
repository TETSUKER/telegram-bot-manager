import React from "react";
import { Button, Modal } from "components";
import { XIcon } from "@heroicons/react/outline";
import { useAppSelector } from "hooks/useSelector";
import { useAppDispatch } from "hooks/useDispatch";
import { closeDeleteRulesModal, deleteRulesRequest } from 'store/rules/deleteRulesModalSlice';

export const DeleteRulesModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const deleteRuleModalState = useAppSelector(
    (state) => state.rule.deleteRulesModal
  );

  return (
    <Modal
      isOpen={deleteRuleModalState.isOpened}
      isLoading={false}
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-medium text-white">Delete rules</h2>
          <XIcon
            className="size-6 text-slate-400 cursor-pointer"
            onClick={() => dispatch(closeDeleteRulesModal())}
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
            text={deleteRuleModalState.cancel.text}
            type="outline"
            color="secondary"
            onClick={() => dispatch(closeDeleteRulesModal())}
          />
          <Button
            text={deleteRuleModalState.delete.text}
            type="fill"
            color="danger"
            loading={deleteRuleModalState.delete.loading}
            onClick={() => dispatch(deleteRulesRequest())}
          />
        </div>
      }
    />
  );
};
