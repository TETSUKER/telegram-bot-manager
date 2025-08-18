import { TrashIcon } from "@heroicons/react/outline";
import { Button } from "components";
import { useAppDispatch } from 'hooks/useDispatch';
import { useAppSelector } from "hooks/useSelector";
import React from "react";
import { Status } from "store/interfaces";
import { openDeleteRulesModal } from 'store/rules/deleteRulesModalSlice';

export const RemoveRulesButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const rulesTableState = useAppSelector((state) => state.rule.rulesTable);

  const buttonDisabled =
    rulesTableState.status === Status.LOADING ||
    rulesTableState.selectedIds.length === 0;

  return (
    <Button
      onClick={() => dispatch(openDeleteRulesModal(rulesTableState.selectedIds))}
      icon={<TrashIcon />}
      type="icon"
      color="danger"
      disabled={buttonDisabled}
    />
  );
};
