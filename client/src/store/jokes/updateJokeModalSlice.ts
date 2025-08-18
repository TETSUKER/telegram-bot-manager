import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ButtonState, TextInputState, ThunkApiConfig } from "store/interfaces";
import { updateJoke, UpdateJoke } from "api/jokes";
import { updateJokes } from "./jokesTableSlice";

interface UpdateJokeModalSliceState {
  isOpened: boolean;
  id: number;
  text: TextInputState;
  apply: ButtonState;
  cancel: ButtonState;
}

const initialState: UpdateJokeModalSliceState = {
  isOpened: false,
  id: 0,
  text: {
    value: "",
    label: "Joke text",
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

export const updateJokeRequest = createAsyncThunk<
  Promise<void>,
  void,
  ThunkApiConfig
>("updateJokeModel/update", async (_, { dispatch, getState }) => {
  const state = getState();
  await updateJoke({
    id: state.joke.updateJokeModal.id,
    text: state.joke.updateJokeModal.text.value,
  });
  dispatch(updateJokes());
});

export const updateJokeModalSlice = createSlice({
  name: "updateJokeModel",
  initialState,
  reducers: {
    openUpdateJokeModal(state, action: PayloadAction<UpdateJoke>): void {
      state.id = action.payload.id;
      state.text.value = action.payload.text;
      state.isOpened = true;
    },
    closeUpdateJokeModal(state): void {
      state.isOpened = false;
    },
    setJokeText(state, action: PayloadAction<string>): void {
      state.text.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateJokeRequest.pending, (state) => {
      state.text.disabled = true;
      state.apply.loading = true;
    });
    builder.addCase(updateJokeRequest.fulfilled, (state) => {
      state.isOpened = false;
      state.text.disabled = false;
      state.apply.loading = false;
    });
    builder.addCase(updateJokeRequest.rejected, (state) => {
      state.text.disabled = false;
      state.apply.loading = false;
    });
  },
});

export const { openUpdateJokeModal, closeUpdateJokeModal, setJokeText } =
  updateJokeModalSlice.actions;

export default updateJokeModalSlice.reducer;
