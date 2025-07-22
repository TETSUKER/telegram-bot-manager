import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ButtonState, TextInputState, ThunkApiConfig } from "store/interfaces";
import { editJoke, UpdateJoke } from "api/jokes";
import { updateJokes } from "./jokesTableSlice";

interface EditJokeModalSliceState {
  isOpened: boolean;
  id: number;
  text: TextInputState;
  apply: ButtonState;
  cancel: ButtonState;
}

const initialState: EditJokeModalSliceState = {
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

export const editJokeRequest = createAsyncThunk<
  Promise<void>,
  void,
  ThunkApiConfig
>("editJokeModel/edit", async (_, { dispatch, getState }) => {
  const state = getState();
  await editJoke({
    id: state.joke.editJokeModal.id,
    text: state.joke.editJokeModal.text.value,
  });
  dispatch(updateJokes());
});

export const editJokeModalSlice = createSlice({
  name: "editJokeModel",
  initialState,
  reducers: {
    openEditJokeModal(state, action: PayloadAction<UpdateJoke>): void {
      state.id = action.payload.id;
      state.text.value = action.payload.text;
      state.isOpened = true;
    },
    closeEditJokeModal(state): void {
      state.isOpened = false;
    },
    setJokeText(state, action: PayloadAction<string>): void {
      state.text.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(editJokeRequest.pending, (state) => {
      state.text.disabled = true;
      state.apply.loading = true;
    });
    builder.addCase(editJokeRequest.fulfilled, (state) => {
      state.isOpened = false;
      state.text.disabled = false;
      state.apply.loading = false;
    });
    builder.addCase(editJokeRequest.rejected, (state) => {
      state.text.disabled = false;
      state.apply.loading = false;
    });
  },
});

export const { openEditJokeModal, closeEditJokeModal, setJokeText } =
  editJokeModalSlice.actions;

export default editJokeModalSlice.reducer;
