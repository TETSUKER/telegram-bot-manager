import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ButtonState, ThunkApiConfig } from "store/interfaces";
import { deleteRules } from 'api/rules';
import { clearSelection, updateRules } from './rulesTableSlice';

interface DeleteRulesModalSliceState {
  isOpened: boolean;
  rulesIds: number[];
  delete: ButtonState;
  cancel: ButtonState;
}

const initialState: DeleteRulesModalSliceState = {
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

export const deleteRulesRequest = createAsyncThunk<
  Promise<void>,
  void,
  ThunkApiConfig
>("deleteRulesModal/delete", async (_, { dispatch, getState }) => {
  const ids = getState().rule.deleteRulesModal.rulesIds;
  await deleteRules(ids);
  dispatch(clearSelection());
  dispatch(updateRules());
});

export const deleteRulesModalSlice = createSlice({
  name: "deleteRulesModal",
  initialState,
  reducers: {
    openDeleteRulesModal(state, action: PayloadAction<number[]>): void {
      state.isOpened = true;
      state.rulesIds = action.payload;
    },
    closeDeleteRulesModal(state): void {
      state.isOpened = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteRulesRequest.pending, (state) => {
      state.delete.loading = true;
    });
    builder.addCase(deleteRulesRequest.fulfilled, (state) => {
      state.delete.loading = false;
      state.isOpened = false;
    });
    builder.addCase(deleteRulesRequest.rejected, (state) => {
      state.delete.loading = false;
    });
  },
});

export const { openDeleteRulesModal, closeDeleteRulesModal } =
  deleteRulesModalSlice.actions;

export default deleteRulesModalSlice.reducer;
