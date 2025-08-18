import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteJokes } from "api/jokes";
import { ButtonState, ThunkApiConfig } from "store/interfaces";
import { clearSelection, updateJokes } from "./jokesTableSlice";

interface DeleteJokesModalSliceState {
  isOpened: boolean;
  jokesIds: number[];
  delete: ButtonState;
  cancel: ButtonState;
}

const initialState: DeleteJokesModalSliceState = {
  isOpened: false,
  jokesIds: [],
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

export const deleteJokesRequest = createAsyncThunk<
  Promise<void>,
  void,
  ThunkApiConfig
>("deleteJokesModal/delete", async (_, { dispatch, getState }) => {
  const ids = getState().joke.deleteJokesModal.jokesIds;
  await deleteJokes(ids);
  dispatch(clearSelection());
  dispatch(updateJokes());
});

export const deleteJokesModalSlice = createSlice({
  name: "deleteJokesModal",
  initialState,
  reducers: {
    openDeleteJokesModal(state, action: PayloadAction<number[]>): void {
      state.isOpened = true;
      state.jokesIds = action.payload;
    },
    closeDeleteJokesModal(state): void {
      state.isOpened = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteJokesRequest.pending, (state) => {
      state.delete.loading = true;
    });
    builder.addCase(deleteJokesRequest.fulfilled, (state) => {
      state.delete.loading = false;
      state.isOpened = false;
    });
    builder.addCase(deleteJokesRequest.rejected, (state) => {
      state.delete.loading = false;
    });
  },
});

export const { openDeleteJokesModal, closeDeleteJokesModal } =
  deleteJokesModalSlice.actions;

export default deleteJokesModalSlice.reducer;
