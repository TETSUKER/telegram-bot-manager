import { PlusIcon } from "@heroicons/react/outline";
import { Button } from "components";
import { useAppDispatch } from "hooks/useDispatch";
import { useAppSelector } from "hooks/useSelector";
import React from "react";
import { openCreateBotModal } from "store/bots/createBotModalSlice";
import { Status } from "store/interfaces";

export const CreateBotButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const botsTableState = useAppSelector((state) => state.bot.botsTable);
  const isButtonDisabled = botsTableState.status === Status.LOADING;

  return (
    <Button
      icon={<PlusIcon />}
      type="icon"
      color="secondary"
      onClick={() => dispatch(openCreateBotModal())}
      disabled={isButtonDisabled}
    />
  );
};
