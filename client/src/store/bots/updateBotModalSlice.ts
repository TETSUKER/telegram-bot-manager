import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UpdateBot, updateBot } from "api/bots";
import {
  ButtonState,
  ChipSelectorInputState,
  ThunkApiConfig,
} from "store/interfaces";
import { updateBotsTable } from "./botsTableSlice";
import { getRules, ServerRule } from "api/rules";
import { isServerError } from 'api/serverError';

interface UpdateBotModalSliceState {
  isOpened: boolean;
  isLoading: boolean;
  id: number;
  ruleIds: ChipSelectorInputState<number>;
  apply: ButtonState;
  cancel: ButtonState;
}

const initialState: UpdateBotModalSliceState = {
  isOpened: false,
  isLoading: false,
  id: 0,
  ruleIds: {
    options: [],
    value: [],
    label: "Rules",
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

export const updateBotRequest = createAsyncThunk<
  Promise<void>,
  void,
  ThunkApiConfig
>("updateBotModel/update", async (_, { dispatch, getState }) => {
  try {
    const state = getState();
    await updateBot({
      id: state.bot.updateBotModal.id,
      ruleIds: state.bot.updateBotModal.ruleIds.value,
    });
    dispatch(closeUpdateBotModal());
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

export const openUpdateBotModal = createAsyncThunk<
  {
    updateBot: UpdateBot;
    serverRules: ServerRule[];
  } | void,
  UpdateBot,
  ThunkApiConfig
>("openUpdateBotModal/open", async (bot) => {
  try {
    const rules = await getRules();
    return {
      updateBot: bot,
      serverRules: rules,
    };
  } catch (err) {
    if (isServerError(err)) {
      const errMessage = err.error.message;
      alert(errMessage);
    } else {
      alert('Unknown error while update bot :(');
    }
  }
});

export const updateBotModalSlice = createSlice({
  name: "updateBotModel",
  initialState,
  reducers: {
    closeUpdateBotModal(): UpdateBotModalSliceState {
      return {
        ...initialState,
        isOpened: false,
      };
    },
    setRuleIds(state, action: PayloadAction<number[]>): void {
      state.ruleIds.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateBotRequest.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateBotRequest.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(updateBotRequest.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(openUpdateBotModal.pending, (state) => {
      state.isLoading = true;
      state.isOpened = true;
    });
    builder.addCase(openUpdateBotModal.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        state.id = action.payload.updateBot.id;
        state.ruleIds.value = action.payload.updateBot.ruleIds || [];
        state.ruleIds.options = action.payload.serverRules.map((rule) => ({
          text: rule.name,
          value: rule.id,
        }));
      }
    });
    builder.addCase(openUpdateBotModal.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const { closeUpdateBotModal, setRuleIds } = updateBotModalSlice.actions;

export default updateBotModalSlice.reducer;
