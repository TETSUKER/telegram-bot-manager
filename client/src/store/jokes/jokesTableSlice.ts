import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getJokes, ServerJoke } from "api/jokes";
import { Status } from "store/interfaces";

interface JokesTableSliceState {
  jokes: ServerJoke[];
  selectedIds: number[];
  isAllSelected: boolean;
  isSomeSelected: boolean;
  status: Status;
}

const initialState: JokesTableSliceState = {
  jokes: [],
  selectedIds: [],
  isAllSelected: false,
  isSomeSelected: false,
  status: Status.LOADING,
};

export const updateJokes = createAsyncThunk("jokes/update", async () => {
  return await getJokes();
});

const getIsAllSelected = (jokes: ServerJoke[], selectedIds: number[]) =>
  jokes.length > 0 && selectedIds.length === jokes.length;
const getIsSomeSelected = (jokes: ServerJoke[], selectedIds: number[]) =>
  selectedIds.length > 0 && !getIsAllSelected(jokes, selectedIds);

export const jokesTableSlice = createSlice({
  name: "jokes",
  initialState,
  reducers: {
    toggleSelectItem(state, action: PayloadAction<number>): void {
      const newSelected = new Set(state.selectedIds);
      newSelected.has(action.payload)
        ? newSelected.delete(action.payload)
        : newSelected.add(action.payload);
      state.selectedIds = Array.from(newSelected);

      state.isAllSelected = getIsAllSelected(state.jokes, state.selectedIds);
      state.isSomeSelected = getIsSomeSelected(state.jokes, state.selectedIds);
    },
    toggleSelectAll(state): void {
      if (state.isAllSelected) {
        state.selectedIds = [];
      } else {
        state.selectedIds = state.jokes.map((chat) => chat.id);
      }

      state.isAllSelected = getIsAllSelected(state.jokes, state.selectedIds);
      state.isSomeSelected = getIsSomeSelected(state.jokes, state.selectedIds);
    },
    clearSelection(state): void {
      state.selectedIds = [];
      state.isAllSelected = getIsAllSelected(state.jokes, state.selectedIds);
      state.isSomeSelected = getIsSomeSelected(state.jokes, state.selectedIds);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateJokes.pending, (state) => {
      state.status = Status.LOADING;
      state.jokes = [];
    });
    builder.addCase(updateJokes.fulfilled, (state, action) => {
      state.status = Status.SUCCESS;
      state.jokes = action.payload;
    });
    builder.addCase(updateJokes.rejected, (state) => {
      state.status = Status.ERROR;
      state.jokes = [];
    });
  },
});

export const { toggleSelectItem, toggleSelectAll, clearSelection } =
  jokesTableSlice.actions;

export default jokesTableSlice.reducer;
