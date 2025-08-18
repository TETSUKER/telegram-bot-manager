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
  closeUpdateRuleModal,
  updateRuleRequest,
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
} from "store/rules/updateRuleModalSlice";
import {
  DayOfWeek,
  MessageLengthOperator,
  RuleConditionType,
  RuleResponseType,
  ScheduleType,
} from "api/rules";

export const UpdateRuleModal: React.FC = () => {
  const updateRuleModalState = useAppSelector(
    (state) => state.rule.updateRuleModal
  );
  const dispatch = useAppDispatch();

  return (
    <Modal
      isOpen={updateRuleModalState.isOpened}
      isLoading={updateRuleModalState.isLoading}
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-medium text-white">Update rule</h2>
          <XIcon
            className="size-6 text-slate-400 cursor-pointer"
            onClick={() => dispatch(closeUpdateRuleModal())}
          />
        </div>
      }
      content={
        <div className="flex flex-col gap-y-2">
          <TextInput
            label={updateRuleModalState.name.label}
            disabled={updateRuleModalState.name.disabled}
            onChange={(value) => dispatch(setRuleName(value))}
            initialValue={updateRuleModalState.name.value}
          />
          <SelectorInput
            options={updateRuleModalState.conditionType.options}
            label={updateRuleModalState.conditionType.label}
            onChange={(value) =>
              dispatch(setConditionType(value as RuleConditionType))
            }
            initialValue={updateRuleModalState.conditionType.value}
          />
          {updateRuleModalState.pattern.visible && (
            <TextInput
              label={updateRuleModalState.pattern.label}
              disabled={updateRuleModalState.pattern.disabled}
              onChange={(value) => dispatch(setPattern(value))}
              initialValue={updateRuleModalState.pattern.value}
            />
          )}
          {updateRuleModalState.lengthOperator.visible && (
            <SelectorInput
              options={updateRuleModalState.lengthOperator.options}
              label={updateRuleModalState.lengthOperator.label}
              onChange={(value) =>
                dispatch(setLengthOperator(value as MessageLengthOperator))
              }
              initialValue={updateRuleModalState.lengthOperator.value}
            />
          )}
          {updateRuleModalState.lengthValue.visible && (
            <NumberInput
              min={updateRuleModalState.lengthValue.min}
              max={updateRuleModalState.lengthValue.max}
              label={updateRuleModalState.lengthValue.label}
              disabled={updateRuleModalState.lengthValue.disabled}
              onChange={(value) => dispatch(setLengthValue(value))}
              initialValue={updateRuleModalState.lengthValue.value}
            />
          )}
          {updateRuleModalState.commandName.visible && (
            <TextInput
              label={updateRuleModalState.commandName.label}
              disabled={updateRuleModalState.commandName.disabled}
              onChange={(value) => dispatch(setCommandName(value))}
              initialValue={updateRuleModalState.commandName.value}
            />
          )}
          {updateRuleModalState.scheduleType.visible && (
            <SelectorInput
              options={updateRuleModalState.scheduleType.options}
              label={updateRuleModalState.scheduleType.label}
              onChange={(value) =>
                dispatch(setScheduleType(value as ScheduleType))
              }
              initialValue={updateRuleModalState.scheduleType.value}
            />
          )}
          {updateRuleModalState.scheduleMonth.visible && (
            <SelectorInput<number>
              options={updateRuleModalState.scheduleMonth.options}
              label={updateRuleModalState.scheduleMonth.label}
              onChange={(value) => dispatch(setScheduleMonth(value))}
              initialValue={updateRuleModalState.scheduleMonth.value}
            />
          )}
          {updateRuleModalState.scheduleDay.visible && (
            <NumberInput
              label={updateRuleModalState.scheduleDay.label}
              disabled={updateRuleModalState.scheduleDay.disabled}
              onChange={(value) => dispatch(setScheduleDay(value))}
              initialValue={updateRuleModalState.scheduleDay.value}
              min={updateRuleModalState.scheduleDay.min}
              max={updateRuleModalState.scheduleDay.max}
            />
          )}
          {updateRuleModalState.scheduleDayOfWeek.visible && (
            <SelectorInput
              options={updateRuleModalState.scheduleDayOfWeek.options}
              label={updateRuleModalState.scheduleDayOfWeek.label}
              onChange={(value) =>
                dispatch(setScheduleDayOfWeek(value as DayOfWeek))
              }
              initialValue={updateRuleModalState.scheduleDayOfWeek.value}
            />
          )}
          {updateRuleModalState.scheduleTime.visible && (
            <TimeInput
              onChange={(value) => dispatch(setScheduleTime(value))}
              label={updateRuleModalState.scheduleTime.label}
              disabled={updateRuleModalState.scheduleTime.disabled}
              initialValue={updateRuleModalState.scheduleTime.value}
              placeholder={updateRuleModalState.scheduleTime.placeholder}
            />
          )}
          {updateRuleModalState.scheduleChats.visible && (
            <ChipSelector
              options={updateRuleModalState.scheduleChats.options}
              onChange={(value) => dispatch(setScheduleChatIds(value))}
              label={updateRuleModalState.scheduleChats.label}
              value={updateRuleModalState.scheduleChats.value}
            ></ChipSelector>
          )}
          <SelectorInput
            options={updateRuleModalState.responseType.options}
            label={updateRuleModalState.responseType.label}
            onChange={(value) =>
              dispatch(setResponseType(value as RuleResponseType))
            }
            initialValue={updateRuleModalState.responseType.value}
          />
          {updateRuleModalState.text.visible && (
            <TextInput
              label={updateRuleModalState.text.label}
              disabled={updateRuleModalState.text.disabled}
              onChange={(value) => dispatch(setText(value))}
              initialValue={updateRuleModalState.text.value}
            />
          )}
          {updateRuleModalState.stickerId.visible && (
            <TextInput
              label={updateRuleModalState.stickerId.label}
              disabled={updateRuleModalState.stickerId.disabled}
              onChange={(value) => dispatch(setStickerId(value))}
              initialValue={updateRuleModalState.stickerId.value}
            />
          )}
          {updateRuleModalState.reply.visible && (
            <ToggleInput
              label={updateRuleModalState.reply.label}
              disabled={updateRuleModalState.reply.disabled}
              initialValue={updateRuleModalState.reply.value}
              onChange={(value) => dispatch(setReply(value))}
            />
          )}
          {updateRuleModalState.emoji.visible && (
            <SelectorInput
              options={updateRuleModalState.emoji.options}
              label={updateRuleModalState.emoji.label}
              disabled={updateRuleModalState.emoji.disabled}
              onChange={(value) => dispatch(setEmoji(value))}
              initialValue={updateRuleModalState.emoji.value}
            />
          )}
          <NumberInput
            label={updateRuleModalState.probability.label}
            disabled={updateRuleModalState.probability.disabled}
            onChange={(value) => dispatch(setProbability(value))}
            initialValue={updateRuleModalState.probability.value}
            min={updateRuleModalState.probability.min}
            max={updateRuleModalState.probability.max}
          />
        </div>
      }
      bottom={
        <div className="flex space-x-3 w-full pl-[50%]">
          <Button
            type="outline"
            color="secondary"
            text={updateRuleModalState.cancel.text}
            onClick={() => dispatch(closeUpdateRuleModal())}
          />
          <Button
            type="fill"
            color="primary"
            text={updateRuleModalState.apply.text}
            loading={updateRuleModalState.apply.loading}
            onClick={() => dispatch(updateRuleRequest())}
          />
        </div>
      }
    />
  );
};
