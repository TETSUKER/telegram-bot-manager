import React from "react";
import { Button, Modal, TextInput } from "components";
import { XIcon } from "@heroicons/react/outline";
import { useAppSelector } from "hooks/useSelector";
import { useAppDispatch } from "hooks/useDispatch";
import {
  createJokeRequest,
  closeCreateJokeModal,
  setJokeText,
} from "store/jokes/createJokeModalSlice";

export const CreateJokeModal: React.FC = () => {
  const createJokeModalState = useAppSelector((state) => state.joke.createJokeModal);
  const dispatch = useAppDispatch();

  return (
    <Modal
      isOpen={createJokeModalState.isOpened}
      isLoading={false}
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-medium text-white">Create joke</h2>
          <XIcon
            className="size-6 text-slate-400 cursor-pointer"
            onClick={() => dispatch(closeCreateJokeModal())}
          />
        </div>
      }
      content={
        <div className="flex flex-col gap-y-2">
          <TextInput
            label={createJokeModalState.text.label}
            disabled={createJokeModalState.text.disabled}
            onChange={(value) => dispatch(setJokeText(value))}
          />
        </div>
      }
      bottom={
        <div className="flex space-x-3 w-full pl-[50%]">
          <Button
            text={createJokeModalState.cancel.text}
            type="outline"
            color="secondary"
            onClick={() => dispatch(closeCreateJokeModal())}
          />
          <Button
            text={createJokeModalState.apply.text}
            type="fill"
            color="primary"
            loading={createJokeModalState.apply.loading}
            onClick={() => dispatch(createJokeRequest())}
          />
        </div>
      }
    />
  );
};
