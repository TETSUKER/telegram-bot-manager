export type MessageLengthOperator = '>' | '<' | '>=' | '<=' | '=';

export type RuleCondition =
  | { type: 'regex', pattern: string }
  | { type: 'length', operator: MessageLengthOperator, value: number }
  | { type: 'command', name: string }

export type RuleResponse =
  | { type: 'message', text: string, reply: boolean }
  | { type: 'sticker', stickerId: string, reply: boolean }
  | { type: 'emoji', emoji: string }

export interface NewRule {
  name: string;
  condition: RuleCondition;
  response: RuleResponse;
  probability: number | null;
}

export interface Rule extends NewRule {
  id: number;
}

export interface FilterRuleApi {
  id?: number;
  name?: string;
  conditionType?: 'regex' | 'length' | 'command';
  responseType?: 'message' | 'sticker' | 'emoji';
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

export type ConditionDbRule = RegexConditionDbRule | LengthConditionDbRule | CommandConditionDbRule;

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

export type ResponseDbRule = MessageResponseDbRule | StickerResponseDbRule | EmojiResponseDbRule;

export interface BaseDbRule {
  date_added: Date;
  name: string;
  probability: number | null;
}

export type NewDbRule = BaseDbRule & ConditionDbRule & ResponseDbRule;

export type DbRule = {
  id: number;
} & NewDbRule;

export type UpdateDbRule = Partial<NewDbRule>;

export type CreateDbRuleTable =
  RegexConditionDbRule &
  LengthConditionDbRule &
  CommandConditionDbRule &
  MessageResponseDbRule &
  StickerResponseDbRule &
  EmojiResponseDbRule &
  BaseDbRule;
