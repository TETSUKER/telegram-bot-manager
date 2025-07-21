import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ButtonState, ThunkApiConfig } from "store/interfaces";
import { removeRules } from 'api/rules';
import { clearSelection, updateRules } from './rulesTableSlice';

interface RemoveRulesModalSliceState {
  isOpened: boolean;
  rulesIds: number[];
  delete: ButtonState;
  cancel: ButtonState;
}

const initialState: RemoveRulesModalSliceState = {
  isOpened: false,
  rulesIds: [],
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

export const removeRulesRequest = createAsyncThunk<
  Promise<void>,
  void,
  ThunkApiConfig
>("removeRulesModal/remove", async (_, { dispatch, getState }) => {
  const ids = getState().rule.removeRulesModal.rulesIds;
  await removeRules(ids);
  dispatch(clearSelection());
  dispatch(updateRules());
});

export const removeRulesModalSlice = createSlice({
  name: "removeRulesModal",
  initialState,
  reducers: {
    openRemoveRulesModal(state, action: PayloadAction<number[]>): void {
      state.isOpened = true;
      state.rulesIds = action.payload;
    },
    closeRemoveRulesModal(state): void {
      state.isOpened = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(removeRulesRequest.pending, (state) => {
      state.delete.loading = true;
    });
    builder.addCase(removeRulesRequest.fulfilled, (state) => {
      state.delete.loading = false;
      state.isOpened = false;
    });
    builder.addCase(removeRulesRequest.rejected, (state) => {
      state.delete.loading = false;
    });
  },
});

export const { openRemoveRulesModal, closeRemoveRulesModal } =
  removeRulesModalSlice.actions;

export default removeRulesModalSlice.reducer;
