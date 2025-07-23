import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createBot } from "api/bots";
import { ButtonState, TextInputState, ThunkApiConfig } from "store/interfaces";
import { updateBotsTable } from "./botsTableSlice";

interface CreateBotModalSliceState {
  isOpened: boolean;
  isLoading: boolean;
  token: TextInputState;
  apply: ButtonState;
  cancel: ButtonState;
}

const initialState: CreateBotModalSliceState = {
  isOpened: false,
  isLoading: false,
  token: {
    value: "",
    label: "Token",
    placeholder: "",
    disabled: false,
    visible: true,
  },
  apply: {
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

export const createBotRequest = createAsyncThunk<
  Promise<void>,
  void,
  ThunkApiConfig
>("createBotModel/create", async (_, { dispatch, getState, rejectWithValue }) => {
  try {
    const state = getState();
    const token = state.bot.createBotModal.token.value;
    await createBot(token);
    dispatch(closeCreateBotModal());
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

export const createBotModalSlice = createSlice({
  name: "createBotModel",
  initialState,
  reducers: {
    openCreateBotModal(state): void {
      state.isOpened = true;
    },
    closeCreateBotModal(state): void {
      state.isOpened = false;
    },
    setToken(state, action: PayloadAction<string>): void {
      state.token.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createBotRequest.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createBotRequest.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(createBotRequest.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const { openCreateBotModal, closeCreateBotModal, setToken } =
  createBotModalSlice.actions;

export default createBotModalSlice.reducer;
