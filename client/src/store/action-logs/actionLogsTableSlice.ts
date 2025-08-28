import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getActionLogs, ServerActionLog } from "api/actionLogs";
import { Status } from "store/interfaces";

interface ActionLogsTableSliceState {
  actionLogs: ServerActionLog[];
  status: Status;
}

const initialState: ActionLogsTableSliceState = {
  actionLogs: [],
  status: Status.LOADING,
};

export const updateActionLogsTable = createAsyncThunk(
  "actionLogs/update",
  async () => {
    return await getActionLogs();
  }
);

export const actionLogsTableSlice = createSlice({
  name: "actionLogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateActionLogsTable.pending, (state) => {
      state.status = Status.LOADING;
      state.actionLogs = [];
    });
    builder.addCase(updateActionLogsTable.fulfilled, (state, action) => {
      state.status = Status.SUCCESS;
      if (action.payload) {
        state.actionLogs = action.payload;
      }
    });
    builder.addCase(updateActionLogsTable.rejected, (state) => {
      state.status = Status.ERROR;
      state.actionLogs = [];
    });
  },
});

export default actionLogsTableSlice.reducer;
