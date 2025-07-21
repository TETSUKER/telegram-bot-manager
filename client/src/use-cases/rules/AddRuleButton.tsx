import { PlusIcon } from "@heroicons/react/outline";
import { Button } from "components";
import React from "react";
import { useAppDispatch } from "hooks/useDispatch";
import { openAddRuleModal } from 'store/rules/addRuleModalSlice';
import { useAppSelector } from 'hooks/useSelector';
import { Status } from 'store/interfaces';

export const AddRuleButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const rulesTableState = useAppSelector((state) => state.rule.rulesTable);

  return (
    <Button
      onClick={() => dispatch(openAddRuleModal())}
      icon={<PlusIcon />}
      type="icon"
      color="secondary"
      disabled={rulesTableState.status === Status.LOADING}
    />
  );
};
