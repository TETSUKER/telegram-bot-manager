export type MessageLengthOperator = '>' | '<' | '>=' | '<=' | '=';

export type MessageCondition =
  | { type: 'regex', pattern: string }
  | { type: 'length', operator: MessageLengthOperator, value: number }
  | { type: 'command', name: string }

export type MessageResponse =
  | { type: 'message', text: string, reply: boolean }
  | { type: 'sticker', stickerId: string, reply: boolean }
  | { type: 'emoji', emoji: string }

export interface NewMessageRule {
  name: string;
  condition: MessageCondition;
  response: MessageResponse;
  probability: number | null;
}

export interface MessageRule extends NewMessageRule {
  id: number;
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
