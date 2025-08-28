import { combineReducers } from "@reduxjs/toolkit";
import { actionLogsTableSlice } from "./actionLogsTableSlice";

const actionLogsReducer = combineReducers({
  actionLogsTable: actionLogsTableSlice.reducer,
});

export default actionLogsReducer;
