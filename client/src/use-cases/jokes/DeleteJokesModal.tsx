import React from "react";
import { Button, Modal } from "components";
import { XIcon } from "@heroicons/react/outline";
import { useAppSelector } from "hooks/useSelector";
import { useAppDispatch } from "hooks/useDispatch";
import {
  closeDeleteJokesModal,
  deleteJokesRequest,
} from "store/jokes/deleteJokesModalSlice";

export const DeleteJokesModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const deleteJokesModalState = useAppSelector(
    (state) => state.joke.deleteJokesModal
  );

  return (
    <Modal
      isOpen={deleteJokesModalState.isOpened}
      isLoading={false}
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-medium text-white">Delete jokes</h2>
          <XIcon
            className="size-6 text-slate-400 cursor-pointer"
            onClick={() => dispatch(closeDeleteJokesModal())}
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
            text={deleteJokesModalState.cancel.text}
            type="outline"
            color="secondary"
            onClick={() => dispatch(closeDeleteJokesModal())}
          />
          <Button
            text={deleteJokesModalState.delete.text}
            type="fill"
            color="danger"
            loading={deleteJokesModalState.delete.loading}
            onClick={() => dispatch(deleteJokesRequest())}
          />
        </div>
      }
    />
  );
};
