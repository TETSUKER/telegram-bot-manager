import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chat";
import rulesReducer from './rules';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    rule: rulesReducer,
  },
});
