import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ButtonState, TextInputState, ThunkApiConfig } from "store/interfaces";
import { createJoke } from "api/jokes";
import { updateJokes } from "./jokesTableSlice";
import { isServerError } from "api/serverError";

interface CreateJokeModalSliceState {
  isOpened: boolean;
  text: TextInputState;
  apply: ButtonState;
  cancel: ButtonState;
}

const initialState: CreateJokeModalSliceState = {
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

export const createJokeRequest = createAsyncThunk<
  Promise<void>,
  void,
  ThunkApiConfig
>("createJokeModel/create", async (_, { dispatch, getState }) => {
  try {
    const state = getState();
    await createJoke({
      text: state.joke.createJokeModal.text.value,
    });
    dispatch(closeCreateJokeModal());
    dispatch(updateJokes());
  } catch (err) {
    if (isServerError(err)) {
      const errMessage = err.error.message;
      alert(errMessage);
    } else {
      alert("Unknown error while create joke :(");
    }
  }
});

export const createJokeModalSlice = createSlice({
  name: "createJokeModel",
  initialState,
  reducers: {
    openCreateJokeModal(state): void {
      state.isOpened = true;
    },
    closeCreateJokeModal(state): void {
      state.isOpened = false;
    },
    setJokeText(state, action: PayloadAction<string>): void {
      state.text.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createJokeRequest.pending, (state) => {
      state.text.disabled = true;
      state.apply.loading = true;
    });
    builder.addCase(createJokeRequest.fulfilled, (state) => {
      state.text.disabled = false;
      state.apply.loading = false;
    });
    builder.addCase(createJokeRequest.rejected, (state) => {
      state.text.disabled = false;
      state.apply.loading = false;
    });
  },
});

export const { openCreateJokeModal, closeCreateJokeModal, setJokeText } =
  createJokeModalSlice.actions;

export default createJokeModalSlice.reducer;
