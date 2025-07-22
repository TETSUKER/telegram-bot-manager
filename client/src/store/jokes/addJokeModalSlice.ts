import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ButtonState, TextInputState, ThunkApiConfig } from "store/interfaces";
import { addJoke } from "api/jokes";
import { updateJokes } from "./jokesTableSlice";

interface AddJokeModalSliceState {
  isOpened: boolean;
  text: TextInputState;
  apply: ButtonState;
  cancel: ButtonState;
}

const initialState: AddJokeModalSliceState = {
  isOpened: false,
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

export const addJokeRequest = createAsyncThunk<
  Promise<void>,
  void,
  ThunkApiConfig
>("addJokeModel/update", async (_, { dispatch, getState }) => {
  const state = getState();
  await addJoke({
    text: state.joke.addJokeModal.text.value,
  });
  dispatch(updateJokes());
});

export const addJokeModalSlice = createSlice({
  name: "addJokeModel",
  initialState,
  reducers: {
    openAddJokeModal(state): void {
      state.isOpened = true;
    },
    closeAddJokeModal(state): void {
      state.isOpened = false;
    },
    setJokeText(state, action: PayloadAction<string>): void {
      state.text.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addJokeRequest.pending, (state) => {
      state.text.disabled = true;
      state.apply.loading = true;
    });
    builder.addCase(addJokeRequest.fulfilled, (state) => {
      state.isOpened = false;
      state.text.disabled = false;
      state.apply.loading = false;
    });
    builder.addCase(addJokeRequest.rejected, (state) => {
      state.text.disabled = false;
      state.apply.loading = false;
    });
  },
});

export const { openAddJokeModal, closeAddJokeModal, setJokeText } =
  addJokeModalSlice.actions;

export default addJokeModalSlice.reducer;
