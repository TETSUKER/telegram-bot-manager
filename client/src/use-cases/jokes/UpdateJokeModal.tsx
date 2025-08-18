import React from "react";
import { Button, Modal, TextInput } from "components";
import { XIcon } from "@heroicons/react/outline";
import { useAppSelector } from "hooks/useSelector";
import { useAppDispatch } from "hooks/useDispatch";
import { closeUpdateJokeModal, updateJokeRequest } from 'store/jokes/updateJokeModalSlice';
import { setJokeText } from 'store/jokes/updateJokeModalSlice';

export const UpdateJokeModal: React.FC = () => {
  const updateJokeModalState = useAppSelector(
    (state) => state.joke.updateJokeModal
  );
  const dispatch = useAppDispatch();

  return (
    <Modal
      isOpen={updateJokeModalState.isOpened}
      isLoading={false}
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-medium text-white">Update joke</h2>
          <XIcon
            className="size-6 text-slate-400 cursor-pointer"
            onClick={() => dispatch(closeUpdateJokeModal())}
          />
        </div>
      }
      content={
        <div className="flex flex-col gap-y-2">
          <TextInput
            label={updateJokeModalState.text.label}
            disabled={updateJokeModalState.text.disabled}
            onChange={(value) => dispatch(setJokeText(value))}
            initialValue={updateJokeModalState.text.value}
          />
        </div>
      }
      bottom={
        <div className="flex space-x-3 w-full pl-[50%]">
          <Button
            type="outline"
            color="secondary"
            text={updateJokeModalState.cancel.text}
            onClick={() => dispatch(closeUpdateJokeModal())}
          />
          <Button
            type="fill"
            color="primary"
            text={updateJokeModalState.apply.text}
            loading={updateJokeModalState.apply.loading}
            onClick={() => dispatch(updateJokeRequest())}
          />
        </div>
      }
    />
  );
};
