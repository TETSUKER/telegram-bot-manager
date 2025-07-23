import React from "react";
import { RefreshIcon } from "@heroicons/react/outline";
import { Button } from "components";
import { useAppDispatch } from "hooks/useDispatch";
import { useAppSelector } from "hooks/useSelector";
import { Status } from "store/interfaces";
import { updateBotsTable } from "store/bots/botsTableSlice";

export const RefreshBotsTableButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const botsTableState = useAppSelector((state) => state.bot.botsTable);

  return (
    <Button
      onClick={() => dispatch(updateBotsTable())}
      icon={<RefreshIcon />}
      type="icon"
      color="secondary"
      loading={botsTableState.status === Status.LOADING}
    />
  );
};
