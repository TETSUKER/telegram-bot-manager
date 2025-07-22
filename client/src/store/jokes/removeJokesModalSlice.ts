import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { removeJokes } from "api/jokes";
import { ButtonState, ThunkApiConfig } from "store/interfaces";
import { clearSelection, updateJokes } from "./jokesTableSlice";

interface RemoveJokesModalSliceState {
  isOpened: boolean;
  jokesIds: number[];
  delete: ButtonState;
  cancel: ButtonState;
}

const initialState: RemoveJokesModalSliceState = {
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

export const removeJokesRequest = createAsyncThunk<
  Promise<void>,
  void,
  ThunkApiConfig
>("removeJokesModal/remove", async (_, { dispatch, getState }) => {
  const ids = getState().joke.removeJokesModal.jokesIds;
  await removeJokes(ids);
  dispatch(clearSelection());
  dispatch(updateJokes());
});

export const removeJokesModalSlice = createSlice({
  name: "removeJokesModal",
  initialState,
  reducers: {
    openRemoveJokesModal(state, action: PayloadAction<number[]>): void {
      state.isOpened = true;
      state.jokesIds = action.payload;
    },
    closeRemoveJokesModal(state): void {
      state.isOpened = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(removeJokesRequest.pending, (state) => {
      state.delete.loading = true;
    });
    builder.addCase(removeJokesRequest.fulfilled, (state) => {
      state.delete.loading = false;
      state.isOpened = false;
    });
    builder.addCase(removeJokesRequest.rejected, (state) => {
      state.delete.loading = false;
    });
  },
});

export const { openRemoveJokesModal, closeRemoveJokesModal } =
  removeJokesModalSlice.actions;

export default removeJokesModalSlice.reducer;
