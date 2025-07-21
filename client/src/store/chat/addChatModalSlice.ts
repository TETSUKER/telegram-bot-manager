import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addChat } from "api/chat";
import { fetchChats } from "./chatsTableSlice";
import { ButtonState, TextInputState, ThunkApiConfig } from "store/interfaces";

interface AddChatModalSliceState {
  isOpened: boolean;
  name: TextInputState;
  chatId: TextInputState;
  apply: ButtonState;
  cancel: ButtonState;
}

const initialState: AddChatModalSliceState = {
  isOpened: false,
  name: {
    value: "",
    label: "Chat name",
    placeholder: "",
    disabled: false,
    visible: true,
  },
  chatId: {
    value: "",
    label: "Chat id",
    placeholder: "",
    disabled: false,
    visible: true,
  },
  apply: {
    text: "Apply",
    loading: false,
    disabled: false,
  },
  cancel: {
    text: "Cancel",
    loading: false,
    disabled: false,
  },
};

export const addChatRequest = createAsyncThunk<
  Promise<void>,
  void,
  ThunkApiConfig
>("addChatModel/update", async (_, { dispatch, getState }) => {
  const state = getState();
  await addChat({
    name: state.chat.addChatModal.name.value,
    chatId: state.chat.addChatModal.chatId.value,
  });
  dispatch(fetchChats());
});

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
    setChatName(state, action: PayloadAction<string>): void {
      state.name.value = action.payload;
    },
    setChatId(state, action: PayloadAction<string>): void {
      state.chatId.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addChatRequest.pending, (state) => {
      state.name.disabled = true;
      state.chatId.disabled = true;
      state.apply.loading = true;
    });
    builder.addCase(addChatRequest.fulfilled, (state) => {
      state.isOpened = false;
      state.name.disabled = false;
      state.chatId.disabled = false;
      state.apply.loading = false;
    });
    builder.addCase(addChatRequest.rejected, (state) => {
      state.name.disabled = false;
      state.chatId.disabled = false;
      state.apply.loading = false;
    });
  },
});

export const { openAddChatModal, closeAddChatModal, setChatName, setChatId } =
  addChatModalSlice.actions;

export default addChatModalSlice.reducer;
