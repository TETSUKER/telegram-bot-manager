import { PlusIcon } from "@heroicons/react/outline";
import { Button } from "components";
import React from "react";
import { useAppDispatch } from "hooks/useDispatch";
import { openCreateRuleModal } from "store/rules/createRuleModalSlice";
import { useAppSelector } from "hooks/useSelector";
import { Status } from "store/interfaces";

export const AddRuleButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const rulesTableState = useAppSelector((state) => state.rule.rulesTable);

  return (
    <Button
      onClick={() => dispatch(openCreateRuleModal())}
      icon={<PlusIcon />}
      type="icon"
      color="secondary"
      disabled={rulesTableState.status === Status.LOADING}
    />
  );
};
