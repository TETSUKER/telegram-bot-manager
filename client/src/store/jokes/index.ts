import { combineReducers } from "@reduxjs/toolkit";
import { jokesTableSlice } from './jokesTableSlice';
import { addJokeModalSlice } from './addJokeModalSlice';
import { editJokeModalSlice } from './editJokeModalSlice';
import { removeJokesModalSlice } from './removeJokesModalSlice';

const jokesReducer = combineReducers({
  jokesTable: jokesTableSlice.reducer,
  addJokeModal: addJokeModalSlice.reducer,
  editJokeModal: editJokeModalSlice.reducer,
  removeJokesModal: removeJokesModalSlice.reducer,
});

export default jokesReducer;
