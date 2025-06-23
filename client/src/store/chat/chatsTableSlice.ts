import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getChats, ServerChat } from "api/chat";

export enum Status {
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

interface ChatsTableSliceState {
  chats: ServerChat[];
  selectedIds: number[];
  isAllSelected: boolean;
  isSomeSelected: boolean;
  status: Status;
}

const initialState: ChatsTableSliceState = {
  chats: [],
  selectedIds: [],
  isAllSelected: false,
  isSomeSelected: false,
  status: Status.LOADING,
};

export const fetchChats = createAsyncThunk("chats/update", async () => {
  return await getChats();
});

const getIsAllSelected = (chats: ServerChat[], selectedIds: number[]) => chats.length > 0 && selectedIds.length === chats.length;
const getIsSomeSelected = (chats: ServerChat[], selectedIds: number[]) => selectedIds.length > 0 && !getIsAllSelected(chats, selectedIds);

export const chatsTableSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    toggleSelectItem(state, action: PayloadAction<number>): void {
      const newSelected = new Set(state.selectedIds);
      newSelected.has(action.payload)
        ? newSelected.delete(action.payload)
        : newSelected.add(action.payload);
      state.selectedIds = Array.from(newSelected);

      state.isAllSelected = getIsAllSelected(state.chats, state.selectedIds);
      state.isSomeSelected = getIsSomeSelected(state.chats, state.selectedIds);
    },
    toggleSelectAll(state): void {
      if (state.isAllSelected) {
        state.selectedIds = [];
      } else {
        state.selectedIds = state.chats.map((chat) => chat.id);
      }

      state.isAllSelected = getIsAllSelected(state.chats, state.selectedIds);
      state.isSomeSelected = getIsSomeSelected(state.chats, state.selectedIds);
    },
    clearSelection(state): void {
      state.selectedIds = [];
      state.isAllSelected = getIsAllSelected(state.chats, state.selectedIds);
      state.isSomeSelected = getIsSomeSelected(state.chats, state.selectedIds);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChats.pending, (state) => {
      state.status = Status.LOADING;
      state.chats = [];
    });
    builder.addCase(fetchChats.fulfilled, (state, action) => {
      state.status = Status.SUCCESS;
      state.chats = action.payload;
    });
    builder.addCase(fetchChats.rejected, (state) => {
      state.status = Status.ERROR;
      state.chats = [];
    });
  },
});

export const { toggleSelectItem, toggleSelectAll, clearSelection } = chatsTableSlice.actions;

export default chatsTableSlice.reducer;
