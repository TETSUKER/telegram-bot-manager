import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteChats } from "api/chat";
import { updateChats, clearSelection } from "./chatsTableSlice";
import { ButtonState, ThunkApiConfig } from "store/interfaces";

interface DeleteChatsModalSliceState {
  isOpened: boolean;
  chatIds: number[];
  delete: ButtonState;
  cancel: ButtonState;
}

const initialState: DeleteChatsModalSliceState = {
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

export const deleteChatsRequest = createAsyncThunk<
  Promise<void>,
  void,
  ThunkApiConfig
>("deleteChatsModal/delete", async (_, { dispatch, getState }) => {
  const ids = getState().chat.deleteChatsModal.chatIds;
  await deleteChats(ids);
  dispatch(clearSelection());
  dispatch(updateChats());
});

export const deleteChatsModalSlice = createSlice({
  name: "deleteChatsModal",
  initialState,
  reducers: {
    openDeleteChatsModal(state, action: PayloadAction<number[]>): void {
      state.isOpened = true;
      state.chatIds = action.payload;
    },
    closeDeleteChatsModal(state): void {
      state.isOpened = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteChatsRequest.pending, (state) => {
      state.delete.loading = true;
    });
    builder.addCase(deleteChatsRequest.fulfilled, (state) => {
      state.delete.loading = false;
      state.isOpened = false;
    });
    builder.addCase(deleteChatsRequest.rejected, (state) => {
      state.delete.loading = false;
    });
  },
});

export const { openDeleteChatsModal, closeDeleteChatsModal } =
  deleteChatsModalSlice.actions;

export default deleteChatsModalSlice.reducer;
