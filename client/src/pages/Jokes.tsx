import React from "react";
import {
  JokesTable,
  RemoveJokesModal,
  RefreshJokesButton,
  RemoveJokesButton,
  AddJokeButton,
  AddJokeModal,
  EditJokeModal,
} from "use-cases/jokes";

export const Jokes: React.FC = () => {
  return (
    <>
      <div className="flex gap-x-2 py-[10px]">
        <RefreshJokesButton />
        <AddJokeButton />
        <RemoveJokesButton />
      </div>
      <JokesTable />

      <AddJokeModal />
      <EditJokeModal />
      <RemoveJokesModal />
    </>
  );
};
