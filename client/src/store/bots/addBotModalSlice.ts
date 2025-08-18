import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addBot } from "api/bots";
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
    text: "Add",
    loading: false,
    disabled: false,
  },
  cancel: {
    text: "Cancel",
    loading: false,
    disabled: false,
  },
};

export const addBotRequest = createAsyncThunk<
  Promise<void>,
  void,
  ThunkApiConfig
>("addBotModel/add", async (_, { dispatch, getState }) => {
  try {
    const state = getState();
    const token = state.bot.addBotModal.token.value;
    await addBot(token);
    dispatch(closeAddBotModal());
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

export const addBotModalSlice = createSlice({
  name: "addBotModel",
  initialState,
  reducers: {
    openAddBotModal(state): void {
      state.isOpened = true;
    },
    closeAddBotModal(state): void {
      state.isOpened = false;
    },
    setToken(state, action: PayloadAction<string>): void {
      state.token.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addBotRequest.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addBotRequest.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(addBotRequest.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const { openAddBotModal, closeAddBotModal, setToken } =
  addBotModalSlice.actions;

export default addBotModalSlice.reducer;
