import React from "react";
import {
  ChatsTable,
  AddChatModal,
  RemoveChatsModal,
  EditChatModal,
  AddChatButton,
  RemoveChatsButton,
  RefreshChatsButton,
} from "use-cases";

export const Chats: React.FC = () => {
  return (
    <>
      <div className="flex gap-x-2 py-[10px]">
        <RefreshChatsButton />
        <AddChatButton />
        <RemoveChatsButton />
      </div>
      <ChatsTable />

      <AddChatModal />
      <RemoveChatsModal />
      <EditChatModal />
    </>
  );
};
