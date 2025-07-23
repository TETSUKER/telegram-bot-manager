import { combineReducers } from '@reduxjs/toolkit';
import { botsTableSlice } from './botsTableSlice';
import { createBotModalSlice } from './createBotModalSlice';
import { deleteBotsModalSlice } from './deleteBotsModalSlice';
import { updateBotModalSlice } from './updateBotModalSlice';

const botReducer = combineReducers({
  botsTable: botsTableSlice.reducer,
  createBotModal: createBotModalSlice.reducer,
  deleteBotsModal: deleteBotsModalSlice.reducer,
  updateBotModal: updateBotModalSlice.reducer,
});

export default botReducer;
