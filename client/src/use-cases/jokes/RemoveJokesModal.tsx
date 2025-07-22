import React from "react";
import { Button, Modal } from "components";
import { XIcon } from "@heroicons/react/outline";
import { useAppSelector } from "hooks/useSelector";
import { useAppDispatch } from "hooks/useDispatch";
import {
  closeRemoveJokesModal,
  removeJokesRequest,
} from "store/jokes/removeJokesModalSlice";

export const RemoveJokesModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const removeJokesModalState = useAppSelector(
    (state) => state.joke.removeJokesModal
  );

  return (
    <Modal
      isOpen={removeJokesModalState.isOpened}
      isLoading={false}
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-medium text-white">Remove jokes</h2>
          <XIcon
            className="size-6 text-slate-400 cursor-pointer"
            onClick={() => dispatch(closeRemoveJokesModal())}
          />
        </div>
      }
      content={
        <span className="text-white">
          Do you really want to delete the selected jokes?
        </span>
      }
      bottom={
        <div className="flex space-x-3 w-full pl-[50%]">
          <Button
            text={removeJokesModalState.cancel.text}
            type="outline"
            color="secondary"
            onClick={() => dispatch(closeRemoveJokesModal())}
          />
          <Button
            text={removeJokesModalState.delete.text}
            type="fill"
            color="danger"
            loading={removeJokesModalState.delete.loading}
            onClick={() => dispatch(removeJokesRequest())}
          />
        </div>
      }
    />
  );
};
