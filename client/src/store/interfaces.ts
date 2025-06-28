import { store } from "./store";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type ThunkApiConfig = {
  state: RootState;
  dispatch: AppDispatch;
  rejectValue?: string; // Example: type for the value returned by rejectWithValue
  extra?: unknown; // Example: type for any extra argument passed to the thunk middleware
};

export interface InputState {
  value: string;
  label: string;
  placeholder: string;
  disabled: boolean;
}

export interface ButtonState {
  text: string;
  disabled: boolean;
  loading: boolean;
}

export enum Status {
  IDLE = "IDLE",
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}
