import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteBots } from "api/bots";
import { ButtonState, ThunkApiConfig } from "store/interfaces";
import { clearSelection, updateBotsTable } from "./botsTableSlice";

interface DeleteBotsModalSliceState {
  isOpened: boolean;
  botIds: number[];
  delete: ButtonState;
  cancel: ButtonState;
}

const initialState: DeleteBotsModalSliceState = {
  isOpened: false,
  botIds: [],
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

export const deleteBotsRequest = createAsyncThunk<
  Promise<void>,
  void,
  ThunkApiConfig
>("deleteBotsModal/delete", async (_, { dispatch, getState }) => {
  try {
    const ids = getState().bot.deleteBotsModal.botIds;
    await deleteBots(ids);
    dispatch(closeDeleteBotsModal());
    dispatch(clearSelection());
    dispatch(updateBotsTable());
  } catch (err) {
    if ((err as any).error) {
      const error = (err as any).error;
      const errMessage = (error as Error).message;
      alert(errMessage);
    } else {
      alert(err);
    }
  }
});

export const deleteBotsModalSlice = createSlice({
  name: "deleteBotsModal",
  initialState,
  reducers: {
    openDeleteBotsModal(state, action: PayloadAction<number[]>): void {
      state.isOpened = true;
      state.botIds = action.payload;
    },
    closeDeleteBotsModal(state): void {
      state.isOpened = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteBotsRequest.pending, (state) => {
      state.delete.loading = true;
    });
    builder.addCase(deleteBotsRequest.fulfilled, (state) => {
      state.delete.loading = false;
    });
    builder.addCase(deleteBotsRequest.rejected, (state) => {
      state.delete.loading = false;
    });
  },
});

export const { openDeleteBotsModal, closeDeleteBotsModal } =
  deleteBotsModalSlice.actions;

export default deleteBotsModalSlice.reducer;
