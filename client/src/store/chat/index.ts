import { combineReducers } from '@reduxjs/toolkit';
import { chatsTableSlice } from './chatsTableSlice';
import { addChatModalSlice } from './addChatModalSlice';
import { removeChatsModalSlice } from './removeChatsModalSlice';
import { editChatModalSlice } from './editChatModalSlice';

const chatReducer = combineReducers({
  chatsTable: chatsTableSlice.reducer,
  addChatModal: addChatModalSlice.reducer,
  removeChatModal: removeChatsModalSlice.reducer,
  editChatModal: editChatModalSlice.reducer,
});

export default chatReducer;
