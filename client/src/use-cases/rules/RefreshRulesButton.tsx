import React from "react";
import { RefreshIcon } from "@heroicons/react/outline";
import { Button } from "components";
import { useAppDispatch } from "hooks/useDispatch";
import { updateRules } from "store/rules/rulesTableSlice";
import { useAppSelector } from "hooks/useSelector";
import { Status } from "store/interfaces";

export const RefreshRulesButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const rulesTableState = useAppSelector((state) => state.rule.rulesTable);

  return (
    <Button
      onClick={() => dispatch(updateRules())}
      icon={<RefreshIcon />}
      type="icon"
      color="secondary"
      loading={rulesTableState.status === Status.LOADING}
    />
  );
};
