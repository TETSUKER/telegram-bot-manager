import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UpdateChat, updateChat } from "api/chat";
import { updateChats } from "./chatsTableSlice";
import { ButtonState, TextInputState, ThunkApiConfig } from "store/interfaces";
import { isServerError } from "api/serverError";

interface UpdateChatModalSliceState {
  isOpened: boolean;
  id: number;
  name: TextInputState;
  chatId: TextInputState;
  apply: ButtonState;
  cancel: ButtonState;
}

const initialState: UpdateChatModalSliceState = {
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

export const updateChatRequest = createAsyncThunk<
  Promise<void>,
  void,
  ThunkApiConfig
>("updateChatModel/update", async (_, { dispatch, getState }) => {
  try {
    const state = getState();
    await updateChat({
      id: state.chat.updateChatModal.id,
      name: state.chat.updateChatModal.name.value,
      chatId: state.chat.updateChatModal.chatId.value,
    });
    dispatch(closeUpdateChatModal());
    dispatch(updateChats());
  } catch (err) {
    if (isServerError(err)) {
      const errMessage = err.error.message;
      alert(errMessage);
    } else {
      alert("Unknown error while update chat :(");
    }
  }
});

export const updateChatModalSlice = createSlice({
  name: "updateRuleModel",
  initialState,
  reducers: {
    openUpdateChatModal(state, action: PayloadAction<UpdateChat>): void {
      state.isOpened = true;
      state.id = action.payload.id;
      state.name.value = action.payload.name ?? "";
      state.chatId.value = action.payload.chatId ?? "";
    },
    closeUpdateChatModal(state): void {
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
    builder.addCase(updateChatRequest.pending, (state) => {
      state.name.disabled = true;
      state.chatId.disabled = true;
      state.apply.loading = true;
    });
    builder.addCase(updateChatRequest.fulfilled, (state) => {
      state.name.disabled = false;
      state.chatId.disabled = false;
      state.apply.loading = false;
    });
    builder.addCase(updateChatRequest.rejected, (state) => {
      state.name.disabled = false;
      state.chatId.disabled = false;
      state.apply.loading = false;
    });
  },
});

export const {
  openUpdateChatModal,
  closeUpdateChatModal,
  setChatName,
  setChatId,
} = updateChatModalSlice.actions;

export default updateChatModalSlice.reducer;
