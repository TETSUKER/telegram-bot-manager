import React from "react";
import {
  ChatsTable,
  AddChatModal,
  DeleteChatsModal,
  UpdateChatModal,
  AddChatButton,
  DeleteChatsButton,
  RefreshChatsButton,
} from "use-cases";

export const Chats: React.FC = () => {
  return (
    <>
      <div className="flex gap-x-2 py-[10px]">
        <RefreshChatsButton />
        <AddChatButton />
        <DeleteChatsButton />
      </div>
      <ChatsTable />

      <AddChatModal />
      <DeleteChatsModal />
      <UpdateChatModal />
    </>
  );
};
