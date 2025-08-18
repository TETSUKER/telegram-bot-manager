import { PlusIcon } from "@heroicons/react/outline";
import { Button } from "components";
import { useAppDispatch } from "hooks/useDispatch";
import { useAppSelector } from "hooks/useSelector";
import React from "react";
import { Status } from "store/interfaces";
import { openCreateJokeModal } from "store/jokes/createJokeModalSlice";

export const CreateJokeButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const jokesTableState = useAppSelector((state) => state.joke.jokesTable);
  const isButtonDisabled = jokesTableState.status === Status.LOADING;

  return (
    <Button
      icon={<PlusIcon />}
      type="icon"
      color="secondary"
      onClick={() => dispatch(openCreateJokeModal())}
      disabled={isButtonDisabled}
    />
  );
};
