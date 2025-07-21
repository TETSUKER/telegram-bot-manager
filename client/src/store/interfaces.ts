import { store } from "./store";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type ThunkApiConfig = {
  state: RootState;
  dispatch: AppDispatch;
  rejectValue?: string; // Example: type for the value returned by rejectWithValue
  extra?: unknown; // Example: type for any extra argument passed to the thunk middleware
};

export interface TextInputState {
  value: string;
  label: string;
  placeholder: string;
  disabled: boolean;
  visible: boolean;
}

export interface NumberInputState {
  value: number;
  label: string;
  placeholder: string;
  disabled: boolean;
  visible: boolean;
  min: number;
  max: number;
}

export interface SelectorInputState<T = string> {
  value: T;
  options: { value: T; text: string }[];
  label: string;
  placeholder: string;
  disabled: boolean;
  visible: boolean;
}

export interface ChipSelectorInputState<T = string> {
  value: T[];
  options: { value: T; text: string }[];
  label: string;
  placeholder: string;
  disabled: boolean;
  visible: boolean;
}

export interface ToggleInputState {
  value: boolean;
  label: string;
  placeholder: string;
  disabled: boolean;
  visible: boolean;
}

export interface TimeInputState {
  value: string;
  label: string;
  placeholder: string;
  disabled: boolean;
  visible: boolean;
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
