import { RefreshIcon } from "@heroicons/react/outline";
import { Button } from "components";
import React from "react";
import { useAppDispatch } from "hooks/useDispatch";
import { useAppSelector } from "hooks/useSelector";
import { Status } from "store/interfaces";
import { updateJokes } from "store/jokes/jokesTableSlice";

export const RefreshJokesButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const jokesTableState = useAppSelector((state) => state.joke.jokesTable);
  const isButtonLoading = jokesTableState.status === Status.LOADING;

  return (
    <Button
      icon={<RefreshIcon />}
      type="icon"
      color="secondary"
      onClick={() => dispatch(updateJokes())}
      loading={isButtonLoading}
    />
  );
};
