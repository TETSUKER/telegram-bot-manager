import { configureStore } from "@reduxjs/toolkit";
import { chatsTableSlice } from './chatsTableSlice';
import { addChatModalSlice } from './addChatModalSlice';
import { removeChatsModalSlice } from './removeChatsModalSlice';
import { editChatModalSlice } from './editChatModalSlice';

export const store = configureStore({
  reducer: {
    chatsTable: chatsTableSlice.reducer,
    addChatModal: addChatModalSlice.reducer,
    removeChatModal: removeChatsModalSlice.reducer,
    editChatModal: editChatModalSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
