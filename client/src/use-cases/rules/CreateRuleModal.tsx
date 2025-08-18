import React from "react";
import {
  Button,
  ChipSelector,
  Modal,
  NumberInput,
  SelectorInput,
  TextInput,
  TimeInput,
  ToggleInput,
} from "components";
import { XIcon } from "@heroicons/react/outline";
import { useAppSelector } from "hooks/useSelector";
import { useAppDispatch } from "hooks/useDispatch";
import {
  createRuleRequest,
  closeCreateRuleModal,
  setCommandName,
  setConditionType,
  setEmoji,
  setLengthOperator,
  setLengthValue,
  setPattern,
  setProbability,
  setReply,
  setResponseType,
  setRuleName,
  setScheduleChatIds,
  setScheduleDay,
  setScheduleDayOfWeek,
  setScheduleMonth,
  setScheduleTime,
  setScheduleType,
  setStickerId,
  setText,
} from "store/rules/createRuleModalSlice";
import {
  DayOfWeek,
  MessageLengthOperator,
  RuleConditionType,
  RuleResponseType,
  ScheduleType,
} from "api/rules";

export const CreateRuleModal: React.FC = () => {
  const createRuleModalState = useAppSelector((state) => state.rule.createRuleModal);
  const dispatch = useAppDispatch();

  return (
    <Modal
      isOpen={createRuleModalState.isOpened}
      isLoading={createRuleModalState.isLoading}
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-medium text-white">Create rule</h2>
          <XIcon
            className="size-6 text-slate-400 cursor-pointer"
            onClick={() => dispatch(closeCreateRuleModal())}
          />
        </div>
      }
      content={
        <div className="flex flex-col gap-y-2">
          <TextInput
            label={createRuleModalState.name.label}
            disabled={createRuleModalState.name.disabled}
            onChange={(value) => dispatch(setRuleName(value))}
            initialValue={createRuleModalState.name.value}
          />
          <SelectorInput
            options={createRuleModalState.conditionType.options}
            label={createRuleModalState.conditionType.label}
            onChange={(value) =>
              dispatch(setConditionType(value as RuleConditionType))
            }
            initialValue={createRuleModalState.conditionType.value}
          />
          {createRuleModalState.pattern.visible && (
            <TextInput
              label={createRuleModalState.pattern.label}
              disabled={createRuleModalState.pattern.disabled}
              onChange={(value) => dispatch(setPattern(value))}
              initialValue={createRuleModalState.pattern.value}
            />
          )}
          {createRuleModalState.lengthOperator.visible && (
            <SelectorInput
              options={createRuleModalState.lengthOperator.options}
              label={createRuleModalState.lengthOperator.label}
              onChange={(value) =>
                dispatch(setLengthOperator(value as MessageLengthOperator))
              }
              initialValue={createRuleModalState.lengthOperator.value}
            />
          )}
          {createRuleModalState.lengthValue.visible && (
            <NumberInput
              min={createRuleModalState.lengthValue.min}
              max={createRuleModalState.lengthValue.max}
              label={createRuleModalState.lengthValue.label}
              disabled={createRuleModalState.lengthValue.disabled}
              onChange={(value) => dispatch(setLengthValue(value))}
              initialValue={createRuleModalState.lengthValue.value}
            />
          )}
          {createRuleModalState.commandName.visible && (
            <TextInput
              label={createRuleModalState.commandName.label}
              disabled={createRuleModalState.commandName.disabled}
              onChange={(value) => dispatch(setCommandName(value))}
              initialValue={createRuleModalState.commandName.value}
            />
          )}
          {createRuleModalState.scheduleType.visible && (
            <SelectorInput
              options={createRuleModalState.scheduleType.options}
              label={createRuleModalState.scheduleType.label}
              onChange={(value) =>
                dispatch(setScheduleType(value as ScheduleType))
              }
              initialValue={createRuleModalState.scheduleType.value}
            />
          )}
          {createRuleModalState.scheduleMonth.visible && (
            <SelectorInput<number>
              options={createRuleModalState.scheduleMonth.options}
              label={createRuleModalState.scheduleMonth.label}
              onChange={(value) => dispatch(setScheduleMonth(value))}
              initialValue={createRuleModalState.scheduleMonth.value}
            />
          )}
          {createRuleModalState.scheduleDay.visible && (
            <NumberInput
              label={createRuleModalState.scheduleDay.label}
              disabled={createRuleModalState.scheduleDay.disabled}
              onChange={(value) => dispatch(setScheduleDay(value))}
              initialValue={createRuleModalState.scheduleDay.value}
              min={createRuleModalState.scheduleDay.min}
              max={createRuleModalState.scheduleDay.max}
            />
          )}
          {createRuleModalState.scheduleDayOfWeek.visible && (
            <SelectorInput
              options={createRuleModalState.scheduleDayOfWeek.options}
              label={createRuleModalState.scheduleDayOfWeek.label}
              onChange={(value) =>
                dispatch(setScheduleDayOfWeek(value as DayOfWeek))
              }
              initialValue={createRuleModalState.scheduleDayOfWeek.value}
            />
          )}
          {createRuleModalState.scheduleTime.visible && (
            <TimeInput
              onChange={(value) => dispatch(setScheduleTime(value))}
              label={createRuleModalState.scheduleTime.label}
              disabled={createRuleModalState.scheduleTime.disabled}
              initialValue={createRuleModalState.scheduleTime.value}
              placeholder={createRuleModalState.scheduleTime.placeholder}
            />
          )}
          {createRuleModalState.scheduleChats.visible && (
            <ChipSelector
              options={createRuleModalState.scheduleChats.options}
              onChange={(value) => dispatch(setScheduleChatIds(value))}
              label={createRuleModalState.scheduleChats.label}
              value={createRuleModalState.scheduleChats.value}
            ></ChipSelector>
          )}
          <SelectorInput
            options={createRuleModalState.responseType.options}
            label={createRuleModalState.responseType.label}
            onChange={(value) =>
              dispatch(setResponseType(value as RuleResponseType))
            }
            initialValue={createRuleModalState.responseType.value}
          />
          {createRuleModalState.text.visible && (
            <TextInput
              label={createRuleModalState.text.label}
              disabled={createRuleModalState.text.disabled}
              onChange={(value) => dispatch(setText(value))}
              initialValue={createRuleModalState.text.value}
            />
          )}
          {createRuleModalState.stickerId.visible && (
            <TextInput
              label={createRuleModalState.stickerId.label}
              disabled={createRuleModalState.stickerId.disabled}
              onChange={(value) => dispatch(setStickerId(value))}
              initialValue={createRuleModalState.stickerId.value}
            />
          )}
          {createRuleModalState.reply.visible && (
            <ToggleInput
              label={createRuleModalState.reply.label}
              disabled={createRuleModalState.reply.disabled}
              initialValue={createRuleModalState.reply.value}
              onChange={(value) => dispatch(setReply(value))}
            />
          )}
          {createRuleModalState.emoji.visible && (
            <SelectorInput
              options={createRuleModalState.emoji.options}
              label={createRuleModalState.emoji.label}
              disabled={createRuleModalState.emoji.disabled}
              onChange={(value) => dispatch(setEmoji(value))}
              initialValue={createRuleModalState.emoji.value}
            />
          )}
          <NumberInput
            label={createRuleModalState.probability.label}
            disabled={createRuleModalState.probability.disabled}
            onChange={(value) => dispatch(setProbability(value))}
            initialValue={createRuleModalState.probability.value}
            min={createRuleModalState.probability.min}
            max={createRuleModalState.probability.max}
          />
        </div>
      }
      bottom={
        <div className="flex space-x-3 w-full pl-[50%]">
          <Button
            type="outline"
            color="secondary"
            text={createRuleModalState.cancel.text}
            onClick={() => dispatch(closeCreateRuleModal())}
          />
          <Button
            type="fill"
            color="primary"
            text={createRuleModalState.apply.text}
            loading={createRuleModalState.apply.loading}
            onClick={() => dispatch(createRuleRequest())}
          />
        </div>
      }
    />
  );
};
