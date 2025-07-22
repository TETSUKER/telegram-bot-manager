import React from "react";
import { Button, Modal, TextInput } from "components";
import { XIcon } from "@heroicons/react/outline";
import { useAppSelector } from "hooks/useSelector";
import { useAppDispatch } from "hooks/useDispatch";
import {
  addJokeRequest,
  closeAddJokeModal,
  setJokeText,
} from "store/jokes/addJokeModalSlice";

export const AddJokeModal: React.FC = () => {
  const addJokeModalState = useAppSelector((state) => state.joke.addJokeModal);
  const dispatch = useAppDispatch();

  return (
    <Modal
      isOpen={addJokeModalState.isOpened}
      isLoading={false}
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-medium text-white">Add joke</h2>
          <XIcon
            className="size-6 text-slate-400 cursor-pointer"
            onClick={() => dispatch(closeAddJokeModal())}
          />
        </div>
      }
      content={
        <div className="flex flex-col gap-y-2">
          <TextInput
            label={addJokeModalState.text.label}
            disabled={addJokeModalState.text.disabled}
            onChange={(value) => dispatch(setJokeText(value))}
          />
        </div>
      }
      bottom={
        <div className="flex space-x-3 w-full pl-[50%]">
          <Button
            text={addJokeModalState.cancel.text}
            type="outline"
            color="secondary"
            onClick={() => dispatch(closeAddJokeModal())}
          />
          <Button
            text={addJokeModalState.apply.text}
            type="fill"
            color="primary"
            loading={addJokeModalState.apply.loading}
            onClick={() => dispatch(addJokeRequest())}
          />
        </div>
      }
    />
  );
};
