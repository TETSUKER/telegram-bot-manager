import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EditChat, editChat } from "api/chat";
import { fetchChats } from "./chatsTableSlice";
import { ButtonState, TextInputState, ThunkApiConfig } from "store/interfaces";

interface EditChatModalSliceState {
  isOpened: boolean;
  id: number;
  name: TextInputState;
  chatId: TextInputState;
  apply: ButtonState;
  cancel: ButtonState;
}

const initialState: EditChatModalSliceState = {
  isOpened: false,
  id: 0,
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

export const editChatRequest = createAsyncThunk<
  Promise<void>,
  void,
  ThunkApiConfig
>("editChatModel/edit", async (_, { dispatch, getState }) => {
  const state = getState();
  await editChat({
    id: state.chat.editChatModal.id,
    name: state.chat.editChatModal.name.value,
    chatId: state.chat.editChatModal.chatId.value,
  });
  dispatch(fetchChats());
});

export const editChatModalSlice = createSlice({
  name: "editRuleModel",
  initialState,
  reducers: {
    openEditChatModal(state, action: PayloadAction<EditChat>): void {
      state.isOpened = true;
      state.id = action.payload.id;
      state.name.value = action.payload.name ?? "";
      state.chatId.value = action.payload.chatId ?? "";
    },
    closeEditChatModal(state): void {
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
    builder.addCase(editChatRequest.pending, (state) => {
      state.name.disabled = true;
      state.chatId.disabled = true;
      state.apply.loading = true;
    });
    builder.addCase(editChatRequest.fulfilled, (state) => {
      state.isOpened = false;
      state.name.disabled = false;
      state.chatId.disabled = false;
      state.apply.loading = false;
    });
    builder.addCase(editChatRequest.rejected, (state) => {
      state.name.disabled = false;
      state.chatId.disabled = false;
      state.apply.loading = false;
    });
  },
});

export const { openEditChatModal, closeEditChatModal, setChatName, setChatId } =
  editChatModalSlice.actions;

export default editChatModalSlice.reducer;
