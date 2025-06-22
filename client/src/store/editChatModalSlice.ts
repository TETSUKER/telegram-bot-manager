import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EditChat, editChat } from "api/chat";
import { fetchChats } from "./chatsTableSlice";

export enum Status {
  IDLE = "IDLE",
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

interface EditChatModalSliceState {
  isOpened: boolean;
  id: number;
  name: string;
  chatId: string;
  status: Status;
}

const initialState: EditChatModalSliceState = {
  isOpened: false,
  id: 0,
  name: "",
  chatId: "",
  status: Status.IDLE,
};

export const editChatRequest = createAsyncThunk(
  "editChatModel/edit",
  async (chat: EditChat, { dispatch }) => {
    await editChat(chat);
    dispatch(fetchChats());
  }
);

export const editChatModalSlice = createSlice({
  name: "editChatModel",
  initialState,
  reducers: {
    openEditChatModal(state, action: PayloadAction<EditChat>): void {
      state.isOpened = true;
      state.id = action.payload.id;
      state.name = action.payload.name ?? "";
      state.chatId = action.payload.chatId ?? "";
    },
    closeEditChatModal(state): void {
      state.isOpened = false;
    },
    setChatName(state, action: PayloadAction<string>): void {
      state.name = action.payload;
    },
    setChatId(state, action: PayloadAction<string>): void {
      state.chatId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(editChatRequest.pending, (state) => {
      state.status = Status.LOADING;
    });
    builder.addCase(editChatRequest.fulfilled, (state, action) => {
      state.status = Status.SUCCESS;
      state.isOpened = false;
    });
    builder.addCase(editChatRequest.rejected, (state) => {
      state.status = Status.ERROR;
    });
  },
});

export const { openEditChatModal, closeEditChatModal, setChatName, setChatId } =
  editChatModalSlice.actions;

export default editChatModalSlice.reducer;
