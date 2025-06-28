import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { removeChats } from "api/chat";
import { fetchChats, clearSelection } from "./chatsTableSlice";
import { ButtonState, ThunkApiConfig } from "store/interfaces";

interface RemoveChatsModalSliceState {
  isOpened: boolean;
  chatIds: number[];
  delete: ButtonState;
  cancel: ButtonState;
}

const initialState: RemoveChatsModalSliceState = {
  isOpened: false,
  chatIds: [],
  delete: {
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

export const removeChatsRequest = createAsyncThunk<
  Promise<void>,
  void,
  ThunkApiConfig
>("removeChatsModal/remove", async (_, { dispatch, getState }) => {
  const ids = getState().chat.removeChatModal.chatIds;
  await removeChats(ids);
  dispatch(clearSelection());
  dispatch(fetchChats());
});

export const removeChatsModalSlice = createSlice({
  name: "removeChatsModal",
  initialState,
  reducers: {
    openRemoveChatsModal(state, action: PayloadAction<number[]>): void {
      state.isOpened = true;
      state.chatIds = action.payload;
    },
    closeRemoveChatsModal(state): void {
      state.isOpened = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(removeChatsRequest.pending, (state) => {
      state.delete.loading = true;
    });
    builder.addCase(removeChatsRequest.fulfilled, (state) => {
      state.delete.loading = false;
      state.isOpened = false;
    });
    builder.addCase(removeChatsRequest.rejected, (state) => {
      state.delete.loading = false;
    });
  },
});

export const { openRemoveChatsModal, closeRemoveChatsModal } =
  removeChatsModalSlice.actions;

export default removeChatsModalSlice.reducer;
