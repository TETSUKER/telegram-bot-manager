import React from "react";
import {
  JokesTable,
  DeleteJokesModal,
  RefreshJokesButton,
  DeleteJokesButton,
  CreateJokeButton,
  CreateJokeModal,
  UpdateJokeModal,
} from "use-cases/jokes";

export const Jokes: React.FC = () => {
  return (
    <>
      <div className="flex gap-x-2 py-[10px]">
        <RefreshJokesButton />
        <CreateJokeButton />
        <DeleteJokesButton />
      </div>
      <JokesTable />

      <CreateJokeModal />
      <UpdateJokeModal />
      <DeleteJokesModal />
    </>
  );
};
