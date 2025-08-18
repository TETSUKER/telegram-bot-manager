import { baseUrl } from "./baseUrl";
import { parseResponse } from "./parseResponse";

export enum MessageLengthOperator {
  moreThan = ">",
  lessThan = "<",
  moreOrEqualThan = ">=",
  lessOrEqualThan = "<=",
  equal = "=",
}

export enum DayOfWeek {
  monday = "monday",
  tuesday = "tuesday",
  wednesday = "wednesday",
  thursday = "thursday",
  friday = "friday",
  saturday = "saturday",
  sunday = "sunday",
}

export enum Month {
  january = "january",
  february = "february",
  march = "march",
  april = "april",
  may = "may",
  june = "june",
  july = "july",
  august = "august",
  september = "september",
  october = "october",
  november = "november",
  december = "december",
}

export enum ScheduleType {
  weekly = "weekly",
  annually = "annually",
}
export enum RuleConditionType {
  regex = "regex",
  length = "length",
  command = "command",
  schedule = "schedule",
}
export enum RuleResponseType {
  message = "message",
  sticker = "sticker",
  emoji = "emoji",
  random_joke = "random_joke",
  find_joke = "find_joke",
  joke_rating = "joke_rating",
}

export type Schedule =
  | {
      type: ScheduleType.weekly;
      dayOfWeek: DayOfWeek;
      hour: number;
      minute: number;
    }
  | {
      type: ScheduleType.annually;
      day: number;
      month: number;
      hour: number;
      minute: number;
    };

export type RuleCondition =
  | { type: RuleConditionType.regex; pattern: string }
  | {
      type: RuleConditionType.length;
      operator: MessageLengthOperator;
      value: number;
    }
  | { type: RuleConditionType.command; name: string }
  | {
      type: RuleConditionType.schedule;
      schedule: Schedule;
      scheduleChatIds: number[];
    };

export type RuleResponse =
  | { type: RuleResponseType.message; text: string; reply: boolean }
  | { type: RuleResponseType.sticker; stickerId: string; reply: boolean }
  | { type: RuleResponseType.emoji; emoji: string }
  | {
      type:
        | RuleResponseType.random_joke
        | RuleResponseType.find_joke
        | RuleResponseType.joke_rating;
    };

export interface NewRule {
  name: string;
  condition: RuleCondition;
  response: RuleResponse;
  probability: number | null;
}

export interface ServerRule extends NewRule {
  id: number;
}

export async function getRules(): Promise<ServerRule[]> {
  const path = baseUrl + "/getRules";
  const response = await fetch(path, {
    method: "POST",
    body: JSON.stringify({}),
  });
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  return response.json();
}

export async function updateRule(rule: ServerRule): Promise<any> {
  const path = baseUrl + "/updateRule";
  try {
    const response = await fetch(path, {
      method: "POST",
      body: JSON.stringify({ ...rule }),
    });

    if (!response.ok) {
      const result = await response.json();
      throw result.error;
    } else {
      return response;
    }
  } catch (err) {
    throw err;
  }
}

export async function createRule(rule: NewRule): Promise<any> {
  const path = baseUrl + "/addRule";
  try {
    const response = await fetch(path, {
      method: "POST",
      body: JSON.stringify({ ...rule }),
    });

    if (!response.ok) {
      throw await parseResponse(response);
    } else {
      return parseResponse(response);
    }
  } catch (err) {
    throw err;
  }
}

export async function deleteRules(ids: number[]): Promise<Response> {
  const path = baseUrl + "/removeRules";
  const response = await fetch(path, {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
  // await new Promise(resolve => setTimeout(resolve, 1000));
  return response;
}
