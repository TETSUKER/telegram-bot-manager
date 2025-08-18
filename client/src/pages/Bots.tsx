import React from "react";
import {
  BotsTable,
  AddBotButton,
  AddBotModal,
  UpdateBotModal,
  RefreshBotsTableButton,
  DeleteBotsButton,
  DeleteBotsModal,
} from "use-cases/bots";

export const Bots: React.FC = () => {
  return (
    <>
      <div className="flex gap-x-2 py-[10px]">
        <RefreshBotsTableButton />
        <AddBotButton />
        <DeleteBotsButton />
      </div>
      <BotsTable />

      <AddBotModal />
      <UpdateBotModal />
      <DeleteBotsModal />
    </>
  );
};
