import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getRules, ServerRule } from 'api/rules';
import { Status } from "store/interfaces";

interface RulesTableSliceState {
  rules: ServerRule[];
  selectedIds: number[];
  isAllSelected: boolean;
  isSomeSelected: boolean;
  status: Status;
}

const initialState: RulesTableSliceState = {
  rules: [],
  selectedIds: [],
  isAllSelected: false,
  isSomeSelected: false,
  status: Status.LOADING,
};

export const updateRules = createAsyncThunk("rules/update", async () => {
  return await getRules();
});

const getIsAllSelected = (rules: ServerRule[], selectedIds: number[]) =>
  rules.length > 0 && selectedIds.length === rules.length;
const getIsSomeSelected = (rules: ServerRule[], selectedIds: number[]) =>
  selectedIds.length > 0 && !getIsAllSelected(rules, selectedIds);

export const rulesTableSlice = createSlice({
  name: "rules",
  initialState,
  reducers: {
    toggleSelectItem(state, action: PayloadAction<number>): void {
      const newSelected = new Set(state.selectedIds);
      newSelected.has(action.payload)
        ? newSelected.delete(action.payload)
        : newSelected.add(action.payload);
      state.selectedIds = Array.from(newSelected);

      state.isAllSelected = getIsAllSelected(state.rules, state.selectedIds);
      state.isSomeSelected = getIsSomeSelected(state.rules, state.selectedIds);
    },
    toggleSelectAll(state): void {
      if (state.isAllSelected) {
        state.selectedIds = [];
      } else {
        state.selectedIds = state.rules.map((chat) => chat.id);
      }

      state.isAllSelected = getIsAllSelected(state.rules, state.selectedIds);
      state.isSomeSelected = getIsSomeSelected(state.rules, state.selectedIds);
    },
    clearSelection(state): void {
      state.selectedIds = [];
      state.isAllSelected = getIsAllSelected(state.rules, state.selectedIds);
      state.isSomeSelected = getIsSomeSelected(state.rules, state.selectedIds);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateRules.pending, (state) => {
      state.status = Status.LOADING;
      state.rules = [];
    });
    builder.addCase(updateRules.fulfilled, (state, action) => {
      state.status = Status.SUCCESS;
      state.rules = action.payload;
    });
    builder.addCase(updateRules.rejected, (state) => {
      state.status = Status.ERROR;
      state.rules = [];
    });
  },
});

export const { toggleSelectItem, toggleSelectAll, clearSelection } =
  rulesTableSlice.actions;

export default rulesTableSlice.reducer;
