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
  addRuleRequest,
  closeAddRuleModal,
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
} from "store/rules/addRuleModalSlice";
import {
  DayOfWeek,
  MessageLengthOperator,
  RuleConditionType,
  RuleResponseType,
  ScheduleType,
} from "api/rules";

export const AddRuleModal: React.FC = () => {
  const addRuleModalState = useAppSelector((state) => state.rule.addRuleModal);
  const dispatch = useAppDispatch();

  return (
    <Modal
      isOpen={addRuleModalState.isOpened}
      isLoading={addRuleModalState.isLoading}
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-medium text-white">Add rule</h2>
          <XIcon
            className="size-6 text-slate-400 cursor-pointer"
            onClick={() => dispatch(closeAddRuleModal())}
          />
        </div>
      }
      content={
        <div className="flex flex-col gap-y-2">
          <TextInput
            label={addRuleModalState.name.label}
            disabled={addRuleModalState.name.disabled}
            onChange={(value) => dispatch(setRuleName(value))}
            initialValue={addRuleModalState.name.value}
          />
          <SelectorInput
            options={addRuleModalState.conditionType.options}
            label={addRuleModalState.conditionType.label}
            onChange={(value) =>
              dispatch(setConditionType(value as RuleConditionType))
            }
            initialValue={addRuleModalState.conditionType.value}
          />
          {addRuleModalState.pattern.visible && (
            <TextInput
              label={addRuleModalState.pattern.label}
              disabled={addRuleModalState.pattern.disabled}
              onChange={(value) => dispatch(setPattern(value))}
              initialValue={addRuleModalState.pattern.value}
            />
          )}
          {addRuleModalState.lengthOperator.visible && (
            <SelectorInput
              options={addRuleModalState.lengthOperator.options}
              label={addRuleModalState.lengthOperator.label}
              onChange={(value) =>
                dispatch(setLengthOperator(value as MessageLengthOperator))
              }
              initialValue={addRuleModalState.lengthOperator.value}
            />
          )}
          {addRuleModalState.lengthValue.visible && (
            <NumberInput
              min={addRuleModalState.lengthValue.min}
              max={addRuleModalState.lengthValue.max}
              label={addRuleModalState.lengthValue.label}
              disabled={addRuleModalState.lengthValue.disabled}
              onChange={(value) => dispatch(setLengthValue(value))}
              initialValue={addRuleModalState.lengthValue.value}
            />
          )}
          {addRuleModalState.commandName.visible && (
            <TextInput
              label={addRuleModalState.commandName.label}
              disabled={addRuleModalState.commandName.disabled}
              onChange={(value) => dispatch(setCommandName(value))}
              initialValue={addRuleModalState.commandName.value}
            />
          )}
          {addRuleModalState.scheduleType.visible && (
            <SelectorInput
              options={addRuleModalState.scheduleType.options}
              label={addRuleModalState.scheduleType.label}
              onChange={(value) =>
                dispatch(setScheduleType(value as ScheduleType))
              }
              initialValue={addRuleModalState.scheduleType.value}
            />
          )}
          {addRuleModalState.scheduleMonth.visible && (
            <SelectorInput<number>
              options={addRuleModalState.scheduleMonth.options}
              label={addRuleModalState.scheduleMonth.label}
              onChange={(value) => dispatch(setScheduleMonth(value))}
              initialValue={addRuleModalState.scheduleMonth.value}
            />
          )}
          {addRuleModalState.scheduleDay.visible && (
            <NumberInput
              label={addRuleModalState.scheduleDay.label}
              disabled={addRuleModalState.scheduleDay.disabled}
              onChange={(value) => dispatch(setScheduleDay(value))}
              initialValue={addRuleModalState.scheduleDay.value}
              min={addRuleModalState.scheduleDay.min}
              max={addRuleModalState.scheduleDay.max}
            />
          )}
          {addRuleModalState.scheduleDayOfWeek.visible && (
            <SelectorInput
              options={addRuleModalState.scheduleDayOfWeek.options}
              label={addRuleModalState.scheduleDayOfWeek.label}
              onChange={(value) =>
                dispatch(setScheduleDayOfWeek(value as DayOfWeek))
              }
              initialValue={addRuleModalState.scheduleDayOfWeek.value}
            />
          )}
          {addRuleModalState.scheduleTime.visible && (
            <TimeInput
              onChange={(value) => dispatch(setScheduleTime(value))}
              label={addRuleModalState.scheduleTime.label}
              disabled={addRuleModalState.scheduleTime.disabled}
              initialValue={addRuleModalState.scheduleTime.value}
              placeholder={addRuleModalState.scheduleTime.placeholder}
            />
          )}
          {addRuleModalState.scheduleChats.visible && (
            <ChipSelector
              options={addRuleModalState.scheduleChats.options}
              onChange={(value) => dispatch(setScheduleChatIds(value))}
              label={addRuleModalState.scheduleChats.label}
              initialValue={addRuleModalState.scheduleChats.value}
            ></ChipSelector>
          )}
          <SelectorInput
            options={addRuleModalState.responseType.options}
            label={addRuleModalState.responseType.label}
            onChange={(value) =>
              dispatch(setResponseType(value as RuleResponseType))
            }
            initialValue={addRuleModalState.responseType.value}
          />
          {addRuleModalState.text.visible && (
            <TextInput
              label={addRuleModalState.text.label}
              disabled={addRuleModalState.text.disabled}
              onChange={(value) => dispatch(setText(value))}
              initialValue={addRuleModalState.text.value}
            />
          )}
          {addRuleModalState.stickerId.visible && (
            <TextInput
              label={addRuleModalState.stickerId.label}
              disabled={addRuleModalState.stickerId.disabled}
              onChange={(value) => dispatch(setStickerId(value))}
              initialValue={addRuleModalState.stickerId.value}
            />
          )}
          {addRuleModalState.reply.visible && (
            <ToggleInput
              label={addRuleModalState.reply.label}
              disabled={addRuleModalState.reply.disabled}
              initialValue={addRuleModalState.reply.value}
              onChange={(value) => dispatch(setReply(value))}
            />
          )}
          {addRuleModalState.emoji.visible && (
            <SelectorInput
              options={addRuleModalState.emoji.options}
              label={addRuleModalState.emoji.label}
              disabled={addRuleModalState.emoji.disabled}
              onChange={(value) => dispatch(setEmoji(value))}
              initialValue={addRuleModalState.emoji.value}
            />
          )}
          <NumberInput
            label={addRuleModalState.probability.label}
            disabled={addRuleModalState.probability.disabled}
            onChange={(value) => dispatch(setProbability(value))}
            initialValue={addRuleModalState.probability.value}
            min={addRuleModalState.probability.min}
            max={addRuleModalState.probability.max}
          />
        </div>
      }
      bottom={
        <div className="flex space-x-3 w-full pl-[50%]">
          <Button
            type="outline"
            color="secondary"
            text={addRuleModalState.cancel.text}
            onClick={() => dispatch(closeAddRuleModal())}
          />
          <Button
            type="fill"
            color="primary"
            text={addRuleModalState.apply.text}
            loading={addRuleModalState.apply.loading}
            onClick={() => dispatch(addRuleRequest())}
          />
        </div>
      }
    />
  );
};
