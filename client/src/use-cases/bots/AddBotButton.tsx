import { PlusIcon } from "@heroicons/react/outline";
import { Button } from "components";
import { useAppDispatch } from "hooks/useDispatch";
import { useAppSelector } from "hooks/useSelector";
import React from "react";
import { openAddBotModal } from "store/bots/addBotModalSlice";
import { Status } from "store/interfaces";

export const AddBotButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const botsTableState = useAppSelector((state) => state.bot.botsTable);
  const isButtonDisabled = botsTableState.status === Status.LOADING;

  return (
    <Button
      icon={<PlusIcon />}
      type="icon"
      color="secondary"
      onClick={() => dispatch(openAddBotModal())}
      disabled={isButtonDisabled}
    />
  );
};
