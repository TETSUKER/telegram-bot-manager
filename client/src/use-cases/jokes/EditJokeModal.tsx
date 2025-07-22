import React from "react";
import { Button, Modal, TextInput } from "components";
import { XIcon } from "@heroicons/react/outline";
import { useAppSelector } from "hooks/useSelector";
import { useAppDispatch } from "hooks/useDispatch";
import { closeEditJokeModal, editJokeRequest } from 'store/jokes/editJokeModalSlice';
import { setJokeText } from 'store/jokes/editJokeModalSlice';

export const EditJokeModal: React.FC = () => {
  const editJokeModalState = useAppSelector(
    (state) => state.joke.editJokeModal
  );
  const dispatch = useAppDispatch();

  return (
    <Modal
      isOpen={editJokeModalState.isOpened}
      isLoading={false}
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-medium text-white">Edit joke</h2>
          <XIcon
            className="size-6 text-slate-400 cursor-pointer"
            onClick={() => dispatch(closeEditJokeModal())}
          />
        </div>
      }
      content={
        <div className="flex flex-col gap-y-2">
          <TextInput
            label={editJokeModalState.text.label}
            disabled={editJokeModalState.text.disabled}
            onChange={(value) => dispatch(setJokeText(value))}
            initialValue={editJokeModalState.text.value}
          />
        </div>
      }
      bottom={
        <div className="flex space-x-3 w-full pl-[50%]">
          <Button
            type="outline"
            color="secondary"
            text={editJokeModalState.cancel.text}
            onClick={() => dispatch(closeEditJokeModal())}
          />
          <Button
            type="fill"
            color="primary"
            text={editJokeModalState.apply.text}
            loading={editJokeModalState.apply.loading}
            onClick={() => dispatch(editJokeRequest())}
          />
        </div>
      }
    />
  );
};
