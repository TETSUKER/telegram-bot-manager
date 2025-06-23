import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addChat } from "api/chat";
import { fetchChats } from './chatsTableSlice';

export enum Status {
  IDLE = "IDLE",
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

interface AddChatModalSliceState {
  isOpened: boolean;
  status: Status;
}

const initialState: AddChatModalSliceState = {
  isOpened: false,
  status: Status.IDLE,
};

export const addChatRequest = createAsyncThunk(
  "addChatModel/update",
  async (chat: { name: string; chatId: string }, { dispatch }) => {
    const { name, chatId } = chat;
    await addChat({ name, chatId });
    dispatch(fetchChats());
  }
);

export const addChatModalSlice = createSlice({
  name: "addChatModel",
  initialState,
  reducers: {
    openAddChatModal(state): void {
      state.isOpened = true;
    },
    closeAddChatModal(state): void {
      state.isOpened = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addChatRequest.pending, (state) => {
      state.status = Status.LOADING;
    });
    builder.addCase(addChatRequest.fulfilled, (state) => {
      state.status = Status.SUCCESS;
      state.isOpened = false;
    });
    builder.addCase(addChatRequest.rejected, (state) => {
      state.status = Status.ERROR;
    });
  },
});

export const { openAddChatModal, closeAddChatModal } = addChatModalSlice.actions;

export default addChatModalSlice.reducer;
