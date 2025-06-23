import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { removeChats } from "api/chat";
import { fetchChats, clearSelection } from "./chatsTableSlice";

export enum Status {
  IDLE = "IDLE",
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

interface RemoveChatsModalSliceState {
  isOpened: boolean;
  status: Status;
}

const initialState: RemoveChatsModalSliceState = {
  isOpened: false,
  status: Status.IDLE,
};

export const removeChatsRequest = createAsyncThunk(
  "removeChatsModal/remove",
  async (ids: number[], { dispatch }) => {
    await removeChats(ids);
    dispatch(clearSelection());
    dispatch(fetchChats());
  }
);

export const removeChatsModalSlice = createSlice({
  name: "removeChatsModal",
  initialState,
  reducers: {
    openRemoveChatsModal(state): void {
      state.isOpened = true;
    },
    closeRemoveChatsModal(state): void {
      state.isOpened = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(removeChatsRequest.pending, (state) => {
      state.status = Status.LOADING;
    });
    builder.addCase(removeChatsRequest.fulfilled, (state) => {
      state.status = Status.SUCCESS;
      state.isOpened = false;
    });
    builder.addCase(removeChatsRequest.rejected, (state) => {
      state.status = Status.ERROR;
    });
  },
});

export const { openRemoveChatsModal, closeRemoveChatsModal } =
  removeChatsModalSlice.actions;

export default removeChatsModalSlice.reducer;
