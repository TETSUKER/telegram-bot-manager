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
  DayOfWeek,
  updateRule,
  MessageLengthOperator,
  Month,
  RuleCondition,
  RuleConditionType,
  RuleResponse,
  RuleResponseType,
  ScheduleType,
  ServerRule,
} from "api/rules";
import { getChats, ServerChat } from "api/chat";
import { isServerError } from 'api/serverError';

interface UpdateRuleModalSliceState {
  isOpened: boolean;
  isLoading: boolean;
  id: number;
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

function getServerRuleFromState(state: UpdateRuleModalSliceState): ServerRule {
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
        reply: state.reply.value,
      };
    }

    if (state.responseType.value === RuleResponseType.sticker) {
      return {
        type: RuleResponseType.sticker,
        stickerId: state.stickerId.value,
        reply: state.reply.value,
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

    return {
      type: RuleResponseType.random_joke,
    };
  };

  return {
    id: state.id,
    name: state.name.value,
    condition: getCondition(),
    response: getResponse(),
    probability: state.probability.value,
  };
}

export const updateRuleRequest = createAsyncThunk<
  Promise<void>,
  void,
  ThunkApiConfig
>("updateRuleModal/update", async (_, { dispatch, getState }) => {
  try {
    const state = getState();
    const rule = getServerRuleFromState(state.rule.updateRuleModal);
    await updateRule(rule);
    dispatch(closeUpdateRuleModal());
    dispatch(updateRules());
  } catch (err) {
    if (isServerError(err)) {
      const errMessage = err.error.message;
      alert(errMessage);
    } else {
      alert("Unknown error while update rule :(");
    }
  }
});

export const openUpdateRuleModal = createAsyncThunk<
  {
    serverRule: ServerRule;
    serverChats: ServerChat[];
  } | void,
  ServerRule,
  ThunkApiConfig
>("openUpdateRuleModel/open", async (rule, { rejectWithValue }) => {
  try {
    const chats = await getChats();
    return {
      serverRule: rule,
      serverChats: chats,
    };
  } catch (err) {
    const errMessage = (err as Error).message ?? "Unknown error";
    rejectWithValue(errMessage);
  }
});

const initialState: UpdateRuleModalSliceState = {
  isOpened: false,
  isLoading: false,
  id: 0,
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

function updateVisibleState(state: UpdateRuleModalSliceState): void {
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
  }

  if (state.responseType.value === RuleResponseType.message) {
    state.text.visible = true;
    state.stickerId.visible = false;
    state.reply.visible = true;
    state.emoji.visible = false;
  }

  if (state.responseType.value === RuleResponseType.sticker) {
    state.text.visible = false;
    state.stickerId.visible = true;
    state.reply.visible = true;
    state.emoji.visible = false;
  }

  if (state.responseType.value === RuleResponseType.emoji) {
    state.text.visible = false;
    state.stickerId.visible = false;
    state.reply.visible = false;
    state.emoji.visible = true;
  }

  if (
    state.responseType.value === RuleResponseType.random_joke ||
    state.responseType.value === RuleResponseType.find_joke ||
    state.responseType.value === RuleResponseType.joke_rating
  ) {
    state.text.visible = false;
    state.stickerId.visible = false;
    state.reply.visible = false;
    state.emoji.visible = false;
  }
}

function setServerRuleToState(
  serverRule: ServerRule,
  state: UpdateRuleModalSliceState
): void {
  state.name.value = serverRule.name;
  state.probability.value = serverRule.probability ?? 100;

  if (serverRule.condition.type === RuleConditionType.schedule) {
    state.conditionType.value = RuleConditionType.schedule;
    const hours = serverRule.condition.schedule.hour
      .toString()
      .padStart(2, "0");
    const minutes = serverRule.condition.schedule.minute
      .toString()
      .padStart(2, "0");
    const scheduleTime = `${hours}:${minutes}`;
    state.scheduleTime.value = scheduleTime;
    state.scheduleChats.value = serverRule.condition.scheduleChatIds;

    if (serverRule.condition.schedule.type === ScheduleType.weekly) {
      state.scheduleType.value = ScheduleType.weekly;
      state.scheduleDayOfWeek.value = serverRule.condition.schedule.dayOfWeek;
    }

    if (serverRule.condition.schedule.type === ScheduleType.annually) {
      state.scheduleType.value = ScheduleType.annually;
      state.scheduleDay.value = serverRule.condition.schedule.day;
      state.scheduleMonth.value = serverRule.condition.schedule.month;
    }
  }

  if (serverRule.condition.type === RuleConditionType.regex) {
    state.conditionType.value = RuleConditionType.regex;
    state.pattern.value = serverRule.condition.pattern;
  }

  if (serverRule.condition.type === RuleConditionType.command) {
    state.conditionType.value = RuleConditionType.command;
    state.commandName.value = serverRule.condition.name;
  }

  if (serverRule.condition.type === RuleConditionType.length) {
    state.conditionType.value = RuleConditionType.length;
    state.lengthValue.value = serverRule.condition.value;
    state.lengthOperator.value = serverRule.condition.operator;
  }

  if (serverRule.response.type === RuleResponseType.message) {
    state.responseType.value = RuleResponseType.message;
    state.text.value = serverRule.response.text;
  }

  if (serverRule.response.type === RuleResponseType.emoji) {
    state.responseType.value = RuleResponseType.emoji;
    state.emoji.value = serverRule.response.emoji;
  }

  if (serverRule.response.type === RuleResponseType.sticker) {
    state.responseType.value = RuleResponseType.sticker;
    state.stickerId.value = serverRule.response.stickerId;
  }

  if (serverRule.response.type === RuleResponseType.find_joke) {
    state.responseType.value = RuleResponseType.find_joke;
  }

  if (serverRule.response.type === RuleResponseType.joke_rating) {
    state.responseType.value = RuleResponseType.joke_rating;
  }

  if (serverRule.response.type === RuleResponseType.random_joke) {
    state.responseType.value = RuleResponseType.random_joke;
  }
}

export const updateRuleModalSlice = createSlice({
  name: "updateRuleModal",
  initialState,
  reducers: {
    closeUpdateRuleModal(): UpdateRuleModalSliceState {
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
    builder.addCase(updateRuleRequest.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateRuleRequest.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(updateRuleRequest.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(openUpdateRuleModal.pending, (state) => {
      state.isLoading = true;
      state.isOpened = true;
    });
    builder.addCase(openUpdateRuleModal.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload) {
        state.id = action.payload.serverRule.id;
        state.scheduleChats.options = action.payload.serverChats.map((chat) => ({
          text: chat.name,
          value: chat.id,
        }));
        setServerRuleToState(action.payload.serverRule, state);
      }
      updateVisibleState(state);
    });
    builder.addCase(openUpdateRuleModal.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const {
  closeUpdateRuleModal,
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
} = updateRuleModalSlice.actions;

export default updateRuleModalSlice.reducer;
