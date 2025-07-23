import React from "react";
import {
  BotsTable,
  CreateBotButton,
  CreateBotModal,
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
        <CreateBotButton />
        <DeleteBotsButton />
      </div>
      <BotsTable />

      <CreateBotModal />
      <UpdateBotModal />
      <DeleteBotsModal />
    </>
  );
};
