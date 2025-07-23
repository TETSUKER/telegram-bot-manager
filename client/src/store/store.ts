import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./chat";
import rulesReducer from "./rules";
import jokesReducer from "./jokes";
import botReducer from './bots';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    rule: rulesReducer,
    joke: jokesReducer,
    bot: botReducer,
  },
});
