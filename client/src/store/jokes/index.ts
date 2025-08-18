import { combineReducers } from "@reduxjs/toolkit";
import { jokesTableSlice } from './jokesTableSlice';
import { createJokeModalSlice } from './createJokeModalSlice';
import { updateJokeModalSlice } from './updateJokeModalSlice';
import { deleteJokesModalSlice } from './deleteJokesModalSlice';

const jokesReducer = combineReducers({
  jokesTable: jokesTableSlice.reducer,
  createJokeModal: createJokeModalSlice.reducer,
  updateJokeModal: updateJokeModalSlice.reducer,
  deleteJokesModal: deleteJokesModalSlice.reducer,
});

export default jokesReducer;
