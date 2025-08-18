import { combineReducers } from '@reduxjs/toolkit';
import { botsTableSlice } from './botsTableSlice';
import { addBotModalSlice } from './addBotModalSlice';
import { deleteBotsModalSlice } from './deleteBotsModalSlice';
import { updateBotModalSlice } from './updateBotModalSlice';

const botReducer = combineReducers({
  botsTable: botsTableSlice.reducer,
  addBotModal: addBotModalSlice.reducer,
  deleteBotsModal: deleteBotsModalSlice.reducer,
  updateBotModal: updateBotModalSlice.reducer,
});

export default botReducer;
