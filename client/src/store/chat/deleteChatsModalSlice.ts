import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteChats } from "api/chat";
import { updateChats, clearSelection } from "./chatsTableSlice";
import { ButtonState, ThunkApiConfig } from "store/interfaces";
import { isServerError } from "api/serverError";

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
  try {
    const ids = getState().chat.deleteChatsModal.chatIds;
    await deleteChats(ids);
    dispatch(closeDeleteChatsModal());
    dispatch(clearSelection());
    dispatch(updateChats());
  } catch (err) {
    if (isServerError(err)) {
      const errMessage = err.error.message;
      alert(errMessage);
    } else {
      alert("Unknown error while delete chats :(");
    }
  }
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
    });
    builder.addCase(deleteChatsRequest.rejected, (state) => {
      state.delete.loading = false;
    });
  },
});

export const { openDeleteChatsModal, closeDeleteChatsModal } =
  deleteChatsModalSlice.actions;

export default deleteChatsModalSlice.reducer;
