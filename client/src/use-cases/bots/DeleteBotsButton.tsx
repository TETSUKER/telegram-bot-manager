import { TrashIcon } from "@heroicons/react/outline";
import { Button } from "components";
import { useAppDispatch } from "hooks/useDispatch";
import { useAppSelector } from "hooks/useSelector";
import React from "react";
import { openDeleteBotsModal } from "store/bots/deleteBotsModalSlice";
import { Status } from "store/interfaces";

export const DeleteBotsButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const botsTableState = useAppSelector((state) => state.bot.botsTable);

  const buttonDisabled =
    botsTableState.status === Status.LOADING ||
    botsTableState.selectedIds.length === 0;

  return (
    <Button
      onClick={() => dispatch(openDeleteBotsModal(botsTableState.selectedIds))}
      icon={<TrashIcon />}
      type="icon"
      color="danger"
      disabled={buttonDisabled}
    />
  );
};
