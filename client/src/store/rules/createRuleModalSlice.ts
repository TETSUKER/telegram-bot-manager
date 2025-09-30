import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ButtonState,
  TextInputState,
  SelectorInputState,
  ThunkApiConfig,
  NumberInputState,
  ToggleInputState,
  TimeInputState,
  ChipSelectorInputState,
} from "store/interfaces";
import { updateRules } from "./rulesTableSlice";
import {
  createRule,
  DayOfWeek,
  MessageLengthOperator,
  Month,
  NewRule,
  RuleCondition,
  RuleConditionType,
  RuleResponse,
  RuleResponseType,
  ScheduleType,
} from "api/rules";
import { getChats, ServerChat } from "api/chat";
import { isServerError } from 'api/serverError';

interface CreateRuleModalSliceState {
  isOpened: boolean;
  isLoading: boolean;
  name: TextInputState;
  conditionType: SelectorInputState<RuleConditionType>;
  pattern: TextInputState;
  lengthOperator: SelectorInputState<MessageLengthOperator>;
  lengthValue: NumberInputState;
  commandName: TextInputState;
  scheduleType: SelectorInputState<ScheduleType>;
  scheduleDayOfWeek: SelectorInputState<DayOfWeek>;
  scheduleTime: TimeInputState;
  scheduleDay: NumberInputState;
  scheduleMonth: SelectorInputState<number>;
  scheduleChats: ChipSelectorInputState<number>;
  responseType: SelectorInputState<RuleResponseType>;
  text: TextInputState;
  stickerId: TextInputState;
  reply: ToggleInputState;
  emoji: SelectorInputState<string>;
  probability: NumberInputState;
  apply: ButtonState;
  cancel: ButtonState;
}

function getServerRuleFromState(state: CreateRuleModalSliceState): NewRule {
  const getCondition = (): RuleCondition => {
    if (state.conditionType.value === RuleConditionType.schedule) {
      if (state.scheduleType.value === ScheduleType.weekly) {
        return {
          type: RuleConditionType.schedule,
          scheduleChatIds: state.scheduleChats.value,
          schedule: {
            type: ScheduleType.weekly,
            dayOfWeek: state.scheduleDayOfWeek.value,
            hour: Number(state.scheduleTime.value.split(":")[0]),
            minute: Number(state.scheduleTime.value.split(":")[1]),
          },
        };
      }

      if (state.scheduleType.value === ScheduleType.annually) {
        return {
          type: RuleConditionType.schedule,
          scheduleChatIds: state.scheduleChats.value,
          schedule: {
            type: ScheduleType.annually,
            day: state.scheduleDay.value,
            month: state.scheduleMonth.value,
            hour: Number(state.scheduleTime.value.split(":")[0]),
            minute: Number(state.scheduleTime.value.split(":")[1]),
          },
        };
      }

      if (state.scheduleType.value === ScheduleType.daily) {
        return {
          type: RuleConditionType.schedule,
          scheduleChatIds: state.scheduleChats.value,
          schedule: {
            type: ScheduleType.daily,
            hour: Number(state.scheduleTime.value.split(":")[0]),
            minute: Number(state.scheduleTime.value.split(":")[1]),
          },
        };
      }
    }

    if (state.conditionType.value === RuleConditionType.regex) {
      return {
        type: RuleConditionType.regex,
        pattern: state.pattern.value,
      };
    }

    if (state.conditionType.value === RuleConditionType.length) {
      return {
        type: RuleConditionType.length,
        operator: state.lengthOperator.value,
        value: state.lengthValue.value,
      };
    }

    return {
      type: RuleConditionType.command,
      name: state.commandName.value,
    };
  };

  const getResponse = (): RuleResponse => {
    if (state.responseType.value === RuleResponseType.message) {
      return {
        type: RuleResponseType.message,
        text: state.text.value,
        reply:
          state.conditionType.value === RuleConditionType.schedule
            ? false
            : state.reply.value,
      };
    }

    if (state.responseType.value === RuleResponseType.sticker) {
      return {
        type: RuleResponseType.sticker,
        stickerId: state.stickerId.value,
        reply:
          state.conditionType.value === RuleConditionType.schedule
            ? false
            : state.reply.value,
      };
    }

    if (state.responseType.value === RuleResponseType.emoji) {
      return {
        type: RuleResponseType.emoji,
        emoji: state.emoji.value,
      };
    }

    if (state.responseType.value === RuleResponseType.find_joke) {
      return {
        type: RuleResponseType.find_joke,
      };
    }

    if (state.responseType.value === RuleResponseType.joke_rating) {
      return {
        type: RuleResponseType.joke_rating,
      };
    }

    if (state.responseType.value === RuleResponseType.get_joke_by_id) {
      return {
        type: RuleResponseType.get_joke_by_id,
      };
    }

    return {
      type: RuleResponseType.random_joke,
    };
  };

  return {
    name: state.name.value,
    condition: getCondition(),
    response: getResponse(),
    probability: state.probability.value,
  };
}

