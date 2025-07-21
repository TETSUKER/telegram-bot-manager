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
  closeEditRuleModal,
  editRuleRequest,
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
} from "store/rules/editRuleModalSlice";
import {
  DayOfWeek,
  MessageLengthOperator,
  RuleConditionType,
  RuleResponseType,
  ScheduleType,
} from "api/rules";

export const EditRuleModal: React.FC = () => {
  const editRuleModalState = useAppSelector(
    (state) => state.rule.editRuleModal
  );
  const dispatch = useAppDispatch();

  return (
    <Modal
      isOpen={editRuleModalState.isOpened}
      isLoading={editRuleModalState.isLoading}
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-medium text-white">Edit rule</h2>
          <XIcon
            className="size-6 text-slate-400 cursor-pointer"
            onClick={() => dispatch(closeEditRuleModal())}
          />
        </div>
      }
      content={
        <div className="flex flex-col gap-y-2">
          <TextInput
            label={editRuleModalState.name.label}
            disabled={editRuleModalState.name.disabled}
            onChange={(value) => dispatch(setRuleName(value))}
            initialValue={editRuleModalState.name.value}
          />
          <SelectorInput
            options={editRuleModalState.conditionType.options}
            label={editRuleModalState.conditionType.label}
            onChange={(value) =>
              dispatch(setConditionType(value as RuleConditionType))
            }
            initialValue={editRuleModalState.conditionType.value}
          />
          {editRuleModalState.pattern.visible && (
            <TextInput
              label={editRuleModalState.pattern.label}
              disabled={editRuleModalState.pattern.disabled}
              onChange={(value) => dispatch(setPattern(value))}
              initialValue={editRuleModalState.pattern.value}
            />
          )}
          {editRuleModalState.lengthOperator.visible && (
            <SelectorInput
              options={editRuleModalState.lengthOperator.options}
              label={editRuleModalState.lengthOperator.label}
              onChange={(value) =>
                dispatch(setLengthOperator(value as MessageLengthOperator))
              }
              initialValue={editRuleModalState.lengthOperator.value}
            />
          )}
          {editRuleModalState.lengthValue.visible && (
            <NumberInput
              min={editRuleModalState.lengthValue.min}
              max={editRuleModalState.lengthValue.max}
              label={editRuleModalState.lengthValue.label}
              disabled={editRuleModalState.lengthValue.disabled}
              onChange={(value) => dispatch(setLengthValue(value))}
              initialValue={editRuleModalState.lengthValue.value}
            />
          )}
          {editRuleModalState.commandName.visible && (
            <TextInput
              label={editRuleModalState.commandName.label}
              disabled={editRuleModalState.commandName.disabled}
              onChange={(value) => dispatch(setCommandName(value))}
              initialValue={editRuleModalState.commandName.value}
            />
          )}
          {editRuleModalState.scheduleType.visible && (
            <SelectorInput
              options={editRuleModalState.scheduleType.options}
              label={editRuleModalState.scheduleType.label}
              onChange={(value) =>
                dispatch(setScheduleType(value as ScheduleType))
              }
              initialValue={editRuleModalState.scheduleType.value}
            />
          )}
          {editRuleModalState.scheduleMonth.visible && (
            <SelectorInput<number>
              options={editRuleModalState.scheduleMonth.options}
              label={editRuleModalState.scheduleMonth.label}
              onChange={(value) => dispatch(setScheduleMonth(value))}
              initialValue={editRuleModalState.scheduleMonth.value}
            />
          )}
          {editRuleModalState.scheduleDay.visible && (
            <NumberInput
              label={editRuleModalState.scheduleDay.label}
              disabled={editRuleModalState.scheduleDay.disabled}
              onChange={(value) => dispatch(setScheduleDay(value))}
              initialValue={editRuleModalState.scheduleDay.value}
              min={editRuleModalState.scheduleDay.min}
              max={editRuleModalState.scheduleDay.max}
            />
          )}
          {editRuleModalState.scheduleDayOfWeek.visible && (
            <SelectorInput
              options={editRuleModalState.scheduleDayOfWeek.options}
              label={editRuleModalState.scheduleDayOfWeek.label}
              onChange={(value) =>
                dispatch(setScheduleDayOfWeek(value as DayOfWeek))
              }
              initialValue={editRuleModalState.scheduleDayOfWeek.value}
            />
          )}
          {editRuleModalState.scheduleTime.visible && (
            <TimeInput
              onChange={(value) => dispatch(setScheduleTime(value))}
              label={editRuleModalState.scheduleTime.label}
              disabled={editRuleModalState.scheduleTime.disabled}
              initialValue={editRuleModalState.scheduleTime.value}
              placeholder={editRuleModalState.scheduleTime.placeholder}
            />
          )}
          {editRuleModalState.scheduleChats.visible && (
            <ChipSelector
              options={editRuleModalState.scheduleChats.options}
              onChange={(value) => dispatch(setScheduleChatIds(value))}
              label={editRuleModalState.scheduleChats.label}
              initialValue={editRuleModalState.scheduleChats.value}
            ></ChipSelector>
          )}
          <SelectorInput
            options={editRuleModalState.responseType.options}
            label={editRuleModalState.responseType.label}
            onChange={(value) =>
              dispatch(setResponseType(value as RuleResponseType))
            }
            initialValue={editRuleModalState.responseType.value}
          />
          {editRuleModalState.text.visible && (
            <TextInput
              label={editRuleModalState.text.label}
              disabled={editRuleModalState.text.disabled}
              onChange={(value) => dispatch(setText(value))}
              initialValue={editRuleModalState.text.value}
            />
          )}
          {editRuleModalState.stickerId.visible && (
            <TextInput
              label={editRuleModalState.stickerId.label}
              disabled={editRuleModalState.stickerId.disabled}
              onChange={(value) => dispatch(setStickerId(value))}
              initialValue={editRuleModalState.stickerId.value}
            />
          )}
          {editRuleModalState.reply.visible && (
            <ToggleInput
              label={editRuleModalState.reply.label}
              disabled={editRuleModalState.reply.disabled}
              initialValue={editRuleModalState.reply.value}
              onChange={(value) => dispatch(setReply(value))}
            />
          )}
          {editRuleModalState.emoji.visible && (
            <SelectorInput
              options={editRuleModalState.emoji.options}
              label={editRuleModalState.emoji.label}
              disabled={editRuleModalState.emoji.disabled}
              onChange={(value) => dispatch(setEmoji(value))}
              initialValue={editRuleModalState.emoji.value}
            />
          )}
          <NumberInput
            label={editRuleModalState.probability.label}
            disabled={editRuleModalState.probability.disabled}
            onChange={(value) => dispatch(setProbability(value))}
            initialValue={editRuleModalState.probability.value}
            min={editRuleModalState.probability.min}
            max={editRuleModalState.probability.max}
          />
        </div>
      }
      bottom={
        <div className="flex space-x-3 w-full pl-[50%]">
          <Button
            type="outline"
            color="secondary"
            text={editRuleModalState.cancel.text}
            onClick={() => dispatch(closeEditRuleModal())}
          />
          <Button
            type="fill"
            color="primary"
            text={editRuleModalState.apply.text}
            loading={editRuleModalState.apply.loading}
            onClick={() => dispatch(editRuleRequest())}
          />
        </div>
      }
    />
  );
};
