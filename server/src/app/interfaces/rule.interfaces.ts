export type MessageLengthOperator = '>' | '<' | '>=' | '<=' | '=';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type Schedule =
  | { type: 'weekly', dayOfWeek: DayOfWeek, hour: number, minute: number }
  | { type: 'annually', day: number, month: number, hour: number, minute: number }
  | { type: 'daily', hour: number, minute: number }

export type RuleCondition =
  | { type: 'regex', pattern: string }
  | { type: 'length', operator: MessageLengthOperator, value: number }
  | { type: 'command', name: string }
  | { type: 'schedule', schedule: Schedule, scheduleChatIds: number[] }

export type RuleResponse =
  | { type: 'message', text: string, reply: boolean }
  | { type: 'sticker', stickerId: string, reply: boolean }
  | { type: 'emoji', emoji: string }
  | { type: 'random_joke' | 'find_joke' | 'joke_rating' | 'get_joke_by_id' }

export interface NewRule {
  name: string;
  condition: RuleCondition;
  response: RuleResponse;
  probability: number | null;
}

export interface Rule extends NewRule {
  id: number;
}

export interface UpdateRuleApi extends Partial<NewRule> {
  id: number;
}

export interface FilterRuleApi {
  ids?: number[];
  names?: string[];
  conditionTypes?: ('regex' | 'length' | 'command' | 'schedule')[];
  responseTypes?: ('message' | 'sticker' | 'emoji' | 'joke')[];
  scheduleChatIds?: number[];
}

interface RegexConditionDbRule {
  condition_type: 'regex';
  regex_pattern: string;
}

interface LengthConditionDbRule {
  condition_type: 'length';
  length_operator: MessageLengthOperator;
  length_value: number;
}

interface CommandConditionDbRule {
  condition_type: 'command';
  command_name: string;
}

interface WeeklyScheduleDb {
  condition_type: 'schedule';
  schedule_type: 'weekly';
  schedule_day_of_week: DayOfWeek;
  schedule_hour: number;
  schedule_minute: number;
  schedule_chat_ids: number[];
}

interface AnnuallyScheduleDb {
  condition_type: 'schedule';
  schedule_type: 'annually';
  schedule_month: number;
  schedule_day: number;
  schedule_hour: number;
  schedule_minute: number;
  schedule_chat_ids: number[];
}

interface DailyScheduleDb {
  condition_type: 'schedule';
  schedule_type: 'daily';
  schedule_hour: number;
  schedule_minute: number;
  schedule_chat_ids: number[];
}

export type ScheduleConditionDbRule = WeeklyScheduleDb | AnnuallyScheduleDb | DailyScheduleDb;

export type ConditionDbRule = RegexConditionDbRule | LengthConditionDbRule | CommandConditionDbRule | ScheduleConditionDbRule;

interface MessageResponseDbRule {
  response_type: 'message';
  response_text: string;
  response_reply: boolean;
}

interface StickerResponseDbRule {
  response_type: 'sticker';
  response_sticker_id: string;
  response_reply: boolean;
}

interface EmojiResponseDbRule {
  response_type: 'emoji';
  response_emoji: string;
}

interface JokeResponseDbRule {
  response_type: 'random_joke' | 'find_joke' | 'joke_rating' | 'get_joke_by_id';
}

export type ResponseDbRule = MessageResponseDbRule | StickerResponseDbRule | EmojiResponseDbRule | JokeResponseDbRule;

export interface BaseDbRule {
  date_added: string;
  name: string;
  probability: number | null;
}

export type NewDbRule = BaseDbRule & ConditionDbRule & ResponseDbRule;

export type DbRule = {
  id: number;
} & NewDbRule;

export type UpdateDbRule = Partial<NewDbRule>;

export type CreateDbRuleTable =
  ConditionDbRule &
  MessageResponseDbRule &
  StickerResponseDbRule &
  EmojiResponseDbRule &
  BaseDbRule;
