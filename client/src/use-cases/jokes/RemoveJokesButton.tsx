import { TrashIcon } from "@heroicons/react/outline";
import { Button } from "components";
import { useAppDispatch } from "hooks/useDispatch";
import { useAppSelector } from "hooks/useSelector";
import React from "react";
import { Status } from "store/interfaces";
import { openRemoveJokesModal } from "store/jokes/removeJokesModalSlice";

export const RemoveJokesButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const jokesTableState = useAppSelector((state) => state.joke.jokesTable);
  const isButtonDisabled =
    jokesTableState.status === Status.LOADING ||
    jokesTableState.selectedIds.length === 0;

  return (
    <Button
      icon={<TrashIcon />}
      type="icon"
      color="danger"
      onClick={() =>
        dispatch(openRemoveJokesModal(jokesTableState.selectedIds))
      }
      disabled={isButtonDisabled}
    />
  );
};
