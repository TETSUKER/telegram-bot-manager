import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getBots, ServerBot } from "api/bots";
import { Status } from "store/interfaces";

interface BotsTableSliceState {
  bots: ServerBot[];
  selectedIds: number[];
  isAllSelected: boolean;
  isSomeSelected: boolean;
  status: Status;
}

const initialState: BotsTableSliceState = {
  bots: [],
  selectedIds: [],
  isAllSelected: false,
  isSomeSelected: false,
  status: Status.LOADING,
};

export const updateBotsTable = createAsyncThunk("bots/update", async () => {
  try {
    return await getBots();
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

const getIsAllSelected = (bots: ServerBot[], selectedIds: number[]) =>
  bots.length > 0 && selectedIds.length === bots.length;
const getIsSomeSelected = (bots: ServerBot[], selectedIds: number[]) =>
  selectedIds.length > 0 && !getIsAllSelected(bots, selectedIds);

export const botsTableSlice = createSlice({
  name: "bots",
  initialState,
  reducers: {
    toggleSelectItem(state, action: PayloadAction<number>): void {
      const newSelected = new Set(state.selectedIds);
      newSelected.has(action.payload)
        ? newSelected.delete(action.payload)
        : newSelected.add(action.payload);
      state.selectedIds = Array.from(newSelected);

      state.isAllSelected = getIsAllSelected(state.bots, state.selectedIds);
      state.isSomeSelected = getIsSomeSelected(state.bots, state.selectedIds);
    },
    toggleSelectAll(state): void {
      if (state.isAllSelected) {
        state.selectedIds = [];
      } else {
        state.selectedIds = state.bots.map((bot) => bot.id);
      }

      state.isAllSelected = getIsAllSelected(state.bots, state.selectedIds);
      state.isSomeSelected = getIsSomeSelected(state.bots, state.selectedIds);
    },
    clearSelection(state): void {
      state.selectedIds = [];
      state.isAllSelected = getIsAllSelected(state.bots, state.selectedIds);
      state.isSomeSelected = getIsSomeSelected(state.bots, state.selectedIds);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateBotsTable.pending, (state) => {
      state.status = Status.LOADING;
      state.bots = [];
    });
    builder.addCase(updateBotsTable.fulfilled, (state, action) => {
      state.status = Status.SUCCESS;
      if (action.payload) {
        state.bots = action.payload;
      }
    });
    builder.addCase(updateBotsTable.rejected, (state) => {
      state.status = Status.ERROR;
      state.bots = [];
    });
  },
});

export const { toggleSelectItem, toggleSelectAll, clearSelection } =
  botsTableSlice.actions;

export default botsTableSlice.reducer;
