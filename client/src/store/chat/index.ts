import { combineReducers } from '@reduxjs/toolkit';
import { chatsTableSlice } from './chatsTableSlice';
import { addChatModalSlice } from './addChatModalSlice';
import { deleteChatsModalSlice } from './deleteChatsModalSlice';
import { updateChatModalSlice } from './updateChatModalSlice';

const chatReducer = combineReducers({
  chatsTable: chatsTableSlice.reducer,
  addChatModal: addChatModalSlice.reducer,
  deleteChatsModal: deleteChatsModalSlice.reducer,
  updateChatModal: updateChatModalSlice.reducer,
});

export default chatReducer;