export const createRuleRequest = createAsyncThunk<
  Promise<void>,
  void,
  ThunkApiConfig
>("createRuleModel/create", async (_, { dispatch, getState }) => {
  try {
    const state = getState();
    const rule = getServerRuleFromState(state.rule.createRuleModal);
    await createRule(rule);
    dispatch(closeCreateRuleModal());
    dispatch(updateRules());
  } catch (err) {
    if (isServerError(err)) {
      const errMessage = err.error.message;
      alert(errMessage);
    } else {
      alert("Unknown error while create rule :(");
    }
  }
});

export const openCreateRuleModal = createAsyncThunk<
  ServerChat[] | void,
  void,
  ThunkApiConfig
>("createRuleModal/open", async (_, { rejectWithValue }) => {
  try {
    return await getChats();
  } catch (err) {
    const errMessage = (err as Error).message ?? "Unknown error";
    rejectWithValue(errMessage);
  }
});

const initialState: CreateRuleModalSliceState = {
  isOpened: false,
  isLoading: false,
  name: {
    value: "",
    label: "Rule name",
    placeholder: "",
    disabled: false,
    visible: true,
  },
  conditionType: {
    value: RuleConditionType.regex,
    options: Object.keys(RuleConditionType).map((type) => ({
      value: type as RuleConditionType,
      text: type,
    })),
    label: "Condition type",
    placeholder: "",
    disabled: false,
    visible: true,
  },
  pattern: {
    value: "",
    label: "Pattern",
    placeholder: "",
    disabled: false,
    visible: false,
  },
  lengthOperator: {
    value: MessageLengthOperator.equal,
    options: Object.keys(MessageLengthOperator).map((operator) => ({
      value:
        MessageLengthOperator[operator as keyof typeof MessageLengthOperator],
      text: MessageLengthOperator[
        operator as keyof typeof MessageLengthOperator
      ],
    })),
    label: "Length operator",
    placeholder: "",
    disabled: false,
    visible: false,
  },
  lengthValue: {
    value: 0,
    label: "Length value",
    placeholder: "",
    disabled: false,
    visible: false,
    min: 0,
    max: 100,
  },
  commandName: {
    value: "",
    label: "Command",
    placeholder: "",
    disabled: false,
    visible: false,
  },
  scheduleType: {
    value: ScheduleType.weekly,
    options: Object.keys(ScheduleType).map((type) => ({
      value: type as ScheduleType,
      text: type,
    })),
    label: "Schedule type",
    placeholder: "",
    disabled: false,
    visible: false,
  },
  scheduleDayOfWeek: {
    value: DayOfWeek.monday,
    options: Object.keys(DayOfWeek).map((day) => ({
      value: day as DayOfWeek,
      text: day,
    })),
    label: "Day of week",
    placeholder: "",
    disabled: false,
    visible: false,
  },
  scheduleTime: {
    value: "00:00",
    label: "Time",
    placeholder: "",
    disabled: false,
    visible: false,
  },
  scheduleDay: {
    value: 0,
    label: "Day",
    placeholder: "",
    disabled: false,
    visible: false,
    min: 0,
    max: 31,
  },
  scheduleMonth: {
    value: 0,
    options: Object.keys(Month).map((month, index) => ({
      value: index,
      text: month,
    })),
    label: "Month",
    placeholder: "",
    disabled: false,
    visible: false,
  },
  scheduleChats: {
    value: [],
    options: [],
    label: "Schedule chats",
    placeholder: "",
    disabled: false,
    visible: false,
  },
  responseType: {
    value: RuleResponseType.message,
    options: Object.keys(RuleResponseType).map((type) => ({
      value: type as RuleResponseType,
      text: type,
    })),
    label: "Response type",
    placeholder: "",
    disabled: false,
    visible: true,
  },
  text: {
    value: "",
    label: "Text",
    placeholder: "",
    disabled: false,
    visible: false,
  },
  stickerId: {
    value: "",
    label: "Sticker ID",
    placeholder: "",
    disabled: false,
    visible: false,
  },
  reply: {
    value: true,
    label: "Reply",
    placeholder: "",
    disabled: false,
    visible: false,
  },
  emoji: {
    value: "👍",
    options: [
      {
        text: "👍",
        value: "👍",
      },
      {
        text: "🤣",
        value: "🤣",
      },
      {
        text: "😭",
        value: "😭",
      },
    ],
    label: "Emoji",
    placeholder: "",
    disabled: false,
    visible: false,
  },
  probability: {
    value: 100,
    label: "Probability",
    placeholder: "",
    disabled: false,
    visible: true,
    min: 0,
    max: 100,
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

function updateVisibleState(state: CreateRuleModalSliceState): void {
  if (state.conditionType.value === RuleConditionType.regex) {
    state.pattern.visible = true;
    state.lengthValue.visible = false;
    state.lengthOperator.visible = false;
    state.commandName.visible = false;
    state.scheduleType.visible = false;
    state.scheduleDay.visible = false;
    state.scheduleDayOfWeek.visible = false;
    state.scheduleTime.visible = false;
    state.scheduleMonth.visible = false;
    state.scheduleChats.visible = false;
  }

  if (state.conditionType.value === RuleConditionType.command) {
    state.pattern.visible = false;
    state.lengthValue.visible = false;
    state.lengthOperator.visible = false;
    state.commandName.visible = true;
    state.scheduleType.visible = false;
    state.scheduleDay.visible = false;
    state.scheduleDayOfWeek.visible = false;
    state.scheduleTime.visible = false;
    state.scheduleMonth.visible = false;
    state.scheduleChats.visible = false;
  }

  if (state.conditionType.value === RuleConditionType.length) {
    state.pattern.visible = false;
    state.lengthValue.visible = true;
    state.lengthOperator.visible = true;
    state.commandName.visible = false;
    state.scheduleType.visible = false;
    state.scheduleDay.visible = false;
    state.scheduleDayOfWeek.visible = false;
    state.scheduleTime.visible = false;
    state.scheduleMonth.visible = false;
    state.scheduleChats.visible = false;
  }

  if (state.conditionType.value === RuleConditionType.schedule) {
    state.pattern.visible = false;
    state.lengthValue.visible = false;
    state.lengthOperator.visible = false;
    state.commandName.visible = false;
    state.scheduleType.visible = true;
    state.scheduleChats.visible = true;

    if (state.scheduleType.value === ScheduleType.weekly) {
      state.scheduleMonth.visible = false;
      state.scheduleDay.visible = false;
      state.scheduleDayOfWeek.visible = true;
      state.scheduleTime.visible = true;
    }

    if (state.scheduleType.value === ScheduleType.annually) {
      state.scheduleMonth.visible = true;
      state.scheduleDay.visible = true;
      state.scheduleDayOfWeek.visible = false;
      state.scheduleTime.visible = true;
    }

    if (state.scheduleType.value === ScheduleType.daily) {
      state.scheduleMonth.visible = false;
      state.scheduleDay.visible = false;
      state.scheduleDayOfWeek.visible = false;
      state.scheduleTime.visible = true;
    }
  }

  if (state.responseType.value === RuleResponseType.message) {
    state.text.visible = true;
    state.stickerId.visible = false;
    state.emoji.visible = false;
  }

  if (state.responseType.value === RuleResponseType.sticker) {
    state.text.visible = false;
    state.stickerId.visible = true;
    state.emoji.visible = false;
  }

  if (state.responseType.value === RuleResponseType.emoji) {
    state.text.visible = false;
    state.stickerId.visible = false;
    state.emoji.visible = true;
  }

  if (
    state.responseType.value === RuleResponseType.random_joke ||
    state.responseType.value === RuleResponseType.find_joke ||
    state.responseType.value === RuleResponseType.joke_rating ||
    state.responseType.value === RuleResponseType.get_joke_by_id
  ) {
    state.text.visible = false;
    state.stickerId.visible = false;
    state.emoji.visible = false;
  }

  if (state.conditionType.value === RuleConditionType.schedule ||
    state.responseType.value === RuleResponseType.random_joke ||
    state.responseType.value === RuleResponseType.find_joke ||
    state.responseType.value === RuleResponseType.joke_rating ||
    state.responseType.value === RuleResponseType.get_joke_by_id ||
    state.responseType.value === RuleResponseType.emoji
  ) {
    state.reply.visible = false;
  } else {
    state.reply.visible = true;
  }
}

export const createRuleModalSlice = createSlice({
  name: "createRuleModel",
  initialState,
  reducers: {
    closeCreateRuleModal(): CreateRuleModalSliceState {
      return {
        ...initialState,
        isOpened: false,
      }
    },
    setRuleName(state, action: PayloadAction<string>): void {
      state.name.value = action.payload;
    },
    setConditionType(state, action: PayloadAction<RuleConditionType>): void {
      state.conditionType.value = action.payload;
      updateVisibleState(state);
    },
    setPattern(state, action: PayloadAction<string>): void {
      state.pattern.value = action.payload;
    },
    setLengthOperator(
      state,
      action: PayloadAction<MessageLengthOperator>
    ): void {
      state.lengthOperator.value = action.payload;
    },
    setLengthValue(state, action: PayloadAction<number>): void {
      state.lengthValue.value = action.payload;
    },
    setCommandName(state, action: PayloadAction<string>): void {
      state.commandName.value = action.payload;
    },
    setScheduleType(state, action: PayloadAction<ScheduleType>): void {
      state.scheduleType.value = action.payload;
      updateVisibleState(state);
    },
    setScheduleDayOfWeek(state, action: PayloadAction<DayOfWeek>): void {
      state.scheduleDayOfWeek.value = action.payload;
    },
    setScheduleTime(state, action: PayloadAction<string>): void {
      state.scheduleTime.value = action.payload;
    },
    setScheduleDay(state, action: PayloadAction<number>): void {
      state.scheduleDay.value = action.payload;
    },
    setScheduleMonth(state, action: PayloadAction<number>): void {
      state.scheduleMonth.value = action.payload;
    },
    setScheduleChatIds(state, action: PayloadAction<number[]>): void {
      state.scheduleChats.value = action.payload;
    },
    setResponseType(state, action: PayloadAction<RuleResponseType>): void {
      state.responseType.value = action.payload;
      updateVisibleState(state);
    },
    setText(state, action: PayloadAction<string>): void {
      state.text.value = action.payload;
    },
    setStickerId(state, action: PayloadAction<string>): void {
      state.stickerId.value = action.payload;
    },
    setReply(state, action: PayloadAction<boolean>): void {
      state.reply.value = action.payload;
    },
    setEmoji(state, action: PayloadAction<string>): void {
      state.emoji.value = action.payload;
    },
    setProbability(state, action: PayloadAction<number>): void {
      state.probability.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createRuleRequest.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createRuleRequest.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(createRuleRequest.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(openCreateRuleModal.pending, (state) => {
      state.isLoading = true;
      state.isOpened = true;
    });
    builder.addCase(openCreateRuleModal.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        state.scheduleChats.options = action.payload.map(
          (chat) => ({
            text: chat.name,
            value: chat.id,
          })
        );
      }
      updateVisibleState(state);
    });
    builder.addCase(openCreateRuleModal.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const {
  closeCreateRuleModal,
  setRuleName,
  setConditionType,
  setPattern,
  setLengthOperator,
  setLengthValue,
  setCommandName,
  setScheduleType,
  setScheduleDayOfWeek,
  setScheduleTime,
  setScheduleDay,
  setScheduleMonth,
  setScheduleChatIds,
  setResponseType,
  setText,
  setStickerId,
  setReply,
  setEmoji,
  setProbability,
} = createRuleModalSlice.actions;

export default createRuleModalSlice.reducer;
